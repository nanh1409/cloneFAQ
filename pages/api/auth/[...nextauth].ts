import { OAuth2Client } from "google-auth-library";
import { NextApiRequest, NextApiResponse } from "next";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { apiGetUserByToken, apiLoginWithGoogle } from "../../../features/auth/auth.api";
import useAppConfig from "../../../hooks/useAppConfig";
import { LOGIN_SUCCESS } from "../../../modules/share/constraint";
import { GOOGLE_ONE_TAP_PROVIDER } from "../../../types/SSO";

const googleAuthClient = new OAuth2Client(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID);

async function refreshAccessToken(token: any) {
  if (!token.refesh_token) return token;
  try {
    const url =
      "https://oauth2.googleapis.com/token?" +
      new URLSearchParams({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        grant_type: "refresh_token",
        refresh_token: token.refesh_token,
      })

    const response = await fetch(url, { headers: { "Content-Type": "application/x-www-form-urlencoded" }, method: "POST" });

    const data = await response.json()

    if (!response.ok) {
      throw data;
    }

    return {
      ...token,
      access_token: data.access_token,
      expireAt: data.expires_at * 1000,
      refresh_token: data.refresh_token ?? token.refresh_token, // Fall back to old refresh token
    }
  } catch (error) {
    console.log(error);
    return {
      ...token,
      error: "RefreshAccessTokenError",
    }
  }
}

export default async function (req: NextApiRequest, res: NextApiResponse) {
  return NextAuth(req, res, {
    providers: [
      GoogleProvider({
        clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        authorization: {
          params: {
            prompt: "consent",
            response_type: "code",
            access_type: "offline"
          }
        }
      }),
      Credentials<{ credential: { type: string; } }>({
        id: GOOGLE_ONE_TAP_PROVIDER,
        name: "google-one-tap",
        credentials: { credential: { type: "text" } },
        authorize: async (credentials) => {
          const token = credentials.credential;
          const ticket = await googleAuthClient.verifyIdToken({
            idToken: token,
            audience: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
          });
          const payload = ticket.getPayload();
          if (!payload) throw new Error("Cannot extract payload from signin token");
          return payload as any;
        }
      })
    ],
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
      jwt: async ({ token, user, account, isNewUser, profile }) => {
        if (account && user) {
          if (account.provider === GOOGLE_ONE_TAP_PROVIDER) {
            // console.log("jwt", token);
            return {
              ...token,
              // @ts-ignore
              loginToken: user.loginToken,
              // @ts-ignore
              expireAt: user.exp * 1000,
              from: GOOGLE_ONE_TAP_PROVIDER,
              user
            }
          } else if (account.provider === "google") {
            return {
              ...token,
              // @ts-ignore
              loginToken: user.loginToken,
              access_token: account.access_token,
              refesh_token: account.refresh_token,
              expireAt: account.expires_at * 1000,
              from: "google",
              user
            }
          }
        }
        // @ts-ignore
        if (Date.now() < token.exprieAt) {
          return token;
        }
        return refreshAccessToken(token);
      },
      session: async ({ session, token, user }) => {
        const { appName } = useAppConfig();
        const loginToken = token.loginToken as string;
        const provider = token.from as string;
        if (provider === GOOGLE_ONE_TAP_PROVIDER || provider === "google") {
          if (!loginToken) return session;
          const loginData = await apiGetUserByToken(loginToken);
          if (!!loginData) {
            session.user = loginData;
            // @ts-ignore
            session.loginToken = loginToken;
            // @ts-ignore
          } else if (Date.now() < token.expireAt) {
            // @ts-ignore
            const loginData = await apiLoginWithGoogle({ email: token.email, account: token.email, name: token.name, appLogin: true, appName });
            if (loginData?.loginCode !== LOGIN_SUCCESS) return session;
            session.user = loginData;
            // @ts-ignore
            session.loginToken = loginData.token;
          }
          return session;
        }
        return session;
      },
      signIn: async ({ account, user }) => {
        const _localRegisterTime = req.query.localRegisterTime;
        const localRegisterTime = typeof _localRegisterTime === "string" && !isNaN(+_localRegisterTime) ? +_localRegisterTime : undefined;
        const { appName } = useAppConfig();
        if (account.provider === GOOGLE_ONE_TAP_PROVIDER) {
          // @ts-ignore
          const { email, name, picture: avatar } = user;
          const loginData = await apiLoginWithGoogle({ email, account: email, name, avatar, appLogin: true, appName, localRegisterTime });
          if (loginData.loginCode !== LOGIN_SUCCESS) return false;
          // @ts-ignore
          user.loginToken = loginData.token;
          return true;
        } else if (account.provider === "google") {
          const { name, email, image: avatar } = user;
          const loginData = await apiLoginWithGoogle({ email, account: email, name, avatar, appLogin: true, appName, localRegisterTime });
          if (loginData.loginCode !== LOGIN_SUCCESS) return false;
          // @ts-ignore
          user.loginToken = loginData.token;
          return true;
        }
        return false;
      }
    }
  });
}
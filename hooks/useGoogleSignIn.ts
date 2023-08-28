import { unwrapResult } from "@reduxjs/toolkit";
import { getSession, signIn, SignInOptions, signOut, useSession } from "next-auth/react";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "../app/hooks";
import { LOCAL_REGISTER_TIME_KEY } from "../features/auth/auth.config";
import { fetchUserByToken } from "../features/auth/auth.slice";
import { GOOGLE_ONE_TAP_PROVIDER } from "../types/SSO";

const useGoogleSignIn = (args: {
  parentContainerId?: string;
} & Pick<SignInOptions, "redirect" | "callbackUrl"> = {}) => {
  const { data: session, status } = useSession();
  const { token, loading: authLoading, user } = useSelector((state) => state.authState);
  const { parentContainerId } = args;
  const [isLoading, setLoading] = useState(false);
  const [isSignedIn, setSignedIn] = useState(false);
  const [checkedAppSession, setCheckedAppSession] = useState(false);
  const isClient = typeof window !== "undefined";
  const localRegisterTime = useMemo(() =>
    isClient ? localStorage.getItem(LOCAL_REGISTER_TIME_KEY) : ""
    , [isClient]);
  // @ts-ignore
  // const isLoadedGoogle = typeof window !== "undefined" && typeof window.google !== "undefined";
  const dispatch = useDispatch();

  useEffect(() => {
    if (session) setSignedIn(true);
  }, [session]);

  useEffect(() => {
    if (!checkedAppSession && !authLoading) {
      if (!user) {
        setCheckedAppSession(true);
      }
    }
  }, [checkedAppSession, authLoading]);

  useEffect(() => {
    if (!!checkedAppSession) {
      _getSession(() => {
        if (isClient) {
          if (!isSignedIn && !isLoading) {
            const google = window.google;
            if (google) {
              google.accounts.id.initialize({
                client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
                callback: async (response) => {
                  setLoading(true);
                  await signIn(GOOGLE_ONE_TAP_PROVIDER, {
                    credential: response.credential,
                    redirect: false,
                  }, { localRegisterTime });
                  setLoading(false);
                },
                prompt_parent_id: parentContainerId
              });

              if (!!parentContainerId) {
                // Promp One Tap
                google.accounts.id.prompt((notification) => {
                  // if (notification.isNotDisplayed()) {
                  //   console.log("getNotDisplayedReason", notification.getNotDisplayedReason);
                  // } else if (notification.isDismissedMoment()) {
                  //   console.log("isDismissedMoment", notification.getDismissedReason());
                  // } else if (notification.isSkippedMoment()) {
                  //   console.log("isSkippedMoment", notification.getSkippedReason());
                  // }
                })
              }
            }
          }
        }
      })
    }
  }, [isLoading, isSignedIn, checkedAppSession]);

  const _getSession = async (callback: () => void) => {
    const authSession = await getSession();
    // @ts-ignore
    if (authSession?.loginToken) {
      if (!isLoading) {
        // @ts-ignore
        const action = await dispatch(fetchUserByToken(authSession.loginToken));
        const { user } = unwrapResult(action);
        if (!user) {
          await signOut({ redirect: false });
          callback();
        }
      }
    } else {
      if (checkedAppSession && !user) {
        callback();
      }
    }
  }
}

export default useGoogleSignIn;
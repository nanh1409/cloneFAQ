import { getSession, signIn, useSession } from "next-auth/react";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "../../app/hooks";
import { LOGIN_SUCCESS } from "../../modules/share/constraint";
import { GOOGLE_ONE_TAP_PROVIDER } from "../../types/SSO";
import { LOCAL_REGISTER_TIME_KEY } from "./auth.config";
import { setLoginCode, setToken, setUserInfo } from "./auth.slice";

const useRenderGoogleSignInButton = (args: {
  buttonContainerId?: string;
}) => {
  const { buttonContainerId } = args;
  // const {  } = useSelector((state) => state.authState);
  const [isLoading, setLoading] = useState(false);
  const [isSignedIn, setSignedIn] = useState(false);
  const isLoadedGoogle = typeof window !== "undefined" && typeof window.google !== "undefined";
  const { data: session } = useSession();
  const dispatch = useDispatch();
  const isClient = typeof window !== "undefined";
  const localRegisterTime = useMemo(() =>
    isClient ? localStorage.getItem(LOCAL_REGISTER_TIME_KEY) : ""
    , [isClient]);

  useEffect(() => {
    if (session) {
      // @ts-ignore
      const { user, loginToken } = session;
      dispatch(setUserInfo(user as any));
      dispatch(setToken(loginToken));
      dispatch(setLoginCode(LOGIN_SUCCESS));
      setSignedIn(true);
    }
  }, [session]);

  useEffect(() => {
    if (isLoadedGoogle && !isLoading && !isSignedIn) {
      google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        callback: async (response) => {
          setLoading(true);
          await signIn(GOOGLE_ONE_TAP_PROVIDER, {
            credential: response.credential,
            redirect: false
          }, {
            localRegisterTime
          });
          setLoading(false);
        }
      });

      if (buttonContainerId) {
        const buttonElement = document.getElementById(buttonContainerId);
        if (buttonElement) {
          google.accounts.id.renderButton(buttonElement, { type: "standard" });
        }
      }
    }
  }, [isLoading, isSignedIn]);
}

export default useRenderGoogleSignInButton;
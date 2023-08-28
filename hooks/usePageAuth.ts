import { signOut, useSession } from "next-auth/react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "../app/hooks";
import { fetchUserByToken, fetchUserByTokenNoCache } from "../features/auth/auth.slice";

type PageAuthHookProps = {
  authorizedRedirect?: string;
  unAuthorizedRedirect?: string;
  loadedCallback?: () => void;
  noCache?: boolean;
}

const usePageAuth = (args: PageAuthHookProps = {} as PageAuthHookProps) => {
  const { authorizedRedirect, unAuthorizedRedirect, loadedCallback = () => { }, noCache } = args;
  const { token, loading, user, userId } = useSelector((state) => state.authState);
  const dispatch = useDispatch();
  const { data: session } = useSession();

  useEffect(() => {
    if (noCache) {
      dispatch(fetchUserByTokenNoCache({ token, noCache: true }));
    } else {
      dispatch(fetchUserByToken(token));
    }
  }, []);

  useEffect(() => {
    if (!loading) {
      if (!user && session) {
        signOut({ redirect: false });
      }
      if (!!user && authorizedRedirect) {
        window.location.replace(authorizedRedirect);
      } else if (!user && unAuthorizedRedirect) {
        window.location.replace(unAuthorizedRedirect);
      } else {
        loadedCallback();
      }
    }
  }, [loading]);

  return {
    loading,
    user,
    userId
  }
}

export default usePageAuth;
import { useRouter } from "next/router";
import React from 'react';
import { useSelector } from '../../app/hooks';
import { wrapper } from '../../app/store';
import AuthView from '../../components/auth/AuthView';
import Footer from '../../components/footer';
import { apiGetAppSettingDetails } from '../../features/appInfo/appInfo.api';
import { setAppInfo } from '../../features/appInfo/appInfo.slice';
import Layout from '../../features/common/Layout';
import usePageAuth from '../../hooks/usePageAuth';
import { getWebAppProps } from "../../utils/getSEOProps";

const LoginPage = () => {
  const appInfo = useSelector((state) => state.appInfos.appInfo);
  const router = useRouter();
  const redirectURI = router.query.redirect_uri as string;
  // const dispatch = useDispatch();

  // useEffect(() => {
  //   const _getSession = async () => {
  //     const authSession = await getSession();
  //     console.log("authSession", authSession);
  //     if (authSession?.user?.email) {
  //       // @ts-ignore
  //       dispatch(fetchUserByToken(authSession.loginToken));
  //     }
  //   }
  //   _getSession();
  // }, []);

  usePageAuth({ authorizedRedirect: redirectURI || "/" });

  return (
    <Layout {...getWebAppProps(appInfo)} title={"Login"} useGoogleSignInButton>
      <AuthView />
      <Footer />
    </Layout>
  )
}

export const getStaticProps = wrapper.getStaticProps(async ({ store, params }) => {
  const appName = process.env.NEXT_PUBLIC_APP_NAME;
  if (!appName) throw new Error("appName is not defined");
  const appInfo = await apiGetAppSettingDetails({ appName });
  store.dispatch(setAppInfo(appInfo));
  if (!appInfo) return {
    notFound: true
  }
  return {
    props: {
    }
  }
});

export default LoginPage
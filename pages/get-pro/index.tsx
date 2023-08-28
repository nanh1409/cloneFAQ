import dynamic from "next/dynamic";
import { useEffect } from "react";
import { useDispatch } from "../../app/hooks";
import { store, wrapper } from "../../app/store";
import { setAppInfo } from "../../features/appInfo/appInfo.slice";
import GetProPageView from "../../features/get-pro/GetProPageView";
import { apiGetAppPlans } from "../../features/get-pro/payment.api";
import { setAppPlans } from "../../features/get-pro/payment.slice";
import usePageAuth from "../../hooks/usePageAuth";
import useServerAppInfo from "../../hooks/useServerAppInfo";
import AppSetting from "../../modules/share/model/appSetting";
import { PricingPlan } from "../../modules/share/model/pricingPlan";
import { GetServerSidePropsReduxContext } from "../../types/nextReduxTypes";
import { getWebAppProps, getWebSEOProps } from "../../utils/getSEOProps";
import WebSeo from "../../modules/share/model/webSeo";
import { apiGetSEOInfo } from "../../features/appInfo/appInfo.api";

const Layout = dynamic(() => import("../../features/common/Layout"), { ssr: false });

const GetProPage = (props: {
  appInfo: AppSetting;
  appPlans: Array<PricingPlan>;
  lang: string;
  isLandingPage: boolean;
  showNavLandingPage: boolean;
  seoInfo: WebSeo | null
}) => {
  usePageAuth();

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setAppPlans(props.appPlans));
  }, []);

  return <Layout
    {...getWebSEOProps(props.seoInfo)}
    {...getWebAppProps(props.appInfo)}
    title={props.isLandingPage ? (props.seoInfo?.seoTitle ?? undefined) :"Get Pro"}
    slug={props.isLandingPage && !props.showNavLandingPage ? "/" : undefined}
    backgroundColor="#F2F5FB"
    getPro
    disableDefaultHeaderNav={props.isLandingPage && !props.showNavLandingPage}
    disableAuth={props.isLandingPage && !props.showNavLandingPage}
    homeHref={props.isLandingPage && !props.showNavLandingPage ? `${props.appInfo.siteAddress}/?utm_id=${props.appInfo?.appName}-i18n&utm_campaign=${props.appInfo?.appName}-i18n&utm_medium=article&utm_source=landing-${props.lang}&utm_content=logo` : undefined}
  >
    <GetProPageView
      isLandingPageOnly={props.isLandingPage && !props.showNavLandingPage}
      lang={props.lang}
      hideFooter={props.isLandingPage && !props.showNavLandingPage}
      hideFooterBanner={props.isLandingPage && !props.showNavLandingPage}
    />
  </Layout>;
}

export const getServerSideProps = wrapper.getServerSideProps(async ({ store, locale, defaultLocale, query }: GetServerSidePropsReduxContext) => {
  const appInfo = await useServerAppInfo(store);
  if (!appInfo) return { notFound: true };
  if (!appInfo.usingGetPro) return {
    notFound: true
    // redirect: {
    //   destination: "/",
    //   permanent: false
    // }
  }
  let seoInfo: WebSeo = null

  const appPlans = await apiGetAppPlans({ appId: appInfo._id, serverSide: true });
  let lang: string = null;
  let isLandingPage = false;
  let showNavLandingPage = false;
  if (appInfo.appName === "toeic") {
    if (locale === defaultLocale) {
      const _langQuery = query.lang;
      const _navQuery = query.nav;
      const langQuery = typeof _langQuery === "string" ? _langQuery : "";
      showNavLandingPage = typeof _navQuery === "string" && ["true", "false"].includes(_navQuery) ? !!JSON.parse(_navQuery) : false;
      if (['fr', 'jp', 'es'].includes(langQuery)) {
        lang = langQuery;
        isLandingPage = true;
        seoInfo = await apiGetSEOInfo(appInfo._id, `/get-pro/?lang=${langQuery}`);
      }
    }
  }
  return {
    props: {
      appInfo,
      appPlans,
      lang,
      isLandingPage,
      seoInfo,
      showNavLandingPage
    }
  }
});

export default GetProPage;
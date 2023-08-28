import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "../../app/hooks";
import { ROUTER_GET_PRO, ROUTER_LOGIN } from "../../app/router";
import { wrapper } from "../../app/store";
import { setAppInfo } from "../../features/appInfo/appInfo.slice";
import CheckoutPageView from "../../features/get-pro/CheckoutPageView";
import { fetchCheckingOutPlan } from "../../features/get-pro/payment.slice";
import useAppConfig from "../../hooks/useAppConfig";
import usePageAuth from "../../hooks/usePageAuth";
import useServerAppInfo from "../../hooks/useServerAppInfo";
import AppSetting from "../../modules/share/model/appSetting";
import { getWebAppProps } from "../../utils/getSEOProps";

const Layout = dynamic(() => import("../../features/common/Layout"), { ssr: false });

const GetProCheckoutPage = (props: { appInfo: AppSetting }) => {
  const { appInfo } = props;
  const appConfig = useAppConfig();
  const { loading, user } = useSelector((state) => state.authState);
  const plan = useSelector((state) => state.paymentState.checkingOutPlan);
  const router = useRouter();
  const isClient = typeof window !== "undefined";
  const dispatch = useDispatch();

  usePageAuth();

  useEffect(() => {
    if (!loading && isClient) {
      if (!user) {
        const { pathname, search, hash } = window.location;
        const redirectURI = `${pathname}${search}${hash}`;
        router.push(`/${ROUTER_LOGIN}?redirect_uri=${encodeURIComponent(redirectURI)}`);
      } else {
        const planId = router.query.planId;
        if (typeof planId === "string" && planId) {
          dispatch(fetchCheckingOutPlan(planId));
        }
      }
    }
  }, [loading, isClient]);

  return !loading
    && user
    && plan
    && plan.currencyCode === "VND"
    ? <Layout
      {...getWebAppProps(appInfo)}
      title="Get Pro | Checkout"
    >
      <CheckoutPageView plan={plan} />
    </Layout>
    : <></>
}

export const getServerSideProps = wrapper.getServerSideProps(async ({ store }) => {
  const appInfo = await useServerAppInfo(store);
  if (!appInfo) return { notFound: true };
  if (!appInfo.usingGetPro) return {
    notFound: true
  }
  return {
    props: {
      appInfo
    }
  }
});

export default GetProCheckoutPage;
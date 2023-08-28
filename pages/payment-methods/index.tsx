import { Container } from "@mui/material";
import { useDispatch, useSelector } from "../../app/hooks";
import { wrapper } from "../../app/store";
import Footer from "../../components/footer";
import {
  apiGetSEOInfo
} from "../../features/appInfo/appInfo.api";
import { setAppInfo } from "../../features/appInfo/appInfo.slice";
import Layout from "../../features/common/Layout";
import useServerAppInfo from "../../hooks/useServerAppInfo";
import { GetStaticPropsReduxContext } from "../../types/nextReduxTypes";
import { getWebAppProps, getWebSEOProps } from "../../utils/getSEOProps";

const PaymentMethodsPage = (props: { seoInfo: any }) => {
  const { seoInfo } = props;
  const appInfo = useSelector((state) => state.appInfos.appInfo);

  return (
    <Layout {...getWebSEOProps(seoInfo)} {...getWebAppProps(appInfo)} disableAuth disableAds disableFBMessenger noAlternateLink>
      {/* <Header disableAuth /> */}
      <Container maxWidth="xl">
        <div
          dangerouslySetInnerHTML={{ __html: seoInfo?.content }}
        ></div>
      </Container>
      <Footer />
    </Layout>
  );
};

export const getStaticProps = wrapper.getStaticProps(async ({ store, params, locale }: GetStaticPropsReduxContext) => {
  if (locale !== "vi") return {
    notFound: true
  };
  const appInfo = await useServerAppInfo(store);
  if (appInfo.appName !== "toeic") return {
    notFound: true
  }
  if (!appInfo) return {
    notFound: true,
  };
  const seoInfo = await apiGetSEOInfo(appInfo._id, "/vi/payment-methods");
  return {
    props: {
      seoInfo,
    },
    // revalidate: 600
  };
});

export default PaymentMethodsPage;

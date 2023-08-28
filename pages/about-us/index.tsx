import { Container } from "@mui/material";
import { useSelector } from "../../app/hooks";
import { wrapper } from "../../app/store";
import Footer from "../../components/footer";
import {
  apiGetAppSettingDetails,
  apiGetSEOInfo
} from "../../features/appInfo/appInfo.api";
import { setAppInfo } from "../../features/appInfo/appInfo.slice";
import Layout from "../../features/common/Layout";
import WebSeo from "../../modules/share/model/webSeo";
import { GetStaticPropsReduxContext } from "../../types/nextReduxTypes";
import { getWebAppProps, getWebSEOProps } from "../../utils/getSEOProps";

const AboutUsPage = (props: { seoInfo: WebSeo }) => {
  const { seoInfo } = props;
  const appInfo = useSelector((state) => state.appInfos.appInfo);

  return (
    <Layout {...getWebSEOProps(seoInfo)} {...getWebAppProps(appInfo)} disableAuth disableAds disableFBMessenger>
      <Container maxWidth="xl">
        <div
          dangerouslySetInnerHTML={{ __html: seoInfo?.content }}
        ></div>
      </Container>
      <Footer />
    </Layout>
  );
};

export const getStaticProps = wrapper.getStaticProps(async ({ store, params, locale, defaultLocale } : GetStaticPropsReduxContext) => {
  const appName = process.env.NEXT_PUBLIC_APP_NAME;
  if (!appName) throw new Error("appName is not defined");
  const appInfo = await apiGetAppSettingDetails({ appName });
  store.dispatch(setAppInfo(appInfo));
  if (!appInfo) return {
    notFound: true,
  };
  const slug = locale === defaultLocale ? "/about-us" : `/${locale}/about-us`;
  let seoInfo: WebSeo
  if (["toeic"].includes(appName)) {
    seoInfo = await apiGetSEOInfo(appInfo._id, slug);
  } else {
    seoInfo = await apiGetSEOInfo(appInfo._id, "/about-us");
  }
  return {
    props: {
      seoInfo,
    },
    // revalidate: 600
  };
});

export default AboutUsPage;

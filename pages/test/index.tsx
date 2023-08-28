import { Container, Theme, Typography } from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import classNames from "classnames";
import { useRouter } from "next/router";
import { PropsWithoutRef, useMemo } from "react";
import { useDispatch, useSelector } from "../../app/hooks";
import { wrapper } from "../../app/store";
import Footer from "../../components/footer";
import Introduction from "../../components/introduction";
import TestItemPanel from "../../components/practice-topics-section/toeic/TestItemPanel";
import GoogleAdsense from "../../features/ads/google-adsense";
// import Test from "../../components/practice-topics-section/test/Test";
import { apiGetAppSettingDetails, apiGetSEOInfo } from "../../features/appInfo/appInfo.api";
import { setAppInfo, setKeySEOInfo, setSEOInfo } from "../../features/appInfo/appInfo.slice";
import Layout from "../../features/common/Layout";
import usePageAuth from "../../hooks/usePageAuth";
import WebSeo from "../../modules/share/model/webSeo";
import { GetStaticPropsReduxContext } from "../../types/nextReduxTypes";
import { getWebAppProps, getWebSEOProps } from "../../utils/getSEOProps";

type TestPageProps = {
  seoInfo: WebSeo,
}

const useTestPageStyles = makeStyles((theme: Theme) => ({
  testTitle: { fontSize: 48, fontWeight: 700, textAlign: "center", margin: "20px 0", color: "var(--titleColor)" },
  testPartsPanel: { display: "flex", gap: "16px", [theme.breakpoints.down("lg")]: { flexDirection: "column" }, marginTop: 20, marginBottom: 10 },
  testLeftButton: {
    "& .test-item-panel": { height: 200 },
    "& .test-item-func-join-button-wrap": { justifyContent: "flex-start" },
    "& .test-item-main-title": {
      color: "#003065",
      overflow: "hidden !important",
      textOverflow: "ellipsis",
      display: "-webkit-box",
      "-webkit-box-orient": "vertical",
      "-webkit-line-clamp": "1 !important"
    },
    "& .test-item-main-desc": { color: "#003065", fontSize: 18, maxWidth: 600 }
  }
}));

const TestPage = (props: PropsWithoutRef<TestPageProps>) => {
  const { seoInfo } = props;
  const dispatch = useDispatch();
  const appInfo = useSelector((state) => state.appInfos.appInfo);
  const classes = useTestPageStyles();
  const router = useRouter();

  usePageAuth();
  const trans = useMemo(() => {
    let desciptionMiniTest = "Take mini test with the number of questions and time limit reduced by half",
      desciptionFullTest = "Take full test with the same number of questions and time limit as the actual test",
      titleSimulationTest = "TOEIC Computer - based Simulation Test",
      descriptionSimulationTest = "Computer-based simulation test with the format and testing interface as the actual test will help you carefully prepare for your test day."
    if (router.locale === "vi") {
      desciptionMiniTest = "Làm bài mini test với số lượng câu hỏi và thời gian giảm một nửa so với bài thi thật";
      desciptionFullTest = "Làm bài full test với số lượng câu hỏi và thời gian giống như bài thi thật";
      titleSimulationTest = "Thi Mô Phỏng"
      descriptionSimulationTest = "Luyện thi mô phỏng trên máy tính như thi thật giúp bạn làm quen khi bước vào kì thi chính thức";
    }
    return {
      desciptionMiniTest,
      desciptionFullTest,
      titleSimulationTest,
      descriptionSimulationTest
    }
  }, [router.locale]);

  return (<Layout {...getWebSEOProps(seoInfo)} {...getWebAppProps(appInfo)}>
    <Typography component="h1" className={classes.testTitle}>{seoInfo?.titleH1}</Typography>
    <Container maxWidth="xl">
      <div className={classNames("test-simulation-panel", classes.testPartsPanel, classes.testLeftButton)}>
        <TestItemPanel
          title={trans.titleSimulationTest}
          description={trans.descriptionSimulationTest}
          slug="/test/simulation-test"
          bgImage="/images/app/toeic/simulation-test.png"
        />
      </div>
      <div className={classNames("test-parts-panel", classes.testPartsPanel)}>
        <TestItemPanel
          title="MINI TEST"
          description={trans.desciptionMiniTest}
          slug="/test/minitest"
          bgImage="/images/app/toeic/mini-test.png"
        />

        <TestItemPanel
          title="FULL TEST"
          description={trans.desciptionFullTest}
          slug="/test/full-test"
          bgImage="/images/app/toeic/full-test.png"
        />
      </div>

      <GoogleAdsense name="TestBannerAds" height={180} style={{ marginTop: 20 }} />
    </Container>
    <Introduction content={seoInfo?.content} />
    <Footer />
  </Layout>);
}

export const getStaticProps = wrapper.getStaticProps(async ({ store, locale, defaultLocale }: GetStaticPropsReduxContext) => {
  const appName = process.env.NEXT_PUBLIC_APP_NAME;
  if (!appName) throw new Error("appName is not defined");
  if (appName !== "toeic") return {
    notFound: true
  }
  const appInfo = await apiGetAppSettingDetails({ appName });
  if (!appInfo) return {
    notFound: true
  }
  store.dispatch(setAppInfo(appInfo));
  const slug = locale === defaultLocale ? "/test" : `/${locale}/test`;
  const seoInfo = await apiGetSEOInfo(appInfo._id, slug);
  // store.dispatch(setSEOInfo(seoInfo))
  store.dispatch(setKeySEOInfo(seoInfo));

  return {
    props: {
      seoInfo,
    },
    // revalidate: 600
  }
});

export default TestPage;
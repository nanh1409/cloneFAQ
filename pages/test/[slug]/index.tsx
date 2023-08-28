import { Container } from "@mui/material";
import { GetStaticPaths, GetStaticPathsContext } from "next";
import { useRouter } from "next/router";
import { PropsWithoutRef, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "../../../app/hooks";
import { wrapper } from "../../../app/store";
import Footer from "../../../components/footer";
import Introduction from "../../../components/introduction";
import TestListView from "../../../components/test/TestListView";
import GoogleAdsense from "../../../features/ads/google-adsense";
import { apiGetAppSettingDetails, apiGetSEOInfo } from "../../../features/appInfo/appInfo.api";
import { setAppInfo, setKeySEOInfo, setSlugList } from "../../../features/appInfo/appInfo.slice";
import useSeoInfo from "../../../features/appInfo/useSeoInfo";
import Layout from "../../../features/common/Layout";
import { apiGetTopicsByParentSlug } from "../../../features/study/topic.api";
import { TopicWithUser } from "../../../features/study/topic.model";
import usePageAuth from "../../../hooks/usePageAuth";
import usePagePaymentInfo from "../../../hooks/usePagePaymentInfo";
import useServerPracticeData from "../../../hooks/useServerPracticeData";
import Topic from "../../../modules/share/model/topic";
import { GetStaticPropsReduxContext } from "../../../types/nextReduxTypes";
import { getWebAppProps, getWebSEOProps } from "../../../utils/getSEOProps";

type TestDetailPageProps = {
  // testSlug: string;
  // test: Topic;
  // testList: TopicWithUser[];
  testCourseIndex?: string;
  slug: string;
}

const SIMULATION_TEST_SLUG = "simulation-test";

const TestDetailPage = (props: PropsWithoutRef<TestDetailPageProps>) => {
  // const { testSlug, test, testList } = props;
  const { testCourseIndex, slug } = props;
  const appInfo = useSelector((state) => state.appInfos.appInfo);
  // const seoInfo = useSelector((state) => state.appInfos.seoInfo);
  const seoInfo = useSeoInfo();
  const router = useRouter();
  const dispatch = useDispatch();
  const simulatorMode = useMemo(() => slug === SIMULATION_TEST_SLUG, [slug]);

  usePageAuth();
  usePagePaymentInfo({ appName: appInfo?.appName });

  // useEffect(() => {
  //   dispatch(setSlugList({ practiceSlug: test, practiceSlugList: testList }));
  // }, [test, testList]);

  useEffect(() => {
    if (testCourseIndex && appInfo) {
      const courseId = (appInfo.courseIds ?? [])[testCourseIndex];
      if (courseId) {
        apiGetTopicsByParentSlug({
          courseId,
          slug: simulatorMode ? "full-test" : slug,
          local: false,
          countPracticedUsers: true,
          topicFields: ["_id", "name", "courseId", "orderIndex", "shortDescription", "slug", "accessLevel"],
          exerciseFields: ["questionsNum", "duration"]
        })
          .then(([topicData]) => {
            const { children = [], ...topic } = topicData || {};
            const test = topic as Topic;
            if (simulatorMode) Object.assign(test, { name: "SIMULATION TEST", slug: SIMULATION_TEST_SLUG });
            dispatch(setSlugList({ practiceSlug: test, practiceSlugList: children }))
          })
      }
    }
  }, [testCourseIndex, slug]);

  const progressBoxProps = useMemo(() => {
    let progressBgColor: string;
    let progressTextColor: string;
    let progressBorderColor: string;
    if (appInfo?.appName === "toeic") {
      progressBgColor = "#E8EEFF"; progressBorderColor = "#BACDFF"; progressTextColor = "#656EF1"
    }
    return { progressBgColor, progressBorderColor, progressTextColor }
  }, [appInfo?.appName]);

  return <Layout
    {...getWebAppProps(appInfo)}
    {...getWebSEOProps(seoInfo)}
    backgroundColor="#f6f7fb"
  >
    <Container maxWidth="lg">
      <GoogleAdsense name="TestBannerAds" height={90} style={{ marginTop: 30 }} />
      <TestListView
        {...progressBoxProps}
        useMapSeo
      />
      <Introduction useMapSeo />
    </Container>
    <Footer />
  </Layout>
}

export const getStaticPaths: GetStaticPaths = async ({ locales }: GetStaticPathsContext) => {
  const appName = process.env.NEXT_PUBLIC_APP_NAME;
  if (!appName) throw new Error("appName is not denfined");
  const paths: Array<string | { params: any; locale?: string }> = [];

  if (appName === "toeic") {
    [
      "minitest",
      "full-test",
      SIMULATION_TEST_SLUG,
    ].forEach((slug) => {
      const _paths = locales.map((locale) => ({ params: { slug }, locale }));
      paths.push(..._paths);
    })
  }

  return {
    paths,
    fallback: false
  }
}

export const getStaticProps = wrapper.getStaticProps(async ({ store, locale, defaultLocale, params }: GetStaticPropsReduxContext) => {
  const appName = process.env.NEXT_PUBLIC_APP_NAME;
  if (!appName) throw new Error("appName is not defined");
  if (appName !== "toeic") return {
    notFound: true
  }
  const appInfo = await apiGetAppSettingDetails({ appName });
  store.dispatch(setAppInfo(appInfo));
  if (!appInfo) return {
    notFound: true,
  };
  const _slug = params.slug as string;
  const slug = locale === defaultLocale ? `/test/${_slug}` : `/${locale}/test/${_slug}`;
  const seoInfo = await apiGetSEOInfo(appInfo._id, slug);
  // store.dispatch(setSEOInfo(seoInfo));
  store.dispatch(setKeySEOInfo(seoInfo));
  const testList: TopicWithUser[] = [];
  let test: Topic;
  const { testCourseIndex } = useServerPracticeData(appName);
  // if (typeof testCourseIndex !== "undefined") {
  //   const courseId = (appInfo.courseIds ?? [])[testCourseIndex];
  //   if (courseId) {
  //     const [topicData] = await apiGetTopicsByParentSlug({ courseId, slug: _slug, local: true, countPracticedUsers: true, exerciseFields: ["questionsNum","duration"] });
  //     const { children = [], ...topic } = topicData || {};
  //     test = topic as Topic;
  //     testList.push(...children);
  //   }
  // }
  return {
    props: {
      // testSlug: _slug,
      // test,
      // testList
      testCourseIndex,
      slug: _slug
    },
    // revalidate: 300
  };
})

export default TestDetailPage;
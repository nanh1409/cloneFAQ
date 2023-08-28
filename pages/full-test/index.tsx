import { Container, Typography } from "@mui/material";
import dynamic from "next/dynamic";
import { PropsWithoutRef, useEffect } from "react";
import { useDispatch, useSelector } from "../../app/hooks";
import { wrapper } from "../../app/store";
import Footer from "../../components/footer";
import Introduction from "../../components/introduction";
import { apiGetAppSettingDetails, apiGetSEOInfo } from "../../features/appInfo/appInfo.api";
import { setAppInfo, setKeySEOInfo, setTestList } from "../../features/appInfo/appInfo.slice";
import Layout from "../../features/common/Layout";
import { apiGetTopicsByParentSlug, apiOffsetTopicsByParentId } from "../../features/study/topic.api";
import { fetchTopicsByParentSlug } from "../../features/study/topic.slice";
import usePageAuth from "../../hooks/usePageAuth";
import useServerPracticeData from "../../hooks/useServerPracticeData";
import useServerSubjectData from "../../hooks/useServerSubjectData";
import { TOPIC_TYPE_TEST } from "../../modules/share/constraint";
import Topic from "../../modules/share/model/topic";
import WebSeo from "../../modules/share/model/webSeo";
import { GetStaticPropsReduxContext } from "../../types/nextReduxTypes";
import { getWebAppProps, getWebSEOProps } from "../../utils/getSEOProps";

const GoogleAdsense = dynamic(() => import("../../features/ads/google-adsense"), { ssr: false });
const CustomTestView = dynamic(() => import("../../components/test/custom-test-view"));
const SubjectTestList = dynamic(() => import("../../components/test/subject-test-list"));
const TestListView = dynamic(() => import("../../components/test/TestListView"));

type FullTestPageProps = {
  seoInfo: WebSeo;
  isSubjectType: boolean;
  testCourseId: string;
}

const FullTestPage = (props: PropsWithoutRef<FullTestPageProps>) => {
  const { seoInfo, isSubjectType, testCourseId } = props;
  const appInfo = useSelector((state) => state.appInfos.appInfo);
  const testList = useSelector((state) => state.appInfos.testList);
  // const summary = useSelector((state) => state.appInfos.seoInfo?.summary);

  usePageAuth();

  const dispatch = useDispatch();

  useEffect(() => {
    if (isSubjectType) {
      if (!!testList.length && testCourseId) {
        dispatch(fetchTopicsByParentSlug({
          courseId: testCourseId,
          slug: testList.map(({ slug }) => slug),
          asc: true, field: "orderIndex", topicTypes: [TOPIC_TYPE_TEST],
          topicFields: ["orderIndex", "courseId", "name", "slug", "avatar"],
          exerciseFields: ["duration", "questionsNum"],
          local: false
        }));
      }
    }
  }, [testList.length])

  const renderFullTestView = () => {
    switch (appInfo?.appName) {
      case "ged":
      case "nclex":
        return <>
          <Container maxWidth="xl" id="ged-test-view">
            <Typography
              component="h1"
              className="title-h1"
              color={`var(--titleColor)`}
              sx={{ textAlign: "center", fontWeight: 600, fontSize: "35px", pt: "50px", pb: "30px" }}
            >
              {seoInfo?.titleH1}
            </Typography>
            <div
              style={{ color: 'var(--contentColor)', textAlign: "center" }}
              dangerouslySetInnerHTML={{ __html: seoInfo?.summary }}
            >
            </div>
            <GoogleAdsense name="The_Leaderboard" height={90} style={{ margin: "10px 0" }} />
            <SubjectTestList subjectPrefix={appInfo?.appName === "ged" ? appInfo?.appName?.toUpperCase() : ""} />
            <GoogleAdsense name="The_Leaderboard" height={90} style={{ margin: "20px 0" }} />
            <Introduction content={seoInfo?.content ?? ""} />
          </Container>
        </>;
      case "ielts":
        return <>
          <Container maxWidth="xl" id="ielts-test-view">
            <GoogleAdsense name="The_Leaderboard" height={90} style={{ margin: "10px 0" }} />
            <h1 className="title-h1" style={{ textAlign: "center", color: 'var(--titleColor)' }}>{seoInfo?.titleH1}</h1>
            <div className="summary" style={{ color: 'var(--contentColor)', textAlign: "center" }}
              dangerouslySetInnerHTML={{ __html: seoInfo?.summary }}
            />
            <TestListView useAsView list={testList}
            />
            <Introduction content={seoInfo?.content ?? ""} />
          </Container>
        </>
      default:
        return <CustomTestView
          disableCustomTest={["hvac"].includes(appInfo?.appName)}
          seoInfo={seoInfo}
        />
    }
  }

  return <Layout
    {...getWebAppProps(appInfo)}
    {...getWebSEOProps(seoInfo)}
  >
    {renderFullTestView()}
    <Footer />
  </Layout>
}

export const getStaticProps = wrapper.getStaticProps(async ({ store }: GetStaticPropsReduxContext) => {
  const appName = process.env.NEXT_PUBLIC_APP_NAME;
  if (!appName) throw new Error("appName is not defined");
  if (![
    "asvab",
    "cscs",
    "ged",
    "hvac",
    "alevel",
    "nclex",
    "ielts"
  ].includes(appName)) return {
    notFound: true
  }
  const appInfo = await apiGetAppSettingDetails({ appName });
  store.dispatch(setAppInfo(appInfo));
  if (!appInfo) return {
    notFound: true
  }
  let slug = "/full-test";
  if (appName === "cscs") {
    slug = "/mock-test";
  } else if (appName === "ged") {
    slug = "/ged-online-test"
  } else if (appName === "hvac" || appName === "nclex") {
    slug = "/exam-simulator"
  } else if (appName === "alevel") {
    slug = "/a-level-maths-online-test"
  }
  const seoInfo = await apiGetSEOInfo(appInfo._id, slug);
  // store.dispatch(setSEOInfo(seoInfo));
  store.dispatch(setKeySEOInfo(seoInfo));

  let isSubjectType = false;
  let testCourseId = "";
  if ([
    "asvab",
    "cscs"
  ].includes(appName)) {
    const { testCourseIndex } = useServerPracticeData(appName);
    const testList: Topic[] = [];
    if (typeof testCourseIndex !== "undefined") {
      testCourseId = (appInfo.courseIds ?? [])[testCourseIndex] ?? '';
      const topics = await apiOffsetTopicsByParentId({
        courseId: testCourseId,
        parentId: null,
        serverSide: true,
        field: "orderIndex",
        topicFields: ["_id", "name", "avatar", "slug", "description", "shortDescription"]
      });
      testList.push(...topics);
    }
    store.dispatch(setTestList(testList));
  } else if (appName === "ged" || appName === "nclex") {
    const { testCourseIndex } = useServerPracticeData(appName);
    const states = useServerSubjectData(appName);
    testCourseId = (appInfo.courseIds ?? [])[testCourseIndex] ?? '';
    store.dispatch(setTestList(
      states
        .map(({ name, dataSlug, childSubjects = [] }) => {
          if (dataSlug) {
            return [{ name, slug: dataSlug } as Topic]
          }
          return childSubjects.map(({ fullName, slug }) => ({ name: fullName, slug }) as Topic);
        })
        .flat()
    ));
    isSubjectType = true;
  } else if (appName === "hvac") {
    const { testCourseIndex, testParentSlug } = useServerPracticeData(appName);
    testCourseId = (appInfo.courseIds ?? [])[testCourseIndex] ?? '';
    if (testCourseId && testParentSlug) {
      const [res] = await apiGetTopicsByParentSlug({
        courseId: testCourseId, slug: testParentSlug, field: "orderIndex", local: true,
        topicFields: ["_id", "avatar", "name", "slug"], exerciseFields: ["questionsNum", "duration"]
      });
      store.dispatch(setTestList(res?.children ?? []));
    }
  } else if (appName === "ielts") {
    const { testCourseIndex } = useServerPracticeData(appName);
    testCourseId = (appInfo.courseIds ?? [])[testCourseIndex] ?? '';
    if (testCourseId) {
      const testList = await apiOffsetTopicsByParentId({
        courseId: testCourseId, parentId: null, field: "orderIndex", asc: true,
        topicFields: ["_id", "avatar", "name", "slug"], exerciseFields: ["questionsNum", "duration"],
        serverSide: true
      });
      store.dispatch(setTestList(testList))
    }
  }
  return {
    props: {
      seoInfo,
      isSubjectType,
      testCourseId
    },
    // revalidate: 300
  }
});

export default FullTestPage;
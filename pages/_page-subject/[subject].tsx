import { GetStaticPathsResult } from "next";
import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "../../app/hooks";
import { wrapper } from "../../app/store";
import Footer from "../../components/footer";
import ALevelMathsSubjectView from "../../components/subject-view/alevel-maths";
import GEDSubjectView from "../../components/subject-view/ged";
import { apiGetSEOInfo } from "../../features/appInfo/appInfo.api";
import { setSlugList } from "../../features/appInfo/appInfo.slice";
import Layout from "../../features/common/Layout";
import { apiGetTopicsByParentSlug } from "../../features/study/topic.api";
import useAppConfig from "../../hooks/useAppConfig";
import useServerAppInfo from "../../hooks/useServerAppInfo";
import useServerPracticeData from "../../hooks/useServerPracticeData";
import useServerSubjectData from "../../hooks/useServerSubjectData";
import { TOPIC_TYPE_EXERCISE } from "../../modules/share/constraint";
import Topic from "../../modules/share/model/topic";
import WebSeo from "../../modules/share/model/webSeo";
import { SubjectData } from "../../types/SubjectData";
import { getWebAppProps, getWebSEOProps } from "../../utils/getSEOProps";

type SubjectPageProps = {
  practice: Topic;
  practiceList: Topic[];
  isSubjectType: boolean;
  seoInfo?: WebSeo;
}

const SubjectPage = (props: SubjectPageProps) => {
  const {
    practice,
    practiceList,
    isSubjectType,
    seoInfo
  } = props;
  const appInfo = useSelector(state => state.appInfos.appInfo)

  const dispatch = useDispatch();

  const bgColor = useMemo(() => {
    let bgColor = "transparent";
    if (appInfo.appName === "ged") bgColor = "#F5F7FB";
    return bgColor;
  }, [appInfo.appName]);

  useEffect(() => {
    dispatch(setSlugList({ practiceSlug: practice, practiceSlugList: practiceList }));
  }, [practice, practiceList]);

  const renderSubjectView = () => {
    switch (appInfo.appName) {
      case "alevel":
        return <ALevelMathsSubjectView seoInfo={seoInfo} />
      case "ged":
        return <GEDSubjectView isSubjectType={isSubjectType} seoInfo={seoInfo} />
      default:
        return <></>
    }
  }

  return <Layout
    {...getWebSEOProps(seoInfo)}
    {...getWebAppProps(appInfo)}
    backgroundColor={bgColor}
  >
    {renderSubjectView()}
    <Footer />
  </Layout>
}

export const getStaticProps = wrapper.getStaticProps(async ({ store, params }) => {
  const appInfo = await useServerAppInfo(store);
  if (!appInfo) return { notFound: true }
  const appName = appInfo.appName;
  const subject = params.subject as string;
  const subjects = useServerSubjectData(appName);
  const currentSubject = subjects.find((s) => s.slug === subject) || null;
  if (!currentSubject) return { notFound: true };
  const seoInfo = await apiGetSEOInfo(appInfo._id, `/${subject}`);

  let practice: Topic = null;
  const practiceList: Topic[] = [];
  let isSubjectType = false;

  if (appName === "alevel") {
    const { dataSlug, name, avatar, childSubjects = [] } = currentSubject || {} as SubjectData;
    if (!dataSlug) return { notFound: true }
    practice = { name, slug: dataSlug, avatar } as Topic;
    practiceList.push(...((childSubjects as any) as Topic[]));
    isSubjectType = true
  } else {
    const { practiceCourseIndex } = useServerPracticeData(appName);
    const courseId = (appInfo.courseIds ?? [])[practiceCourseIndex];
    if (appName === "ged") {
      if (!courseId) return { notFound: true };
      const { dataSlug, childSubjects = [], name, slug } = currentSubject || {} as SubjectData;
      if (dataSlug) {
        const [topicData] = await apiGetTopicsByParentSlug({ courseId, slug: dataSlug, local: true, topicTypes: [TOPIC_TYPE_EXERCISE] });
        const { children = [], ...topic } = topicData || {};
        practice = topic as Topic;
        practiceList.push(...children);
      } else if (childSubjects.length) {
        practice = ({ name, slug }) as Topic;
        practiceList.push(...((childSubjects as any) as Topic[]));
        isSubjectType = true;
      } else {
        return { notFound: true }
      }
    } else {
      return { notFound: true }
    }
  }

  return {
    props: {
      practice,
      practiceList,
      isSubjectType,
      seoInfo
    }
  }
})

export const getStaticPaths = async () => {
  const { appName } = useAppConfig();
  if (!appName) throw new Error("appName is not defined");
  const paths: GetStaticPathsResult["paths"] = [];
  if (["alevel", "ged"].includes(appName)) {
    const subjects = useServerSubjectData(appName);
    paths.push(...subjects.map((e) => ({ params: { subject: e.slug } })))
  }
  return {
    paths,
    fallback: false
  }
}

export default SubjectPage;
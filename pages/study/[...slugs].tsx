import { useMediaQuery, useTheme } from "@mui/material";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { PropsWithoutRef, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "../../app/hooks";
import { ROUTER_GET_PRO, ROUTER_STUDY } from "../../app/router";
import { wrapper } from "../../app/store";
import Footer from "../../components/footer";
import StudySEOView from "../../components/study-seo-view";
import { apiGetAppSettingDetails, apiGetSEOInfo } from "../../features/appInfo/appInfo.api";
import { setAppInfo, setChildApp } from "../../features/appInfo/appInfo.slice";
import Layout, { LayoutProps } from "../../features/common/Layout";
import useUserPaymentInfo from "../../features/get-pro/useUserPaymentInfo";
import { useUserStudyPlan } from "../../features/study-plan/hooks/useUserStudyPlan";
import useStudyStatsCookie from "../../features/study/hooks/useStudyStatsCookie";
import useSyncStudyData from "../../features/study/hooks/useSyncStudyData";
import useSyncStudyPlan from "../../features/study/hooks/useSyncStudyPlan";
import useTopicHistory from "../../features/study/hooks/useTopicHistory";
import StudyLayout from "../../features/study/StudyLayout";
import { setForceHideSubTopicTheory, setTopicChunkSize } from "../../features/study/studyLayout.slice";
// import StudyView from "../../features/study/StudyView";
import { apiGetEntryTopicsBySlugs } from "../../features/study/topic.api";
import { bulkUpdateTopicProgresses, removeTopicProgressesToUpdate, setCurrentTopic, setHasSub, setRootTopic, setStudyBaseSlug, setSubTopic, setTopicLoading, setTopics, TopicItem } from "../../features/study/topic.slice";
import { getRelaTopicList } from "../../features/study/topic.utils";
import useAppConfig from "../../hooks/useAppConfig";
import useGeoInfo from "../../hooks/useGeoInfo";
import usePageAuth from "../../hooks/usePageAuth";
import usePagePaymentInfo from "../../hooks/usePagePaymentInfo";
import useServerPracticeData from "../../hooks/useServerPracticeData";
import { META_ROBOT_NO_INDEX_NO_FOLLOW, TOPIC_TYPE_EXERCISE, TOPIC_TYPE_LESSON } from "../../modules/share/constraint";
import AppSetting from "../../modules/share/model/appSetting";
import TopicProgress from "../../modules/share/model/topicProgress";
import WebSeo from "../../modules/share/model/webSeo";
import { DMVSubject } from "../../types/appPracticeTypes";
import { getWebAppProps, getWebSEOProps } from "../../utils/getSEOProps";

const StudyView = dynamic(() => import("../../features/study/StudyView"), { ssr: false });

type LearnPageProps = {
  slug: string;
  path: string;
  subjectSlug?: string;
  currentTopic: TopicItem;
  seoInfo?: WebSeo;
  rootTopic?: TopicItem;
  subTopic?: TopicItem;
  hasSub?: boolean;
  courseId: string;
  childAppSlug?: string;
}

const LearnPage = (props: PropsWithoutRef<LearnPageProps>) => {
  const appInfo = useSelector((state) => state.appInfos.appInfo);
  const { userId, user, loading: authLoading } = useSelector((state) => state.authState);
  const { studyScoreDataId, topicProgressesToUpdate, currentTopic, fetchedTopicProgresses, list, studyBaseSlug } = useSelector((state) => state.topicState);


  const appConfig = useAppConfig();
  const [showStudySEO, setShowStudySEO] = useState(appConfig.enableSEOStudyPage);

  const dispatch = useDispatch();
  const router = useRouter();
  const theme = useTheme();
  const isTabletUI = useMediaQuery(theme.breakpoints.down("lg"));

  const {
    gameTitle,
    hideSubList,
    levelListLabel
  } = useMemo(() => {
    let gameTitle: string;
    let hideSubList = false;
    let levelListLabel = 'Levels'
    if (appInfo?.appName === "dmv") {
      const slugBase = router.query.slugs[0] || '';
      const slugBaseMatch = slugBase.match(/^(dmv-permit|dmv-motorcycle)$/u);
      const slugBaseMatchCDL = slugBase.match(/^dmv-cdl-permit$/u);
      if (slugBaseMatchCDL) {
        levelListLabel = "Practice Tests";
      } else if (slugBaseMatch) {
        const subject = slugBase as DMVSubject;
        gameTitle = `DMV ${subject === "dmv-motorcycle" ? "Motorcycle" : ""} Practice Test`;
        hideSubList = true;
        levelListLabel = 'Practices'
      }
    } else if (appInfo?.appName === "toeic") {
      levelListLabel = "Tests"
    }
    return {
      gameTitle,
      hideSubList,
      levelListLabel
    }
  }, [appInfo?.appName, router.query.slugs]);

  usePageAuth();
  useStudyStatsCookie();
  useUserStudyPlan({
    userId, courseId: currentTopic?.courseId, client: !user, key: currentTopic?._id
  });
  useSyncStudyPlan();

  useEffect(() => {
    if (appInfo?.appName === "ielts" && studyBaseSlug.includes("ielts-grammar")) {
      dispatch(setTopicChunkSize(1));
    }
  }, [appInfo?.appName, studyBaseSlug])

  useEffect(() => {
    dispatch(setCurrentTopic(props.currentTopic));
    dispatch(setSubTopic(props.subTopic));
    dispatch(setRootTopic(props.rootTopic));
    dispatch(setHasSub(props.hasSub));
    // router.replace(props.path, undefined, { shallow: true });
    dispatch(setStudyBaseSlug(props.slug));
    return () => {
      dispatch(setStudyBaseSlug(''));
      dispatch(setTopicChunkSize(undefined));
    }
  }, []);

  useGeoInfo();
  usePageAuth();
  usePagePaymentInfo({ appName: appConfig.appName });
  useStudyStatsCookie();
  useSyncStudyData();
  useSyncStudyPlan();
  const { paymentLoading, isValidTopicAccess } = useUserPaymentInfo();

  // useEffect(() => {
  //   if (!!currentTopic) {
  //     if (!isValidTopicAccess(currentTopic)) {
  //       window.location.replace(`/${ROUTER_GET_PRO}/?from=url`);
  //       return;
  //     }
  //   }
  // }, [currentTopic?._id]);
  useTopicHistory();

  useEffect(() => {
    if (appInfo?.appName) {
      if (["toeic", "ielts"].includes(appInfo?.appName)) {
        dispatch(setForceHideSubTopicTheory(false));
      } else {
        dispatch(setForceHideSubTopicTheory(true));
      }
    }
  }, [appInfo?.appName]);

  useEffect(() => {
    if (appInfo?.appName === "dmv") {
      dispatch(setChildApp(new AppSetting({ appName: props.childAppSlug })));
    }
  }, [appInfo?.appName, props.childAppSlug]);

  useEffect(() => {
    if (!!topicProgressesToUpdate) {
      if (!!user) {
        dispatch(bulkUpdateTopicProgresses(topicProgressesToUpdate.map((e) => {
          return new TopicProgress({
            topicId: e.topicId, childCardnum: e.totalCardNum, userId, courseId: currentTopic.courseId, progress: e.progress, status: e.status
          });
        })))
      } else {
        dispatch(removeTopicProgressesToUpdate())
      }
    }
  }, [topicProgressesToUpdate, user]);

  const layoutProps: LayoutProps = {
    ...getWebSEOProps(props.seoInfo),
    ...getWebAppProps(appInfo),
    title: props.seoInfo?.seoTitle || appInfo?.title,
    slug: props.slug,
    robots: props.seoInfo?.metaRobot ?? META_ROBOT_NO_INDEX_NO_FOLLOW,
    disableFBMessenger: true
  }

  return showStudySEO
    ? <Layout {...layoutProps} backgroundColor="#fff" addFBComment>
      <StudySEOView {...props.seoInfo} topicsList={props.hasSub
        ? list.filter((e) => e.parentId === props.rootTopic?._id)
        : list.filter((e) => !e.parentId)
      } onClickStart={() => setShowStudySEO(false)} rootTopicSlug={props.hasSub ? props.rootTopic?.slug : ""} />
      <Footer />
    </Layout>
    : <StudyLayout {...layoutProps} addMathJax addFBComment detectAdBlock stickyHeader={isTabletUI}>
      {
        authLoading
          ? <></> :
          // !paymentLoading && isValidTopicAccess(currentTopic) && 
          <StudyView
            levelListLabel={levelListLabel}
            gameTitle={gameTitle}
            hideSubList={hideSubList}
            tabletNavCol={hideSubList ? 3 : undefined}
            addFBComment
            type="default"
          />
      }
    </StudyLayout>
}

export const getServerSideProps = wrapper.getServerSideProps(async ({ query, store, res }) => {
  // res.setHeader("Cache-Control", "public, s-maxage=10, stale-while-revalidate=59")
  const slugs = query.slugs as string[];
  if (!slugs.length) return { notFound: true }

  const appName = process.env.NEXT_PUBLIC_APP_NAME;
  if (!appName) {
    throw new Error("appName is not defined");
  }
  const appInfo = await apiGetAppSettingDetails({ appName });
  store.dispatch(setAppInfo(appInfo));
  if (!appInfo) return { notFound: true }

  const slugBase = slugs[0];
  let entrySlugs = slugs;
  let courseIds = appInfo?.courseIds ?? [];
  let subject = '';
  let childAppSlug = '';
  if (appName === "dmv") {
    const stateBaseMatch = slugBase.match(/^(dmv-permit|dmv-motorcycle|dmv-cdl-permit)$/u);
    subject = slugBase;
    childAppSlug = slugBase;
    if (!!stateBaseMatch && !!slugs[1]) {
      const { mapSubjectCourseIndex } = useServerPracticeData(appName);
      const practiceCourseIndex = (mapSubjectCourseIndex || []).findIndex((subject: DMVSubject) => subject === slugBase);
      if (practiceCourseIndex > -1) courseIds = [(appInfo?.courseIds ?? [])[practiceCourseIndex]];
      entrySlugs = slugs.slice(1);
    }
  }
  const { error, notFound, data } = await apiGetEntryTopicsBySlugs({ slugs: entrySlugs, courseIds, local: true });
  if (error) throw new Error("Some thing went wrong");
  if (notFound) {
    return { notFound: true }
  }
  const [currentTopic] = data.slice(-1);
  const rootTopic = data[0];
  store.dispatch(setRootTopic(rootTopic));

  let topics: TopicItem[] = [];

  let subTopic: TopicItem = null;
  let hasSub = false;
  if (data.length === 3) {
    hasSub = true;
    topics.push({ ...rootTopic, parentId: null });
    const [_subTopic] = data.slice(-2, -1);
    subTopic = _subTopic
    if (subTopic) {
      const subList = await getRelaTopicList(subTopic, true, [TOPIC_TYPE_LESSON]);
      topics.push(...subList);
    }
  } else if (data.length === 2) {
    hasSub = false
    if (rootTopic) {
      subTopic = rootTopic;
      const subList = await getRelaTopicList(rootTopic, true, [TOPIC_TYPE_LESSON]);
      topics.push(...subList.map((e) => { e.parentId = null; return e; }));
    }
  }
  if (currentTopic) {
    let topicTypes: number[];
    if (["ged", "cdl", "dmv"].includes(appName)) topicTypes = [TOPIC_TYPE_EXERCISE];
    const levelList = await getRelaTopicList(currentTopic, true, topicTypes);
    topics.push(...levelList);
  }
  const { mapSlugData = {} } = useServerPracticeData(appName);
  const flashCardSlugs = Object.keys(mapSlugData).filter((slug) => mapSlugData[slug]?.tag === "flash-card");
  topics = topics.filter(({ slug }) => !flashCardSlugs.includes(slug))

  store.dispatch(setTopics(topics));
  store.dispatch(setTopicLoading(false));
  const subjectSlug = `${data.slice(0, data.length - 1).map(({ slug }) => slug).join("/")}`;
  const slug = `${ROUTER_STUDY}${subject ? `/${subject}` : ''}/${subjectSlug}`;
  const path = `/${slug}/${data[data.length - 1].slug}`;

  let seoInfo: WebSeo = {} as WebSeo;
  if (appInfo && slug) {
    seoInfo = await apiGetSEOInfo(appInfo._id, `/${slug}`);
  }

  return {
    props: {
      slug,
      path,
      subjectSlug,
      currentTopic,
      rootTopic,
      subTopic,
      seoInfo,
      hasSub,
      courseId: currentTopic?.courseId,
      childAppSlug
    }
  }
});

export default LearnPage;
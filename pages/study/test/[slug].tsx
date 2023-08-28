import { useMediaQuery, useTheme } from "@mui/material";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { PropsWithoutRef, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "../../../app/hooks";
import { ROUTER_STUDY } from "../../../app/router";
import { wrapper } from "../../../app/store";
import { apiGetAppSettingDetails } from "../../../features/appInfo/appInfo.api";
import { setAppInfo } from "../../../features/appInfo/appInfo.slice";
import useUserPaymentInfo from "../../../features/get-pro/useUserPaymentInfo";
import useStudyStatsCookie from "../../../features/study/hooks/useStudyStatsCookie";
import useSyncStudyData from "../../../features/study/hooks/useSyncStudyData";
import StudyLayout from "../../../features/study/StudyLayout";
// import StudyView from "../../../features/study/StudyView";
import { apiGetTopicById } from "../../../features/study/topic.api";
import { fetchRelaTopics, setCurrentTopic, setSubTopic, setTopicLoading, TopicItem } from "../../../features/study/topic.slice";
import useAppConfig from "../../../hooks/useAppConfig";
import useGeoInfo from "../../../hooks/useGeoInfo";
import usePageAuth from "../../../hooks/usePageAuth";
import usePagePaymentInfo from "../../../hooks/usePagePaymentInfo";
import { EXAM_TYPE_TOEIC, TOPIC_TYPE_TEST } from "../../../modules/share/constraint";
import { openUrl } from "../../../utils/system";

const StudyView = dynamic(() => import("../../../features/study/StudyView"), { ssr: false });

export type StudyTestPageProps = {
  topic: TopicItem;
}

const StudyTestPage = (props: PropsWithoutRef<StudyTestPageProps>) => {
  const appInfo = useSelector((state) => state.appInfos.appInfo);
  const { userId, user, loading: authLoading } = useSelector((state) => state.authState);
  const { studyScoreDataId, topicProgressesToUpdate, currentTopic, fetchedTopicProgresses } = useSelector((state) => state.topicState);
  const appConfig = useAppConfig();

  const dispatch = useDispatch();
  const router = useRouter();
  const theme = useTheme();
  const isTabletUI = useMediaQuery(theme.breakpoints.down("lg"));

  const hideAllList = useMemo(() =>
    currentTopic?.type === TOPIC_TYPE_TEST && currentTopic?.topicExercise?.contentType === EXAM_TYPE_TOEIC
    , [currentTopic?._id]);

  useGeoInfo();
  usePageAuth();
  usePagePaymentInfo({ appName: appConfig.appName });
  useStudyStatsCookie();

  const { isValidTopicAccess, paymentLoading } = useUserPaymentInfo();


  useEffect(() => {
    dispatch(setCurrentTopic(props.topic));
    dispatch(setSubTopic(props.topic));
    dispatch(setTopicLoading(false));
    return () => {
      dispatch(setCurrentTopic(null));
      dispatch(setSubTopic(null));
      dispatch(setTopicLoading(true));
    }
  }, []);

  useEffect(() => {
    if (!paymentLoading) {
      if (!isValidTopicAccess(props.topic)) {
        // window.location.replace(`/${ROUTER_GET_PRO}?from=url`);
        // return;
      }
    }
  }, [paymentLoading]);

  useEffect(() => {
    if (!!props.topic)
      dispatch(fetchRelaTopics({ ...props.topic, topicTypes: [TOPIC_TYPE_TEST] }));
  }, [props.topic?._id]);

  useSyncStudyData();

  return (<StudyLayout {...appInfo} slug={`/${ROUTER_STUDY}/test/${props.topic?.slug}-${props.topic?._id}`} disableFBMessenger addMathJax addFBComment detectAdBlock stickyHeader={isTabletUI}>
    {authLoading
      ? <></>
      : <StudyView
        singleList
        onClickSubTopic={(item) => {
          const href = `/${ROUTER_STUDY}/test/${item.slug}-${item._id}`;
          openUrl(href)
        }}
        gameTitle={props.topic?.name}
        practiceListLabel="Tests"
        tabletNavCol={hideAllList ? 3 : 4}
        hideAllList={hideAllList}
        addFBComment
        type="test"
      />}
  </StudyLayout>)
}

export const getServerSideProps = wrapper.getServerSideProps(async ({ query, store }) => {
  const appName = process.env.NEXT_PUBLIC_APP_NAME;
  if (!appName) {
    throw new Error("appName is not defined");
  }
  const slug = query.slug as string;
  if (!slug) return { notFound: true };

  const appInfo = await apiGetAppSettingDetails({ appName });
  store.dispatch(setAppInfo(appInfo));
  if (!appInfo) return { notFound: true };

  const testSlugs = slug.split("-");
  const [testId] = testSlugs.slice(-1);

  const topic = await apiGetTopicById({ topicId: testId, withExercise: true });
  return {
    props: {
      topic
    }
  }
});

export default StudyTestPage;
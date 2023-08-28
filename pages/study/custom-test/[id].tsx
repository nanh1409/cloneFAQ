import { PropsWithoutRef, useEffect } from "react";
import { useDispatch, useSelector } from "../../../app/hooks";
import { wrapper } from "../../../app/store";
import { apiGetAppSettingDetails } from "../../../features/appInfo/appInfo.api";
import { setAppInfo } from "../../../features/appInfo/appInfo.slice";
import { fetchCurrentTest, setCurrentTest } from "../../../features/custom-test/customTest.slice";
import useStudyStatsCookie from "../../../features/study/hooks/useStudyStatsCookie";
import StudyLayout from "../../../features/study/StudyLayout";
import { setHideSubList } from "../../../features/study/studyLayout.slice";
import { setCurrentTopic, setTopicLoading, setTopics, TopicItem } from "../../../features/study/topic.slice";
// import StudyView from "../../../features/study/StudyView";
import useAppConfig from "../../../hooks/useAppConfig";
import useGeoInfo from "../../../hooks/useGeoInfo";
import usePageAuth from "../../../hooks/usePageAuth";
import { TOPIC_TYPE_TEST } from "../../../modules/share/constraint";
import Topic from "../../../modules/share/model/topic";
import TopicExercise from "../../../modules/share/model/topicExercise";
import { useMediaQuery, useTheme } from "@mui/material";
import dynamic from "next/dynamic";

const StudyView = dynamic(() => import("../../../features/study/StudyView"), { ssr: false });


type CustomTestPageProps = {
  testId: string;
}

const CustomTestPage = (props: PropsWithoutRef<CustomTestPageProps>) => {
  const { testId } = props;
  const appInfo = useSelector((state) => state.appInfos.appInfo);
  const list = useSelector((state) => state.customTestState.list);
  const test = useSelector((state) => state.customTestState.currentTest);
  const currentTopic = useSelector((state) => state.topicState.currentTopic);
  const { userId, user, loading: authLoading } = useSelector((state) => state.authState);
  const appConfig = useAppConfig();
  const theme = useTheme();
  const isTabletUI = useMediaQuery(theme.breakpoints.down("lg"));

  const dispatch = useDispatch();

  usePageAuth();
  useGeoInfo();
  useStudyStatsCookie();

  useEffect(() => {
    dispatch(setHideSubList(true));
  }, []);

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        const test = list.find((t) => t._id === testId && t.userId === userId);
        dispatch(setCurrentTest(test));
      } else {
        dispatch(fetchCurrentTest(testId));
      }
    }
  }, [authLoading]);

  useEffect(() => {
    dispatch(setTopicLoading(true));
    if (test) {
      const topic = new Topic({ _id: test._id, name: test.title, type: TOPIC_TYPE_TEST, courseId: test.courseId }) as TopicItem;
      topic.topicExercise = new TopicExercise({ _id: test._id, duration: test.duration, pass: test.pass, questionsNum: test.questionsNum });
      dispatch(setCurrentTopic(topic));
      dispatch(setTopics([topic]));
      dispatch(setTopicLoading(false));
    }
  }, [test])

  return <StudyLayout {...appInfo} detectAdBlock slug={`/study/custom-test/${test?._id}`} disableFBMessenger addMathJax addFBComment stickyHeader={isTabletUI}>
    {!authLoading && !!test && !!currentTopic
      ? <StudyView
        cardIds={test.cardIds}
        gameTitle={test.title}
        hideAllList
        tabletNavCol={2}
        addFBComment
      />
      : <></>
    }
  </StudyLayout>
}

export const getServerSideProps = wrapper.getServerSideProps(async ({ store, query }) => {
  const appName = process.env.NEXT_PUBLIC_APP_NAME;
  if (!appName) {
    throw new Error("appName is not defined");
  }
  const testId = query.id as string;
  if (!testId) return {
    notFound: true
  }
  const appInfo = await apiGetAppSettingDetails({ appName });
  store.dispatch(setAppInfo(appInfo));
  return {
    props: {
      testId
    }
  }
});

export default CustomTestPage;
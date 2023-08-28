import { useMediaQuery, useTheme } from "@mui/material";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { PropsWithoutRef, useEffect } from "react";
import { useDispatch, useSelector } from "../../../app/hooks";
import { ROUTER_STUDY } from "../../../app/router";
import { wrapper } from "../../../app/store";
import { apiGetAppSettingDetails } from "../../../features/appInfo/appInfo.api";
import { setAppInfo } from "../../../features/appInfo/appInfo.slice";
import useSyncStudyData from "../../../features/study/hooks/useSyncStudyData";
import useTopicHistory from "../../../features/study/hooks/useTopicHistory";
import StudyLayout from "../../../features/study/StudyLayout";
// import StudyView from "../../../features/study/StudyView";
import { apiGetEntryTopicsBySlugs } from "../../../features/study/topic.api";
import { fetchRelaTopics, setCurrentTopic, setRootTopic, setSubTopic, setTopicLoading, TopicItem } from "../../../features/study/topic.slice";
import useGeoInfo from "../../../hooks/useGeoInfo";
import usePageAuth from "../../../hooks/usePageAuth";
import usePagePaymentInfo from "../../../hooks/usePagePaymentInfo";
import { openUrl } from "../../../utils/system";

const StudyView = dynamic(() => import("../../../features/study/StudyView"), { ssr: false });

export type StudyFlashCardPageProps = {
  topic: TopicItem;
  rootTopic?: TopicItem;
  slug: string;
  path: string;
  baseSlug: string;
}

const StudyFlashCardPage = (props: PropsWithoutRef<StudyFlashCardPageProps>) => {
  const {
    topic, rootTopic, slug, path, baseSlug
  } = props;
  const appInfo = useSelector((state) => state.appInfos.appInfo);
  const { userId, user, loading: authLoading } = useSelector((state) => state.authState);
  const { studyScoreDataId, topicProgressesToUpdate, currentTopic, fetchedTopicProgresses } = useSelector((state) => state.topicState);

  const dispatch = useDispatch();
  const router = useRouter();
  const theme = useTheme();
  const isTabletUI = useMediaQuery(theme.breakpoints.down("lg"));

  usePageAuth();
  useGeoInfo();
  usePagePaymentInfo({ appName: appInfo?.appName });
  useTopicHistory();

  useEffect(() => {
    dispatch(setCurrentTopic(topic));
    dispatch(setRootTopic(rootTopic));
    dispatch(setSubTopic(topic));
    dispatch(setTopicLoading(false));

    return () => {
      dispatch(setTopicLoading(true));
    }
  }, []);

  useEffect(() => {
    if (!!topic)
      dispatch(fetchRelaTopics({ ...topic }));
  }, [topic?._id]);

  useSyncStudyData();

  return <StudyLayout {...appInfo} slug={slug} disableFBMessenger addMathJax addFBComment detectAdBlock stickyHeader={isTabletUI}>
    {authLoading ? <></> : <StudyView
      singleList
      tabletNavCol={2}
      onClickSubTopic={(topic) => {
        const href = `/${ROUTER_STUDY}/flash-card${baseSlug ? `/${baseSlug}` : ''}/${topic.slug}`;
        openUrl(href);
      }}
      gameTitle={`${rootTopic?.name}: ${topic?.name}`}
      addFBComment
    />}
  </StudyLayout>
}

export const getServerSideProps = wrapper.getServerSideProps(async ({ query, store }) => {
  const appName = process.env.NEXT_PUBLIC_APP_NAME;
  if (!appName) {
    throw new Error("appName is not defined");
  }
  const slugs = query.slugs as string[];
  if (!slugs.length) return { notFound: true };

  const appInfo = await apiGetAppSettingDetails({ appName });
  if (!appInfo) return { notFound: true };
  store.dispatch(setAppInfo(appInfo));

  const { error, notFound, data } = await apiGetEntryTopicsBySlugs({
    slugs, courseIds: appInfo?.courseIds ?? [], local: true
  });
  if (notFound) return { notFound: true };
  const [topic] = data.slice(-1);
  const rootTopic = data[0] ?? null;
  const subjectSlug = `${data.slice(0, data.length - 1).map(({ slug }) => slug).join("/")}`;
  const slug = `${ROUTER_STUDY}/flash-card/${subjectSlug}`;
  const path = `/${slug}/${topic?.slug}`;

  return {
    props: {
      topic,
      rootTopic,
      slug,
      path,
      baseSlug: subjectSlug,
    }
  }
});

export default StudyFlashCardPage;
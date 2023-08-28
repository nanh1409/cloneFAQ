import { useMediaQuery, useTheme } from "@mui/material";
import { useRouter } from "next/router";
import { PropsWithoutRef, useEffect } from "react";
import { useDispatch, useSelector } from "../../../app/hooks";
import { ROUTER_STUDY } from "../../../app/router";
import { wrapper } from "../../../app/store";
import { apiGetAppSettingDetails } from "../../../features/appInfo/appInfo.api";
import { setAppInfo } from "../../../features/appInfo/appInfo.slice";
import StudyLayout from "../../../features/study/StudyLayout";
import StudyLessonView from "../../../features/study/StudyLessonView";
import { apiGetEntryTopicsBySlugs } from "../../../features/study/topic.api";
import { fetchRelaTopics, setCurrentTopic, setRootTopic, TopicItem } from "../../../features/study/topic.slice";
import useAppConfig from "../../../hooks/useAppConfig";
import useGeoInfo from "../../../hooks/useGeoInfo";
import usePageAuth from "../../../hooks/usePageAuth";
import usePagePaymentInfo from "../../../hooks/usePagePaymentInfo";
import { TOPIC_TYPE_LESSON } from "../../../modules/share/constraint";

export type StudyLessonPageProps = {
  topic: TopicItem;
  rootTopic?: TopicItem;
  slug: string;
  path: string;
  baseSlug: string;
}

const StudyLessonPage = (props: PropsWithoutRef<StudyLessonPageProps>) => {
  const {
    topic, rootTopic, slug, path, baseSlug
  } = props;
  const appInfo = useSelector((state) => state.appInfos.appInfo);
  const { userId, user, loading: authLoading } = useSelector((state) => state.authState);
  const appConfig = useAppConfig();
  const theme = useTheme();
  const isTabletUI = useMediaQuery(theme.breakpoints.down("lg"));

  const dispatch = useDispatch();
  const router = useRouter();

  usePageAuth();
  useGeoInfo();
  usePagePaymentInfo({ appName: appConfig.appName });

  useEffect(() => {
    dispatch(setCurrentTopic(topic));
    if (rootTopic) {
      dispatch(setRootTopic(rootTopic));
    }
    // router.replace(path, undefined, { shallow: true });
  }, []);

  useEffect(() => {
    if (!!topic)
      dispatch(fetchRelaTopics({ ...topic, topicTypes: [TOPIC_TYPE_LESSON] }));
  }, [topic?._id]);

  return <StudyLayout {...appInfo} slug={slug} disableFBMessenger addMathJax addFBComment detectAdBlock stickyHeader={isTabletUI}>
    {authLoading ? <></> : <StudyLessonView baseSlug={baseSlug} />}
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
  store.dispatch(setAppInfo(appInfo));
  if (!appInfo) return { notFound: true };

  const { error, notFound, data } = await apiGetEntryTopicsBySlugs({
    slugs, courseIds: appInfo?.courseIds ?? [], entryTopicTypes: [TOPIC_TYPE_LESSON], local: true
  });
  if (notFound) return { notFound: true };
  const [topic] = data.slice(-1);
  const rootTopic = data[0] ?? null;
  const subjectSlug = `${data.slice(0, data.length - 1).map(({ slug }) => slug).join("/")}`;
  const slug = `${ROUTER_STUDY}/lesson/${subjectSlug}`;
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

export default StudyLessonPage;
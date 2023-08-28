import { Container } from "@mui/material";
import { GetStaticPaths, GetStaticPathsContext } from "next";
import dynamic from "next/dynamic";
import { PropsWithoutRef, useEffect } from "react";
import { useDispatch, useSelector } from "../../../app/hooks";
import { ROUTER_PRACTICE_SW } from "../../../app/router";
import { wrapper } from "../../../app/store";
import Footer from "../../../components/footer";
import Introduction from "../../../components/introduction";
import { apiGetAppSettingDetails, apiGetSEOInfo } from "../../../features/appInfo/appInfo.api";
import { setAppInfo, setKeySEOInfo, setSlugList } from "../../../features/appInfo/appInfo.slice";
import useSeoInfo from "../../../features/appInfo/useSeoInfo";
import Layout from "../../../features/common/Layout";
import { apiGetTopicsByParentSlug } from "../../../features/study/topic.api";
import { TopicWithUser } from "../../../features/study/topic.model";
import useGeoInfo from "../../../hooks/useGeoInfo";
import usePageAuth from "../../../hooks/usePageAuth";
import useServerPracticeData from "../../../hooks/useServerPracticeData";
import Topic from "../../../modules/share/model/topic";
import { GetStaticPropsReduxContext } from "../../../types/nextReduxTypes";
import { getWebAppProps, getWebSEOProps } from "../../../utils/getSEOProps";

const GoogleAdsense = dynamic(() => import("../../../features/ads/google-adsense"), { ssr: false });
const PracticeListView = dynamic(() => import("../../../components/practice/PracticeListView"));

type PracticeSWDetailPageProps = {
  practiceSlug: string;
  practice: Topic;
  practiceList: Topic[];
  isSubjectType: boolean;
};
const PracticeSWDetailPage = (props: PropsWithoutRef<PracticeSWDetailPageProps>) => {
  const { practiceSlug, practice, practiceList, isSubjectType } = props;
  const appInfo = useSelector((state) => state.appInfos.appInfo);
  // const seoInfo = useSelector((state) => state.appInfos.seoInfo);
  const seoInfo = useSeoInfo();
  const dispatch = useDispatch();

  usePageAuth();
  useGeoInfo();

  useEffect(() => {
    dispatch(setSlugList({ practiceSlug: practice, practiceSlugList: practiceList }));
  }, [practice, practiceList])

  return <Layout
    {...getWebAppProps(appInfo)}
    {...getWebSEOProps(seoInfo)}
    backgroundColor="#f6f7fb"
  >
    <Container maxWidth="xl">
      <GoogleAdsense name="The_Leaderboard" height={90} style={{ marginTop: 30 }} />
      <PracticeListView baseSlug={practiceSlug} otherPracticeBaseSlug={ROUTER_PRACTICE_SW} useMapSeo />
      <Introduction useMapSeo />
    </Container>
    <Footer />
  </Layout>
}

export const getStaticPaths: GetStaticPaths = async ({ locales }: GetStaticPathsContext) => {
  const appName = process.env.NEXT_PUBLIC_APP_NAME;
  if (!appName) throw new Error("appName is not denfined");
  const paths: Array<string | { params: any; locale?: string }> = [];
  if (["toeic"].includes(appName)) {
    const { mapSlugData = {} } = useServerPracticeData(appName);
    Object.entries(mapSlugData).filter(([_, { tag }]) => ['speaking', 'writing'].includes(tag)).forEach(([slug, { children }]) => {
      if (!children) {
        const _paths = locales.map((locale) => ({ params: { slug }, locale }));
        paths.push(..._paths);
      } else {
        Object.keys(children).forEach((slug) => {
          const _paths = locales.map((locale) => ({ params: { slug }, locale }));
          paths.push(..._paths);
        });
      }
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

  if (!["toeic"].includes(appName)) {
    return {
      notFound: true
    }
  }

  const appInfo = await apiGetAppSettingDetails({ appName });
  store.dispatch(setAppInfo(appInfo));
  if (!appInfo) return {
    notFound: true,
  };
  const _slug = params.slug as string;
  const slug = locale === defaultLocale ? `/practice-speaking-writing/${_slug}` : `/${locale}/practice-speaking-writing/${_slug}`;

  const seoInfo = await apiGetSEOInfo(appInfo._id, slug);

  // store.dispatch(setSEOInfo(seoInfo));
  store.dispatch(setKeySEOInfo(seoInfo));

  const practiceList: TopicWithUser[] = [];
  const { practiceCourseIndex } = useServerPracticeData(appName);
  const courseId = (appInfo.courseIds ?? [])[practiceCourseIndex];
  let practice: Topic;

  if (courseId) {
    const [topicData] = await apiGetTopicsByParentSlug({
      courseId,
      countPracticedUsers: true,
      slug: _slug,
      topicFields: ["_id", "orderIndex", "name", "courseId", "shortDescription", "slug", "type"],
      local: true
    });
    const { children = [], ...topic } = topicData || {};
    practice = topic as Topic;
    practiceList.push(...children);
  }
  return {
    props: {
      practiceSlug: _slug,
      practice,
      practiceList,
      isSubjectType: false
    },
    // revalidate: 300,
  };
});

export default PracticeSWDetailPage;


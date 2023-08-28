import { SxProps } from "@mui/system";
import moment from "moment";
import dynamic from "next/dynamic";
import {
  PropsWithoutRef, useMemo
} from "react";
import { useSelector } from "../app/hooks";
import { setStatesList } from "../app/redux/reducers/states.slice";
import { wrapper } from "../app/store";
import DownloadApp from "../components/download-app";
import FeatureApp from "../components/feature-on";
import Footer from "../components/footer";
import Functions from "../components/functions";
import HeroSection, { HeroSectionLayoutBg } from "../components/hero-section";
import HomeCTAElement from "../components/hero-section/HomeCTAElement";
import Introduction from "../components/introduction";
import PracticeTopicsSection from "../components/practice-topics-section";
import Review from "../components/review";

import {
  apiGetAppSettingDetails,
  apiGetSEOInfo
} from "../features/appInfo/appInfo.api";
import {
  setAppInfo,
  setKeySEOInfo,
  setPracticeList
} from "../features/appInfo/appInfo.slice";
import Layout from "../features/common/Layout";
import { apiGetTopicsByParentSlug, apiGetTopicsBySlugs } from "../features/study/topic.api";
import useAppConfig from "../hooks/useAppConfig";
import useGeoInfo from "../hooks/useGeoInfo";
import usePageAuth from "../hooks/usePageAuth";
import useServerPracticeData from "../hooks/useServerPracticeData";
import useServerStateData from "../hooks/useServerStateData";
import Topic from "../modules/share/model/topic";
import WebSeo from "../modules/share/model/webSeo";
import { GetStaticPropsReduxContext } from "../types/nextReduxTypes";
import { getWebAppProps, getWebSEOProps } from "../utils/getSEOProps";

const ReviewVerTwo = dynamic(() => import("../components/review/indexVer2"), { ssr: false });
const SelectStateDialog = dynamic(() => import("../components/SelectStateDialog"), { ssr: false });

type IndexPageProps = {
  seoInfo: WebSeo;
  year: number;
};

const IndexPage = (props: PropsWithoutRef<IndexPageProps>) => {
  const { seoInfo, year } = props;
  const { uiVersion } = useAppConfig();
  const appInfo = useSelector((state) => state.appInfos.appInfo);
  const { appName } = appInfo || {};
  const {
    heroSectionContentStyles,
    heroSectionLayoutBg,
    heroSectionMinHeight,
    heroSectionMobileMinHeight,
    heroSectionBgColor,
    heroSectionUseMobileBg
  }: {
    heroSectionContentStyles: SxProps;
    heroSectionLayoutBg?: HeroSectionLayoutBg;
    heroSectionMinHeight?: number;
    heroSectionMobileMinHeight?: number;
    heroSectionBgColor?: string;
    heroSectionUseMobileBg?: boolean;
  } = useMemo(() => {
    let styles: SxProps = {};
    let layoutBg: HeroSectionLayoutBg;
    let minHeight: number;
    let mobileMinHeight: number;
    let bgColor: string;
    let useMobileBg = false;
    if (appName === "toeic") {
      styles = {
        "& .title-h1, & .summary": { textShadow: "2px 2px 8px #000 !important" },
        pt: "120px", "@media (max-width: 576px)": { pt: 0 }
      };
    } else if (appName === "nclex") {
      styles = {
        "& .title-h1": { textAlign: "left !important", maxWidth: 700, color: "#20447D", textShadow: "none !important" },
        "& .summary": { margin: "inherit !important", maxWidth: "700px !important", color: "#394E70" }
      };
      layoutBg = "grid-right"; minHeight = 500; mobileMinHeight = 320; bgColor = "#F2F6FC";
    } else if (appName === "ged") {
      styles = {
        "& .title-h1": { textAlign: "left !important", maxWidth: 700, color: "#3F330F", textShadow: "none !important" },
        "& .summary": { margin: "inherit !important", maxWidth: "700px !important", color: "#6A6D72" }
      };
      layoutBg = "grid-right"; minHeight = 500; mobileMinHeight = 320; bgColor = "#F2F6FC";
    } else if (appName === "hvac") {
      layoutBg = "full-text-left"; minHeight = 450; mobileMinHeight = 320; bgColor = "#edf2f5"; useMobileBg = true;
      styles = {
        "& .title-h1": { textAlign: "left !important", maxWidth: 700, color: "#414A2E", textShadow: "none !important" },
        "& .summary": { margin: "inherit !important", maxWidth: "700px !important", color: "#1D1D1D" }
      };
    } else if (appName === "alevel") {
      layoutBg = "full-text-left"; minHeight = 675; mobileMinHeight = 500; bgColor = "#EDF2F5";
      useMobileBg = true;
      styles = {
        "& .title-h1": { textAlign: "left !important", maxWidth: 700, color: "#fff !important", textShadow: "2px 2px 8px #000 !important" },
        "& .summary": { margin: "inherit !important", maxWidth: "700px !important", color: "#fff", textShadow: "2px 2px 8px #000" }
      };
    }
    return {
      heroSectionContentStyles: styles,
      heroSectionLayoutBg: layoutBg,
      heroSectionMinHeight: minHeight,
      heroSectionMobileMinHeight: mobileMinHeight,
      heroSectionBgColor: bgColor,
      heroSectionUseMobileBg: useMobileBg
    };
  }, [appName]);

  usePageAuth();
  useGeoInfo();

  return (
    <Layout
      {...getWebSEOProps(seoInfo)}
      {...getWebAppProps(appInfo)}
    >
      <HeroSection
        titleH1={seoInfo?.titleH1}
        summary={seoInfo?.summary}
        bgImage={`/images/app/${appName}/bg-hero-section.png`}
        ctaElement={<HomeCTAElement />}
        contentStyles={heroSectionContentStyles}
        layoutBg={heroSectionLayoutBg}
        minHeight={heroSectionMinHeight}
        mobileMinHeight={heroSectionMobileMinHeight}
        backgroundColor={heroSectionBgColor}
        mobileBgImage={heroSectionUseMobileBg ? `/images/app/${appName}/bg-hero-section-mob.png` : ''}
      />
      <PracticeTopicsSection seoInfo={seoInfo} year={year} />
      <Functions />
      {uiVersion === 2 && appName === 'toeic' ? <ReviewVerTwo /> : <Review />}
      {uiVersion === 2 && appName === 'toeic' ? <FeatureApp /> : <DownloadApp />}
      <Introduction content={seoInfo?.content} />
      <Footer />
      <SelectStateDialog />
    </Layout>
  );
};

export const getStaticProps = wrapper.getStaticProps(async ({ store, locale, defaultLocale }: GetStaticPropsReduxContext) => {
  const appName = process.env.NEXT_PUBLIC_APP_NAME;
  if (!appName) throw new Error("appName is not defined");
  const appInfo = await apiGetAppSettingDetails({ appName });
  store.dispatch(setAppInfo(appInfo));
  if (!appInfo) return {
    notFound: true,
  };
  const slug = locale === defaultLocale ? "/" : `/${locale}`;
  const seoInfo = await apiGetSEOInfo(appInfo._id, slug);
  store.dispatch(setKeySEOInfo(seoInfo));

  if (["cscs", "asvab"].includes(appName)) {
    const practiceList: Topic[] = [];
    const { practiceCourseIndex, mapSlugData } = useServerPracticeData(appName);
    const slugs = Object.keys(mapSlugData || {});
    const practiceCourseId = (appInfo.courseIds ?? [])[practiceCourseIndex];
    if (practiceCourseId) {
      const topics = await apiGetTopicsBySlugs({
        courseId: practiceCourseId,
        slug: slugs,
        topicFields: ["_id", "name", "avatar", "slug"],
        local: true
      });
      practiceList.push(...topics);
    }
    store.dispatch(setPracticeList(practiceList));
  } else if (["hvac"].includes(appName)) {
    const { practiceCourseIndex, practiceParentSlug } = useServerPracticeData(appName);
    const practiceList: Topic[] = [];
    if (typeof practiceCourseIndex !== "undefined") {
      const courseId = (appInfo.courseIds ?? [])[practiceCourseIndex];
      if (!!courseId && !!practiceParentSlug) {
        const [res] = await apiGetTopicsByParentSlug({
          courseId, slug: practiceParentSlug, field: "orderIndex", local: true,
          topicFields: ["_id", "avatar", "name", "slug"]
        });
        practiceList.push(...(res?.children ?? []));
      }
    }
    store.dispatch(setPracticeList(practiceList));
  } else if (["cdl", "dmv"].includes(appName)) {
    const states = useServerStateData(appName);
    store.dispatch(setStatesList(states));
  } else if (["nclex"].includes(appName)) {
    const { mapSlugData = {} } = useServerPracticeData(appName);
    const practiceList: Topic[] = [];
    Object.values(mapSlugData).filter(({ tag }) => tag !== "flash-card").forEach(({ children = {} }) => {
      practiceList.push(...Object.entries(children).map(([slug, { name, avatar }]) => ({
        slug, name, avatar
      } as any) as Topic))
    });
    store.dispatch(setPracticeList(practiceList));
  }

  return {
    props: {
      seoInfo,
      year: moment().year()
    },
    // revalidate: 300,
  };
});

export default IndexPage;

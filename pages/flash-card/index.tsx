import { Box, Container, Grid, Typography } from "@mui/material";
import _ from "lodash";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "../../app/hooks";
import { ROUTER_STUDY } from "../../app/router";
import { wrapper } from "../../app/store";
import Footer from "../../components/footer";
import Introduction from "../../components/introduction";
import NclexSubjectTabs from "../../components/practice-topics-section/nclex/NCLEXSubjectTabs";
import RawLink from "../../components/RawLink";
import TestItem from "../../components/test-item";
import { apiGetAppSettingDetails, apiGetSEOInfo } from "../../features/appInfo/appInfo.api";
import { setAppInfo, setKeySEOInfo } from "../../features/appInfo/appInfo.slice";
import Layout from "../../features/common/Layout";
import { apiGetTopicsByParentSlug } from "../../features/study/topic.api";
import usePageAuth from "../../hooks/usePageAuth";
import useServerPracticeData from "../../hooks/useServerPracticeData";
import Topic from "../../modules/share/model/topic";
import WebSeo from "../../modules/share/model/webSeo";
import { MapSlugData, NCLEXFlashCardSubject, PracticeDataConfig } from "../../types/appPracticeTypes";
import { GetStaticPropsReduxContext } from "../../types/nextReduxTypes";
import { getWebAppProps, getWebSEOProps } from "../../utils/getSEOProps";

type MapSlugChildrenTopics = {
  [slug: string]: Array<Topic>;
}

type FlashCardPracticePageProps = {
  seoInfo: WebSeo;
  practiceList: Topic[];
  mapSlugData: MapSlugData;
  mapChildrenTopics?: MapSlugChildrenTopics
}

const flashCardSubjectKey = "subject-flashcard";

const FlashCardPracticePage = (props: FlashCardPracticePageProps) => {
  const { seoInfo, practiceList: _practiceList, mapSlugData, mapChildrenTopics = {} } = props;
  const appInfo = useSelector((state) => state.appInfos.appInfo);
  const [subject, setSubject] = useState<NCLEXFlashCardSubject>("nclex-rn-vocabulary");
  const isClient = typeof window !== "undefined";
  const isSubjectType = !_.isEmpty(mapChildrenTopics);

  const practiceList = useMemo(() => {
    return !isSubjectType ? _practiceList : mapChildrenTopics[subject];
  }, [subject, isSubjectType, _practiceList]);

  const col = useMemo(() => {
    let col = 5;
    if (appInfo?.appName === "nclex") col = 4;
    return col;
  }, [appInfo?.appName]);

  useEffect(() => {
    if (isClient && appInfo) {
      const subject = sessionStorage.getItem(flashCardSubjectKey);
      if (typeof subject === "string") {
        if (appInfo.appName === "nclex") {
          const _subject = subject as NCLEXFlashCardSubject;
          setSubject((_subject === "nclex-pn-vocabulary" || _subject === "nclex-rn-vocabulary") ? _subject : "nclex-rn-vocabulary");
        }
      }
    }
  }, [isClient, appInfo?.appName]);

  usePageAuth();

  const onChangeSubject = (subject: NCLEXFlashCardSubject) => {
    setSubject(subject);
    sessionStorage.setItem(flashCardSubjectKey, `${subject}`);
  }

  return <Layout
    {...getWebAppProps(appInfo)}
    {...getWebSEOProps(seoInfo)}
  >
    <div id="flash-card-practice-list">
      <Container>
        <Typography
          component="h1"
          className="title-h1"
          sx={{ textAlign: "center", fontWeight: 600, fontSize: "35px", pt: "50px", pb: "30px" }}
        >
          {seoInfo?.titleH1}
        </Typography>
        <div
          style={{ color: 'var(--contentColor)', textAlign: "center" }}
          dangerouslySetInnerHTML={{ __html: seoInfo?.summary }}
        ></div>

        {appInfo?.appName === "nclex" && <div style={{ paddingBottom: "50px" }}>
          <NclexSubjectTabs
            mapSlugData={_.pickBy(mapSlugData, ({ tag }) => tag === "flash-card")}
            subject={subject}
            onChangeSubject={onChangeSubject}
          />
        </div>}

        <Grid container spacing={2}>
          {practiceList.map((topic) => {
            const slug = !isSubjectType
              ? topic.slug
              : `${subject}/${topic.slug}`
            const meta = !isSubjectType
              ? (mapSlugData[topic.slug]?.meta ?? [])
              : (mapSlugData[subject]?.children || {})[topic.slug]?.meta ?? [];
            const link = `/${ROUTER_STUDY}/flash-card/${slug}`;

            return <Grid key={topic._id} item xs={12} sm={6} md={(12 / col)}>
              <RawLink href={link}>
                <Box sx={{ transition: "transform 0.2s linear", "&:hover": { transform: "translateY(-14px)" } }}>
                  <TestItem item={topic} meta={meta} />
                </Box>
              </RawLink>
            </Grid>;
          })}
        </Grid>

        <Introduction content={seoInfo?.content} />
      </Container>
    </div>
    <Footer />
  </Layout>
}

export const getStaticProps = wrapper.getStaticProps(async ({ store }: GetStaticPropsReduxContext) => {
  const appName = process.env.NEXT_PUBLIC_APP_NAME;
  if (!appName) throw new Error("appName is not defined");
  if (![
    "hvac",
    "nclex"
  ].includes(appName)) return {
    notFound: true
  }
  const appInfo = await apiGetAppSettingDetails({ appName });
  store.dispatch(setAppInfo(appInfo));
  if (!appInfo) return {
    notFound: true
  }
  const seoInfo = await apiGetSEOInfo(appInfo._id, "/flash-card");
  // store.dispatch(setSEOInfo(seoInfo));
  store.dispatch(setKeySEOInfo(seoInfo));

  const { flashCardCourseIndex, flashCardParentSlug, mapSlugData }: PracticeDataConfig = useServerPracticeData(appName);
  const flashCardCourseId = (appInfo.courseIds ?? [])[flashCardCourseIndex] ?? '';
  const practiceList: Topic[] = [];
  const mapChildrenTopics: MapSlugChildrenTopics = {};
  if (appName === "hvac") {
    if (flashCardCourseId && flashCardParentSlug) {
      const [res] = await apiGetTopicsByParentSlug({
        courseId: flashCardCourseId, slug: flashCardParentSlug, field: "orderIndex", local: true,
        topicFields: ["_id", "avatar", "name", "slug"], exerciseFields: ["questionsNum", "duration", "contentType"]
      });
      practiceList.push(...(res?.children ?? []));
    }
  } else if (appName === "nclex") {
    if (flashCardCourseId) {
      practiceList.push(...Object.entries(mapSlugData).filter(([_, { tag }]) => tag === "flash-card").map(([slug, { name, avatar = null }]) => {
        return { slug, name, avatar } as Topic
      }));
      await Promise.all(practiceList.map(async ({ slug }) => {
        const [res] = await apiGetTopicsByParentSlug({
          courseId: flashCardCourseId, slug, field: "orderIndex", local: true,
          topicFields: ["_id", "avatar", "name", "slug"], exerciseFields: ["questionsNum", "duration", "contentType"]
        });
        mapChildrenTopics[slug] = res?.children ?? [];
      }));
    }
  }

  return {
    props: {
      seoInfo,
      practiceList,
      mapSlugData,
      mapChildrenTopics
    }
  }
});

export default FlashCardPracticePage;
import { PropsWithoutRef, useEffect } from "react";
import { useDispatch, useSelector } from "../../../app/hooks";
import { ROUTER_STUDY } from "../../../app/router";
import { fetchTopicsByParentSlug } from "../../../features/study/topic.slice";
import usePracticeData from "../../../hooks/usePracticeData";
import { TOPIC_TYPE_TEST } from "../../../modules/share/constraint";
import Topic from "../../../modules/share/model/topic";
import WebSeo from "../../../modules/share/model/webSeo";
import { DMVSubject } from "../../../types/appPracticeTypes";
import CDLStateView from "../cdl/CDLStateView";
import DMVChangeStateButton from "./DMVChangeStateButton";

const DMVCDLStateView = (props: PropsWithoutRef<{
  stateSlug: string;
  subjectSlug: string;
  useMapSeo?: boolean;
  seoInfo?: WebSeo;
}>) => {
  const { stateSlug, subjectSlug, useMapSeo, seoInfo } = props;
  const subject: DMVSubject = "dmv-cdl-permit";
  const { mapSlugData = {} } = usePracticeData("cdl");
  const { mapSubjectCourseIndex } = usePracticeData();

  const appInfo = useSelector((state) => state.appInfos.appInfo);
  const dispatch = useDispatch();

  useEffect(() => {
    const testCourseIndex = mapSubjectCourseIndex?.findIndex((e) => e === subject);
    const courseId = (appInfo?.courseIds ?? [])[testCourseIndex];
    if (!!courseId) {
      if (Object.keys(mapSlugData).length) {
        dispatch(fetchTopicsByParentSlug({
          courseId, slug: Object.keys(mapSlugData), baseSlug: stateSlug,
          asc: true, field: "orderIndex", exerciseFields: ["questionsNum", "duration"], topicTypes: [TOPIC_TYPE_TEST],
          local: false
        }))
      }
    }
  }, []);

  return <CDLStateView
    stateSlug={stateSlug}
    bgHeroSection={`/images/app/dmv/bg-hero-section-dmv-cdl-permit.png`}
    ctaHeroSection={<DMVChangeStateButton subject="dmv-cdl-permit" />}
    testList={Object.keys(mapSlugData).map((slug) => ({ ...(mapSlugData[slug] || {}), slug } as Topic))}
    getPracticeStudySlug={(topic) => `/${ROUTER_STUDY}/dmv-cdl-permit/${stateSlug}/${topic.slug}`}
    practiceId="practice"
    testId="full-test"
    useMapSeo={useMapSeo}
    seoInfo={seoInfo}
  />
}

export default DMVCDLStateView;
import _ from "lodash";
import { useRouter } from "next/router";
import { useMemo } from "react";
import { useSelector } from "../../app/hooks";
import useAppConfig from "../../hooks/useAppConfig";
import usePracticeData from "../../hooks/usePracticeData";
import { DMVSubject } from "../../types/appPracticeTypes";

export enum StudyPlanBuildStep {
  INTRO,
  BEGIN_TARGET,
  STATE,
  TOPIC,
  TEST_DATE,
  END
}

export const DAILY_GOAL_RATIO = 0.05;

export default function useStudyPlanConfig() {
  const router = useRouter();
  const appInfo = useSelector((state) => state.appInfos.appInfo);
  const childAppSlug = router.query.app as string;
  const appConfig = useAppConfig();
  const appPracticeData = usePracticeData();
  const config = useMemo(() => {
    let courseId = "";
    let buildStudyPlanByTopic = false;
    let isTopicQuestion = false;
    let initTopicSlugs: Array<string> | null = null;
    const {
      mapSubjectCourseIndex,
      practiceCourseIndex,
      mapSlugData
    } = appPracticeData;
    if (!!appInfo) {
      if (appInfo.appName === "cscs") {
        initTopicSlugs = Object.entries(mapSlugData).filter(([_, { tag }]) => tag === "practice-test").map(([slug]) => slug);
      }
      if (appInfo.appName === "nclex" || appInfo.appName === "hvac") {
        initTopicSlugs = Object.entries(mapSlugData).filter(([_, { tag }]) => tag !== "flash-card").map(([slug]) => slug);
      }
      if (appInfo.appName === "dmv") {
        courseId = (appInfo.courseIds ?? [])[mapSubjectCourseIndex.indexOf(childAppSlug)];
        buildStudyPlanByTopic = childAppSlug as DMVSubject === "dmv-cdl-permit";
      } else {
        courseId = (appInfo.courseIds ?? [])[practiceCourseIndex];
        buildStudyPlanByTopic = ["cdl"].includes(appInfo.appName);
      }
      isTopicQuestion = ["dmv", "cdl"].includes(appInfo.appName);
    }
    const hasState = appConfig.hasState;
    const steps: Array<StudyPlanBuildStep> = [
      StudyPlanBuildStep.INTRO,
      StudyPlanBuildStep.BEGIN_TARGET
    ];
    if (hasState) steps.push(StudyPlanBuildStep.STATE);
    if (buildStudyPlanByTopic) steps.push(StudyPlanBuildStep.TOPIC);
    steps.push(StudyPlanBuildStep.TEST_DATE);
    steps.push(StudyPlanBuildStep.END);
    return {
      courseId,
      hasState,
      buildStudyPlanByTopic,
      steps,
      isTopicQuestion,
      initTopicSlugs
    }
  }, [appInfo, childAppSlug, appPracticeData]);

  return config;
}
import { unwrapResult } from "@reduxjs/toolkit";
import ObjectID from "bson-objectid";
import _ from "lodash";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "../../../app/hooks";
import StudyPlan from "../../../modules/share/model/studyPlan";
import { apiOffsetTopicsByParentId } from "../../study/topic.api";
import { apiGetCourseProgress } from "../studyPlan.api";
import { fetchStudyPlan, getQuestionsNumByCourse, setCurrentPlan } from "../studyPlan.slice";

export const useUserStudyPlan = (args: {
  userId: string;
  courseId: string;
  client?: boolean;
  key?: any;
  fetchedPlan?: boolean;
}) => {
  const {
    userId,
    courseId,
    client,
    key,
    fetchedPlan
  } = args;

  const listPlans = useSelector((state) => state.studyPlanState.listPlans);
  const dispatch = useDispatch();

  useEffect(() => {
    if (fetchedPlan) return;
    if (client) {
      const plan = listPlans
        .filter((e) => !!e.lastUpdate)
        .sort((a, b) => b.lastUpdate - a.lastUpdate)
        .find((e) => e.courseId === courseId && e.userId === userId);
      dispatch(setCurrentPlan({ studyPlan: plan }));
    } else {
      // Server Side StudyPlan
      dispatch(fetchStudyPlan({ courseId, userId, withDailyGoals: true }));
    }
  }, [userId, courseId, client, key, fetchedPlan]);
}

export const useStudyPlanProgress = (args: {
  studyPlan: StudyPlan;
  userId: string;
  client?: boolean;
}) => {
  const { userId, studyPlan, client } = args;

  const topicProgresses = useSelector((state) => state.topicState.topicProgresses);

  const [topicIds, setTopicIds] = useState<string[] | null>(studyPlan.topicIds);
  const [overallProgress, setOverallProgress] = useState(0);

  useEffect(() => {
    if (!!studyPlan) {
      if (studyPlan.topicIds) setTopicIds(studyPlan.topicIds);
      else {
        const courseId = studyPlan.courseId;
        apiOffsetTopicsByParentId({
          parentId: null,
          courseId,
          serverSide: false,
          topicFields: ["_id"]
        }).then((topics) => {
          setTopicIds(topics.map((e) => e._id))
        });
      }
    }
  }, [studyPlan?._id]);

  useEffect(() => {
    if (!!studyPlan?._id && !!topicIds) {
      if (client) {
        const tp = Object.values(topicProgresses).filter((e) => topicIds.includes(e.topicId) && e.userId === userId);
        const progress = _.sumBy(tp, (e) => e.progress ?? 0);
        setOverallProgress(topicIds.length ? (progress / topicIds.length) : 0)
      } else {
        apiGetCourseProgress({
          courseId: studyPlan.courseId,
          userId,
          topicIds: topicIds ? topicIds : undefined
        })
          .then((ovp) => {
            setOverallProgress(ovp);
          })
      }
    }
  }, [userId, topicIds, client]);

  return { overallProgress }
}

export const useStudyPlanQuestionsNum = (args: {
  courseId: string;
  topicIds?: string[];
  isTopicQuestion?: boolean;
  callback?: (data: { studyPlanId: string; totalQuestions: number }, error?: Error) => void;
  studyPlanId?: string;
  initTotalQuestionsNum?: number;
}) => {
  const {
    courseId,
    topicIds,
    isTopicQuestion,
    callback = () => { },
    studyPlanId = new ObjectID(new Date().getTime()).toHexString(),
    initTotalQuestionsNum
  } = args;
  const mapStudyPlanQuestionsNum = useSelector((state) => state.studyPlanState.mapStudyPlanQuestionsNum);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!!studyPlanId) {
      if (typeof initTotalQuestionsNum !== "undefined") {
        callback({ totalQuestions: initTotalQuestionsNum, studyPlanId })
        return;
      }
      const dataQuestionsNum = mapStudyPlanQuestionsNum[studyPlanId];
      const shouldUpdate = !dataQuestionsNum;
      if (shouldUpdate) {
        dispatch(getQuestionsNumByCourse({
          courseId,
          topicIds,
          isTopicQuestion,
          studyPlanId
        }))
          .then(unwrapResult)
          .then(({ totalQuestions }) => callback({ studyPlanId, totalQuestions }))
          .catch((e) => callback({ studyPlanId, totalQuestions: 0 }, e));
      } else {
        callback({ studyPlanId, totalQuestions: dataQuestionsNum });
      }
    }
  }, []);
}
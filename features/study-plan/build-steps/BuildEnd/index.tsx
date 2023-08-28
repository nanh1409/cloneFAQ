import { CircularProgress } from "@mui/material";
import _ from "lodash";
import moment from "moment";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "../../../../app/hooks";
import DailyGoal from "../../../../modules/share/model/dailyGoal";
import { useStudyPlanQuestionsNum } from "../../hooks/useUserStudyPlan";
import { createDailyGoals, initStudyPlan, updatePlan } from "../../studyPlan.slice";
import { genGoalSequence, getPlanQuestionsNum } from "../../studyPlan.util";
import { DAILY_GOAL_RATIO } from "../../useStudyPlanConfig";
import UserStudyPlan from "../UserStudyPlan";
import "./buildEnd.scss";

const StudyPlanBuildEndStep = () => {
  const mapStudyPlanQuestionsNum = useSelector((state) => state.studyPlanState.mapStudyPlanQuestionsNum);
  const studyPlan = useSelector((state) => state.studyPlanState.currentStudyPlan);
  const isTopicQuestion = useSelector((state) => state.studyPlanState.isTopicQuestion);
  const user = useSelector((state) => state.authState.user);
  const [initStudyPlanId, setInitStudyPlanId] = useState("");

  const dispatch = useDispatch();

  const [buildPercent, setBuildPercent] = useState(0);
  const [buildComplete, setBuildComplete] = useState(false);

  useStudyPlanQuestionsNum({
    courseId: studyPlan.courseId,
    topicIds: studyPlan.topicIds,
    isTopicQuestion,
    callback: ({ studyPlanId }, e) => {
      if (!e) {
        setInitStudyPlanId(studyPlanId);
      };
    }
  });

  useEffect(() => {
    if (!!initStudyPlanId) {
      const totalQuestions = mapStudyPlanQuestionsNum[initStudyPlanId] ?? 0;
      if (!!totalQuestions) {
        const dayLeft = moment(studyPlan.testDate).diff(studyPlan.startDate, "days") + 1;
        const planQuestions = getPlanQuestionsNum({ totalQuestions, target: studyPlan.target });
        const goals = genGoalSequence({ total: planQuestions, ratio: DAILY_GOAL_RATIO, elementsNum: dayLeft });
        const studyPlanId = initStudyPlanId;
        const dailyGoals = goals.map((e, i) => new DailyGoal({
          date: moment(studyPlan.startDate).add(i, "day").valueOf(),
          userId: studyPlan.userId,
          dailyGoal: e,
          studyPlanId: !user ? studyPlanId : undefined
        }));
        if (!user) {
          dispatch(createDailyGoals(dailyGoals));
          dispatch(updatePlan({ ...studyPlan, _id: studyPlanId }))
        } else {
          dispatch(initStudyPlan({
            studyPlan,
            dailyGoals
          }));
        }
      }
    }
  }, [!!initStudyPlanId]);

  let buildTimer: any = null;

  useEffect(() => {
    if (!!initStudyPlan) {
      if (!buildTimer) {
        buildTimer = setTimeout(() => {
          if (buildPercent >= 100) {
            clearTimeout(buildTimer);
            setBuildComplete(true);
            return;
          }
          setBuildPercent((prev) => prev + _.sample([1, 2]));
        }, 50);
      }
    }
    return () => {
      if (buildTimer) {
        clearTimeout(buildTimer);
      }
    }
  }, [!!initStudyPlan, buildPercent]);

  return <div className="study-plan-build-end">
    {buildComplete
      ? (!!initStudyPlanId && <UserStudyPlan initStudyPlanId={initStudyPlanId} initTotalQuestions={mapStudyPlanQuestionsNum[initStudyPlanId]} />)
      : <>
        <div className="study-plan-build-end-header">
          <div className="study-plan-build-end-header-title">
            Preparing your plan...
          </div>
        </div>
        <div className="study-plan-build-progress">
          <CircularProgress variant="determinate" value={buildPercent} size={200} />
          <div className="study-plan-build-progress-label">
            {buildPercent}%
          </div>
        </div>
      </>}
  </div>
}

export default StudyPlanBuildEndStep;
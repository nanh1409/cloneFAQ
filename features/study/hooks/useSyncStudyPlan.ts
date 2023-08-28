import moment from "moment";
import { useEffect } from "react";
import { useDispatch, useSelector } from "../../../app/hooks";
import { requestUpdateDailyGoal, updateDailyGoal } from "../../study-plan/studyPlan.slice";

interface UseSyncStudyPlanProps {

}

const useSyncStudyPlan = (args: UseSyncStudyPlanProps = {}) => {
  const topic = useSelector((state) => state.topicState.currentTopic);
  const studyPlan = useSelector((state) => state.studyPlanState.currentStudyPlan);
  const dailyGoals = useSelector((state) => state.studyPlanState.dailyGoals);
  const lastCardProgress = useSelector((state) => state.studyPlanState.lastCardProgress);
  const user = useSelector((state) => state.authState.user);
  // const gameAPIArgs = useSelector((state) => state.gameState.gameAPIArgs);

  const dispatch = useDispatch();

  useEffect(() => {
    if (!!lastCardProgress && !!studyPlan) {
      const topicIds = studyPlan.topicIds;
      if (!topicIds || !topicIds.length || topicIds.some((id) => topic.paths.includes(id))) {
        const { correct, lastUpdate, history, oldLastUpdate = 0 } = lastCardProgress;
        const currentDateGoal = dailyGoals.find(({ date, studyPlanId }) =>
          moment(date).isSame(lastUpdate, "day") && studyPlanId === studyPlan._id
        );
        if (currentDateGoal) {
          const isSameDate = moment(oldLastUpdate).isSame(lastUpdate, "day");
          const isIncreaseLearned = !isSameDate || (isSameDate && (history.length <= 1));
          const isIncreaseMastered = !isSameDate || (isSameDate && (history.length <= 1 || !history.slice(-2, -1)[0])) && correct;
          const currentMastered = currentDateGoal?.masteredQuestion ?? 0;
          const isDecreaseMastered =
            currentMastered > 0 &&
            !correct &&
            (!isSameDate || (isSameDate && history.length >= 2 && history.slice(-2).every((v) => !v)))

          const newGoal = {
            ...currentDateGoal,
            learned: (currentDateGoal?.learned ?? 0) + (isIncreaseLearned ? 1 : 0),
            masteredQuestion: currentMastered + (isIncreaseMastered ? 1 : (isDecreaseMastered ? -1 : 0))
          };
          if (!!user) {
            dispatch(requestUpdateDailyGoal(newGoal))
          } else {
            dispatch(updateDailyGoal(newGoal));
          }
        }
      }
    }
  }, [lastCardProgress, user]);
}

export default useSyncStudyPlan;
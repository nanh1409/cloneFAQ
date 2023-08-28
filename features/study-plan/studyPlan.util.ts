import _ from "lodash";
import moment from "moment";
import DailyGoal from "../../modules/share/model/dailyGoal";
import { StudyPlanTargetLevel } from "../../modules/share/model/studyPlan";

export const genGoalSequence = (args: {
  total: number;
  ratio: number;
  elementsNum: number;
}) => {
  const {
    total,
    ratio,
    elementsNum
  } = args;
  if (elementsNum <= 1) return [total];
  const elements: number[] = [];
  let _total = total;
  for (let i = 0; i < elementsNum; i++) {
    const dayRemain = elementsNum - i;
    if (dayRemain <= 1) {
      elements.push(_total);
      _total = 0;
    };
    const _x = Math.round((2 * _total) / (dayRemain * (2 + (dayRemain - 1) * ratio)));
    const x = _x < 0 ? 0 : _x;
    _total -= x;
    elements.push(x);
  }
  return elements.filter((e) => e > 0);
}

/**
 * 
 * @returns 
 *  - `forecastValue` `v`. if `v > 1`, user is below the target; if `v < -1`, user is ahead of schedule; else user is on the right track.
 *  - `totalQuestions`: Total Questions (set by dailyGoals)
 *  - `futureGoalsCount`: all questions that's not in mastered
 */
export const forecastStudyPlan = (args: {
  totalQuestions: number;
  dailyGoals: DailyGoal[];
  currentDate?: Date;
  startDate?: Date;
  endDate?: Date;
}) => {
  const {
    totalQuestions,
    dailyGoals,
    currentDate = new Date(),
    startDate = new Date(),
    endDate = new Date()
  } = args;

  const totalMasteredQuestions = _.reduce(dailyGoals, (total, { masteredQuestion = 0, date }) =>
    (total + (moment(date).isBefore(currentDate, "day") ? masteredQuestion : 0))
    , 0);
  if (totalMasteredQuestions >= totalQuestions) return {
    totalQuestions,
    forecastValue: 0
  };
  const dayLeft = moment(endDate).diff(startDate, "day");
  const futureGoalsCount = _.reduce(dailyGoals, (total, { date, dailyGoal, masteredQuestion = 0 }) => {
    if (moment(date).isAfter(currentDate, "day")) {
      return total + dailyGoal;
    } else if (moment(date).isSame(currentDate, "day")) {
      return total + (masteredQuestion <= dailyGoal ? dailyGoal - masteredQuestion : masteredQuestion)
    }
    return total;
  }, 0);
  const avgGoal = Math.round(totalQuestions / dayLeft) || 1;
  // console.log(totalQuestions, futureGoalsCount, totalMasteredQuestions);
  return {
    totalQuestions,
    forecastValue: Math.round((totalQuestions - (futureGoalsCount + totalMasteredQuestions)) / avgGoal)
  };
}

export const getPlanQuestionsNum = (args: { totalQuestions: number; target: StudyPlanTargetLevel }) => {
  const { totalQuestions, target } = args;
  let planQuestions = totalQuestions;
  switch (target) {
    case StudyPlanTargetLevel.Pass:
      planQuestions = Math.ceil(0.5 * totalQuestions);
      break;
    case StudyPlanTargetLevel.Advanced:
      planQuestions = Math.ceil(0.7 * totalQuestions);
      break;
    case StudyPlanTargetLevel.Master:
      planQuestions = Math.ceil(0.9 * totalQuestions);
      break;
    default:
      break;
  }
  return planQuestions;
}
import DailyGoal from "../../modules/share/model/dailyGoal";
import StudyPlan from "../../modules/share/model/studyPlan";
import { get, post } from "../../utils/fetcher";

export const apiCountQuestionsByCourse = async (args: {
  courseId: string;
  topicIds?: string[];
  isTopicQuestion?: boolean;
}): Promise<{ totalQuestions: number }> => {
  const { courseId, topicIds, isTopicQuestion } = args;
  const params: any = { courseId, isTopicQuestion, type: "count_questions_by_course" };
  if (!!topicIds) params.topicIds = topicIds.join(",");
  const { data, error } = await get({ endpoint: "/api/new/cards", params });
  return error ? { totalQuestions: 0 } : data;
}

export type InitStudyPlanArgs = {
  studyPlan: Omit<StudyPlan, "_id">;
  dailyGoals: Array<Omit<DailyGoal, "_id" | "studyPlanId">>;
}
export const apiInitStudyPlan = async (args: InitStudyPlanArgs): Promise<StudyPlan | null> => {
  const { data, error } = await post({ endpoint: "/api/study-plans", body: args, params: { type: "init_study_plan" } });
  return error ? null : data;
}

export type UpdateStudyPlanArgs = { _id: string } & Partial<Omit<StudyPlan, "_id">>;
export const apiUpdateStudyPlan = async (args: UpdateStudyPlanArgs): Promise<StudyPlan | null> => {
  const { data, error } = await post({ endpoint: "/api/study-plans", body: args, params: { type: "update_study_plan" } });
  return error ? null : data;
}

export type UpdateDailyGoalArgs = Partial<DailyGoal>;
export const apiUpdateDailyGoal = async (args: UpdateDailyGoalArgs): Promise<DailyGoal | null> => {
  const { data, error } = await post({ endpoint: "/api/study-plans", body: args, params: { type: "update_daily_goal" } });
  return error ? null : data;
}

export type GetStudyPlanByCourseArgs = {
  courseId: string;
  userId: string;
  withDailyGoals?: boolean;
}
export const apiGetStudyPlanByCourse = async (args: GetStudyPlanByCourseArgs): Promise<{ studyPlan: StudyPlan; dailyGoals?: Array<DailyGoal> }> => {
  const { data, error } = await get({ endpoint: "/api/get-study-plan-by-course", params: args });
  return error ? { studyPlan: null } : data;
}

export const apiGetCourseProgress = async (args: { courseId: string; userId: string; topicIds?: string[] }): Promise<number> => {
  const { data, error } = await get({ endpoint: "/api/topic-progresses", params: { ...args, type: "get-course-progresses" } });
  return error ? 0 : data;
}

export const apiBulkUpdateDailyGoals = async (args: Array<DailyGoal>): Promise<{ updated: number; }> => {
  const { data, error } = await post({ endpoint: "/api/study-plans", body: args, params: { type: "bulk_update_daily_goals" } });
  return { updated: error ? 0 : (data?.updated ?? 0) }
}
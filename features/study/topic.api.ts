import { MapCardBox } from "../../modules/new-game/src/models/game.core";
import { Card } from "../../modules/share/model/card";
import MyCardData from "../../modules/share/model/myCardData";
import Skill from "../../modules/share/model/skill";
import { StudyScore } from "../../modules/share/model/studyScore";
import { StudyScoreData } from "../../modules/share/model/studyScoreData";
import StudyScoreDetail from "../../modules/share/model/studyScoreDetail";
import Topic from "../../modules/share/model/topic";
import TopicProgress from "../../modules/share/model/topicProgress";
import { get, getEndpoint, post, postWithStatus } from "../../utils/fetcher";
import { CreateAppPracticeDataArgs, CreateSkillGameArgs, GetTopicsByParentSlugArgs, GetTopicsBySlugsArgs, OffsetTopicsByParentIdArgs, TopicWithUser, UpdateAppPracticeDataArgs, _TopicSetting } from "./topic.model";
import { OnUpdateCardBookmarksSync, StudyScoreDetailSync, TopicItem } from "./topic.slice";

export const apiGetEntryTopicsBySlugs = async (args: { slugs: string[]; courseIds?: string[]; entryTopicTypes?: number[]; local?: boolean }): Promise<{ notFound: boolean; data: TopicItem[]; error?: boolean }> => {
  const { local = false, slugs, courseIds, entryTopicTypes } = args;
  const { data, error } = await post({
    endpoint: getEndpoint('/api/get-entry-topics-by-slugs', local), body: {
      fields: ["_id", "avatar", "childType", "description", "name", "parentId", "slug", "type", "videoUrl", "shortDescription", "courseId", "paths", "accessLevel"],
      exerciseFields: ["contentType", "baremScore", "duration", "pass", "questionsPlayNum", "questionsNum", "shuffleQuestion", "topicSettingId"],
      slugs,
      courseIds,
      maxDepth: 3,
      entryTopicTypes
    }
  });
  return error ? { notFound: true, data: [], error: true } : data;
}

export const apiOffsetTopicsByParentId = async (args: OffsetTopicsByParentIdArgs): Promise<TopicItem[]> => {
  const { field = "orderIndex", asc = true, skip = 0, serverSide = false, ...rest } = args;
  const { data, error } = await postWithStatus({ endpoint: getEndpoint('/api/offset-topics-by-parent-id', serverSide), body: { field, asc, skip, ...rest } });
  return error ? [] : data;
}

export const apiGetTopicByParentId = async (args: { parentId: string, local?: boolean }) => {
  const { parentId, local = true } = args;
  const { data, error } = await post({ endpoint: getEndpoint('/api-cms/get-topic-by-parent-id', local), body: { parentId } });
  return error ? [] : data;
}

export const apiGetCourseByCategoryId = async (args: { categoryId: string, local?: boolean }) => {
  const { categoryId, local = true } = args;
  const { data, error } = await post({ endpoint: getEndpoint('/api-cms/get-course-by-category-id', local), body: { categoryId } })
}

export const apiGetTopicsByParentSlug = async (args: GetTopicsByParentSlugArgs): Promise<Array<{ _id: string; name: string; slug: string; children: TopicWithUser[] }>> => {
  const { local = true, ...payload } = args;
  const { data, error } = await post({ endpoint: getEndpoint('/api/get-topics-by-parent-slug', local), body: payload })
  return error ? [{}] : data;
}

export const apiGetTopicsBySlugs = async (args: GetTopicsBySlugsArgs): Promise<Array<Topic>> => {
  const { local = true, ...payload } = args;
  const { data, error } = await post({ endpoint: getEndpoint('/api/get-topics-by-slugs', local), body: payload })
  return error ? [] : data;
}

export const apiGetTopicProgresses = async (args: { topicIds: string[]; userId: string; includeStatData?: boolean; }): Promise<Array<TopicProgress & {
  totalCardNum?: number;
  correctNum?: number;
  incorrectNum?: number;
  boxCard?: { [cardId: string]: number; };
  cards?: Array<Pick<Card, "_id" | "type">>
}>> => {
  const { topicIds: ids, userId, includeStatData } = args;
  const topicIds = ids.join(",");
  const { data, error } = await get({ endpoint: "/api/topic-progresses", params: { topicIds, userId, includeStatData } });
  return error ? [] : data;
}

export const apiGetStudyData = async (args: { topicId: string, userId: string; }): Promise<StudyScore & { myCardData?: MyCardData } | null> => {
  const { data, error } = await get({ endpoint: "/api/app-study-data", params: { ...args, withMyCardData: true } });
  return error ? null : data;
}

export const apiCreateStudyData = async (args: CreateAppPracticeDataArgs): Promise<{
  studyScore: StudyScore, topicProgress: TopicProgress
}> => {
  const { data, error } = await post({ endpoint: "/api/app-study-data", params: { type: "create_practice_data" }, body: args });
  return error ? {} : data;
}

export const apiUpdateStudyData = async (args: UpdateAppPracticeDataArgs): Promise<number> => {
  const { data, error } = await post({ endpoint: "/api/app-study-data", params: { type: "update_practice_data" }, body: args });
  return error ? 0 : data;
}

export const apiCreateSkillGame = async (args: CreateSkillGameArgs): Promise<StudyScoreData> => {
  const { data, error } = await post({ endpoint: "/api/app-study-data", params: { type: "create_skill_game" }, body: args });
  return error ? null : data;
}

export const apiUpdateStudyScoreDetail = async (args: StudyScoreDetailSync) => {
  await post({ endpoint: "/api/update-exam-score-detail", body: args });
}

export const apiUpdateListStudyScoreDetail = async (args: Array<StudyScoreDetailSync>) => {
  await post({ endpoint: "/api/update-list-exam-score-detail", body: args });
}

export const apiBulkUpdateTopicProgresses = async (args: { topicProgresses: TopicProgress[]; }) => {
  await post({ endpoint: "/api/topic-progresses", params: { type: "bulk_update" }, body: { ...args, upsert: true } });
}

export const apiGetExamScoreDetails = async (args: { studyScoreDataId: string; userId: string }): Promise<StudyScoreDetail[]> => {
  const { data, error } = await post({ endpoint: "/api/get-exam-score-detail-by-parent-id", body: args });
  return error ? [] : data;
}

export const apiResetCardStudyData = async (args: { studyScoreDataId: string }) => {
  await post({ endpoint: "/api/app-study-data", params: { type: "reset_card_study_data" }, body: { ...args } })
}


export const apiSyncBoxCard = async (args: { topicId: string; userId: string; boxCard: MapCardBox }): Promise<MyCardData | null> => {
  const { data, error } = await post({ endpoint: "/api/app-study-data", params: { type: "sync_box_card" }, body: { ...args } })
  return error ? null : data;
}

export const apiGetTopicById = async (args: { topicId: string; withCourse?: boolean; withExercise?: boolean; populatePaths?: boolean; serverSide?: boolean; }): Promise<TopicItem> => {
  const { serverSide, ...payload } = args;
  const { data, error } = await post({ endpoint: getEndpoint("/api/get-topic-by-id", serverSide), body: payload });
  return error ? null : data;
}

export const apiGetCardsByTopicId = async (args: { topicId: string; cardTypes?: number[] }): Promise<Card[]> => {
  const { data, error } = await post({
    endpoint: "/api/get-card-by-topic-id",
    body: { topicId: args.topicId, type: args.cardTypes ?? [] }
  });
  return error ? [] : data
}

export const apiGetCardsByIds = async (args: { cardIds: string[] }): Promise<Card[]> => {
  const { data, error } = await post({
    endpoint: "/api/get-card-by-ids",
    body: args
  });
  return error ? [] : data;
}

export const apiGetSkillsByExamType = async (args: { examType: number }): Promise<Skill[]> => {
  const { data, error } = await get({ endpoint: "/api/get-skills", params: { examType: args.examType } });
  return error ? [] : data;
}

export const apiGetTopicSetting = async (args: { topicSettingId: string; includeSkills?: boolean; topicId?: string }): Promise<_TopicSetting> => {
  const { topicSettingId, includeSkills, topicId } = args;
  const { data, error } = await get({ endpoint: `/api/topic-settings/${topicSettingId}`, params: { includeSkills, topicId } });
  return error ? null : data;
}

export const apiGetSkillBasedExamData = async (args: { topicId: string; userId: string; skillIds: string[] }): Promise<StudyScore> => {
  const { userId, topicId, skillIds: _skillIds } = args;
  const params = { userId, topicId, skillIds: _skillIds.join(",") }
  const { data, error } = await get({ endpoint: "/api/skill-based-exam-data", params });
  return error ? null : data;
}

export const apiUpdateStudyScoreDetailBookmarks = async (args: OnUpdateCardBookmarksSync): Promise<MyCardData> => {
  const { data, error } = await post({ endpoint: "/api/update-exam-score-detail-bookmark", body: args });
  return error ? null : data;
}
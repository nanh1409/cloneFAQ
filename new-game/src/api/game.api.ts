import { Card } from "../models/card";
import Skill from "../models/skill";
import { get, post } from "../utils/fetcher";

export type StatisticCart = {
  _id: number & {
    _id: string,
    value: string,
    name: string
  },
  cards: Array<{
    cardId: string,
    correct: number
  }>,
  label?: string,
  data?: any
}

export type StatisticTag = {
  _id: string,
  name: string,
  value: string,
  topics: Array<{ _id: string, name: string, slug: string }>,
  totalCorrect?: number,
  totalIncorrect?: number,
  totalQuestions?: number,
}

export const apiGetCardsByTopicId = async (args: { topicId: string; cardTypes?: number[]; typeQuery?: string; questionTotal?: number; level?: number, courseId?: string, userId?: string, priorityLevel?: number[] }): Promise<Card[]> => {
  const { data, error } = await post({
    endpoint: "/api/get-card-by-topic-id",
    params: args.typeQuery ? { typeQuery: args.typeQuery } : {},
    body: { level: args.level, topicId: args.topicId, type: args.cardTypes ?? [], questionTotal: args.questionTotal ?? null, courseId: args.courseId ?? null, userId: args.userId ?? null, priorityLevel: args.priorityLevel ?? null }
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

export const apiGetStatisticCardsDoneByLevel = async (args: { userId: string, topicId?: string, studyScoreDataId?: string, courseId?: string }): Promise<Array<StatisticCart>> => {
  const { data, error } = await post({ endpoint: "/api/get-statistic-cards-done-by-level", body: args });
  return error ? [] : data;
}

export const apiGetStatisticCardsDoneByTagId = async (args: { userId: string, topicId?: string, studyScoreDataId?: string, courseId?: string }): Promise<Array<StatisticCart>> => {
  const { data, error } = await post({ endpoint: "/api/get-statistic-cards-done-by-tagid", body: args });
  return error ? [] : data;
}

export const apiGetNumTagCardByTopicId = async (args: { topicId: string }): Promise<Array<{ _id: string, count: number }>> => {
  const { data, error } = await post({ endpoint: "/api-cms/count-tags-by-topic-id", body: args });
  return error ? [] : data;
}

export const apiGetListTopicExerciseByTagIds = async (args: { tagIds: string[] }): Promise<Array<StatisticTag>> => {
  const { data, error } = await post({ endpoint: "/api-cms/get-list-topic-exercise-by-tagIds", body: args });
  return error ? [] : data;
}

// export const apiUpdateCardProgress = async (args: { }) => {

// }
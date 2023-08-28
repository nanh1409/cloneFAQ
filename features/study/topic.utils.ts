import localforage from "localforage";
import { CARD_HAS_CHILD } from "../../modules/share/constraint";
import { Card } from "../../modules/share/model/card";
import { apiOffsetTopicsByParentId } from "./topic.api";
import { MapTopicProgress, TopicItem } from "./topic.slice";

export const getRelaTopicList = async (topic: TopicItem, serverSide = true, topicTypes?: number[]) => {
  const topics = await apiOffsetTopicsByParentId({
    courseId: topic.courseId,
    parentId: topic.parentId,
    topicTypes,
    topicFields: [
      "_id",
      "childType",
      "type",
      "status",
      "videoUrl",
      "courseId",
      "name",
      "shortDescription",
      "slug",
      "orderIndex",
      "parentId",
      "paths",
      "accessLevel"
    ],
    exerciseFields: ["contentType", "questionsNum", "duration", "topicSettingId", "pass", "contentType", "baremScore", "shuffleQuestion"],
    field: "orderIndex",
    asc: true,
    serverSide
  });
  return topics;
}

export const getRelaProgress = (args: {
  list: TopicItem[]; topicProgresses: MapTopicProgress; item: TopicItem; userId: string;
}) => {
  const { list, topicProgresses, item, userId } = args;
  const relaList = list.filter((e) => e._id !== item._id);
  const progressTotal = relaList.reduce((total, topic) => {
    const topicProgress = topicProgresses[topic._id];
    const progressNum = topicProgress?.userId === userId ? (topicProgress?.progress ?? 0) : 0;
    // const progressNum = topicProgress ? (topicProgress?.progress ?? 0) : 0;
    total += progressNum;
    return total;
  }, 0);
  return progressTotal;
}

export const sortCards = (cards: Card[]) => {
  const sortedCards = [...cards].sort((a, b) =>
    a.orderIndex === b.orderIndex
      ? String(a._id).localeCompare(String(b._id))
      : a.orderIndex - b.orderIndex
  ).map((card) => {
    const _card = { ...card };
    if (card.hasChild === CARD_HAS_CHILD) {
      _card.childCards = sortCards(card.childCards ?? []);
    }
    return _card;
  });
  return sortedCards;
}

export const LocalGameTimeUtils = {
  key: "GameTime",
  get(args: { topicId: string; skillId?: string; userId: string; }) {
    const { topicId, skillId, userId } = args;
    const _data = localStorage.getItem(`${LocalGameTimeUtils.key}_${topicId}${skillId ? `_${skillId}` : ""}`);
    if (!_data) return null;
    try {
      const data: { userId: string; second: number; } = JSON.parse(_data);
      if (!data) return null;
      return data?.userId === userId ? (data?.second ?? null) : null;
    } catch (error) {
      return null;
    }
  },
  set(args: { topicId: string; skillId?: string; second: number; userId: string; }) {
    const { topicId, skillId, userId, second } = args;
    localStorage.setItem(`${LocalGameTimeUtils.key}_${topicId}${skillId ? `_${skillId}` : ""}`, JSON.stringify({
      userId,
      second
    }));
  },
  clear(args: { topicId: string; skillId?: string; }) {
    const { topicId, skillId } = args;
    localStorage.removeItem(`${LocalGameTimeUtils.key}_${topicId}${skillId ? `_${skillId}` : ""}`)
  }
}
  
export const gameLocalStore = localforage.createInstance({
  name: "koolsoft-elearning",
  storeName: "redux-persist"
});
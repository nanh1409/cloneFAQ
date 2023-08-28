import { Card } from "../../modules/share/model/card";
import { getEndpoint, post } from "../../utils/fetcher";

export const apiGetQuestionById = async (cardId: string, local?: boolean): Promise<Card> => {
  const { data, error } = await post({ endpoint: getEndpoint("/api/get-card-by-ids", local), body: { cardIds: [cardId] } });
  return error ? null : Array.isArray(data) ? (data[0] || null) : null;
}

export const apiGetQuestionByParentId = async (parentId: string, local?: boolean): Promise<Card[]> => {
  const { data, error } = await post({ endpoint: getEndpoint("/api/get-card-by-topic-id", local), body: { topicId: parentId } });
  return error ? [] : data;
}
import TopicHistory from "../../modules/share/model/topicHistory";
import { get, post } from "../../utils/fetcher";

export const apiCollectTopicHistory = async (args: Omit<TopicHistory, "_id">): Promise<TopicHistory> => {
  const { data } = await post({ endpoint: "/api/topic-histories/collect", body: args });
  return data;
}

export const apiGetLastTopicHistory = async (args: { account: string; topicId: string }): Promise<TopicHistory | null> => {
  const { data, error } = await get({ endpoint: "/api/topic-histories/lastest", params: args });
  return error ? null : data;
};
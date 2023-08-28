import Topic from "../../modules/share/model/topic";

type _FAQTopic = Pick<Topic, "_id" | "name">;

export type FAQTopic = _FAQTopic & {
  cards: Array<{
    question: string;
    answer: string;
  }>;
  childTopics?: Array<FAQTopic>
}

export const isFaqGroup = (appName: string) => {
  // TODO: GMAT ?
  return false;
}
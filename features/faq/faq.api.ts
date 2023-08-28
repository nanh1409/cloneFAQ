import { get } from "../../utils/fetcher"
import { FAQTopic } from "./faq.config";

export const apiGetAppFaqCourse = async (args: { courseId: string; isGroup: boolean }): Promise<Array<FAQTopic>> => {
  const { data, error } = await get({ endpoint: "/api/app-faq-course", params: args });
  return error ? [] : data;
}
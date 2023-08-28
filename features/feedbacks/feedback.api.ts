import Feedback from "../../modules/share/model/feedback"
import { post } from "../../utils/fetcher"

export type CreateFeedbackParams = Partial<Omit<Feedback, "_id">>;

export const apiSendFeedback = async (args: CreateFeedbackParams): Promise<Feedback> => {
  const { data, error } = await post({ endpoint: "/api/create-feedback", body: args });
  return error ? null : data;
}
import Discussion from "../../modules/share/model/discussion";
import { UserInfo } from "../../modules/share/model/user";
import { post } from "../../utils/fetcher";
import { ClientComment } from "./comment.model";

export const apiCreateComment = async (args: {
  userId: string; content: string; courseId?: string; topicId?: string; parentId?: string; user?: UserInfo; useFirebase?: boolean;
  href?: string;
  token: string;
}): Promise<ClientComment> => {
  const { useFirebase = false, token, ...rest } = args;
  const { data, error } = await post({ endpoint: "/api/discussion/create-comment", body: { useFirebase, ...rest }, customHeaders: { "x-access-token": token } });
  return error ? null : new ClientComment(data);
}

export const apiSeekCommentsByParent = async (args: { parentId: string; limit?: number; lastRecord?: Discussion }): Promise<ClientComment[]> => {
  const { data, error } = await post({ endpoint: "/api/discussion/seek-discussions-by-parent", body: { ...args, asc: true } });
  return error ? [] : data;
}

export const apiSeekCommentsByTopic = async (args: { topicId: string; limit?: number; childrenLimit?: number; lastRecord?: Discussion; useFirebase?: boolean }): Promise<{ total: number; comments: ClientComment[] }> => {
  const { data, error } = await post({ endpoint: "/api/discussion/seek-and-count-comments-by-topic", body: args });
  return error ? [] : data;
}

export const apiResetFirebaseStore = async (userId: string) => {
  const { data, error } = await post({ endpoint: "/api/discussion/reset-firebase-store", body: { userId } });
  return error ? [] : data;
}

export const apiLikeComment = async (args: { commentId: string; userId: string; like: boolean }): Promise<string[]> => {
  const { data, error } = await post({ endpoint: "/api/discussion/like", body: args });
  return error ? [] : data;
}

export interface ApiUpdateCommentContentArgs {
  _id: string;
  content?: string;
  imageUrl?: string;
  sourceUrl?: string;
}
export const apiUpdateCommentContent = async (args: ApiUpdateCommentContentArgs & { token: string; }): Promise<Discussion> => {
  const { token, ...payload } = args;
  const { data, error } = await post({ endpoint: "/api/discussion/update-discussion-content", body: payload, customHeaders: { "x-access-token": token } })
  return error ? null : data;
}

export const apiDelComment = (id: string, token: string) => {
  return post({ endpoint: "/api/discussion/delete", body: { _id: id }, customHeaders: { "x-access-token": token } })
}
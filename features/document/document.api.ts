import Document from "../../modules/share/model/document";
import { get, getEndpoint } from "../../utils/fetcher";

export const apiGetDocumentByCourseAndSlug = async (args: {
  courseId: string;
  slug: string;
  local?: boolean
}): Promise<Document | null> => {
  const { local, ...payload } = args;
  const { data, error } = await get({ endpoint: getEndpoint("/api/documents", local), params: {
    type: "get-document-by-course-and-slug",
    ...payload
  }});
  return error || !Array.isArray(data) ? null : data[0];
}
import { getEndpoint, post } from "../fetcher";

export const apiLoadCourseDetail = async (courseId: string, local = true): Promise<any> => {
  const { data, error } = await post({ endpoint: getEndpoint("/api-cms/load-course-detail", local), body: { courseId } });
  return error ? null : data;
}
import { DMVSubject } from "./appPracticeTypes";

export type SubjectData = {
  name: string;
  /**
   * **no leading slash**
   */
  slug: string;
  avatar?: string;
  dataSlug?: string;
  key?: DMVSubject;
  childSubjects: Array<{
    name: string;
    fullName: string;
    slug: string;
  }>
}
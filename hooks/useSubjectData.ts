const appName = process.env.NEXT_PUBLIC_APP_NAME;
import subjectData from "../config/subject.json";
import { SubjectData } from "../types/SubjectData";

const useSubjectData = () => {
  return (subjectData[appName] || []) as Array<SubjectData>;
}

export default useSubjectData;

import fs from "fs";
import path from "path";
import { SubjectData } from "../types/SubjectData";

const useServerSubjectData = (appName: string): Array<SubjectData> => {
  return JSON.parse(fs.readFileSync(path.join(
    process.cwd(),
    "config",
    "subject.json"
  )) as any || {})[appName] ?? [];
}
export default useServerSubjectData;
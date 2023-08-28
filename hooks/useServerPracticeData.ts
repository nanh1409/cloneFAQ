import fs from "fs";
import path from "path";
import { PracticeDataConfig } from "../types/appPracticeTypes";
const useServerPracticeData = (appName: string): PracticeDataConfig => {
  return JSON.parse(fs.readFileSync(path.join(
    process.cwd(),
    "config",
    "practice-data.json"
  )) as any || {})[appName] ?? {}
}

export default useServerPracticeData;
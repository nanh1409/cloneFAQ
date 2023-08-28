import practiceData from "../config/practice-data.json";
import { PracticeDataConfig } from "../types/appPracticeTypes";
const appName = process.env.NEXT_PUBLIC_APP_NAME;

const usePracticeData = (_appName?: string) => {
  return (practiceData[_appName || appName] || {}) as PracticeDataConfig;
}

export default usePracticeData;
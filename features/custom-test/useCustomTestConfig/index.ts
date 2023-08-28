import config from "./customTestConfigs.json";

const appName = process.env.NEXT_PUBLIC_APP_NAME;

export interface CustomTestConfig {
  duration: number;
  questionsNum: number;
  pass: number;
  courseIndex: number;
  sampleSlugs: string[]
}

const useCustomTestConfig = (): CustomTestConfig => {
  return config[appName] || {};
}

export default useCustomTestConfig;
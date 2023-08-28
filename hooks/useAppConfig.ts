import appConfigs from "../config/appConfigs.json";
const appName = process.env.NEXT_PUBLIC_APP_NAME;
const testMode = ["true", "false"].includes(process.env.NEXT_PUBLIC_TEST_MODE) ? !!JSON.parse(process.env.NEXT_PUBLIC_TEST_MODE) : false;
const useSlideHeroSection = ["true", "false"].includes(process.env.NEXT_PUBLIC_USE_SLIDE_HERO_SECTION) ? !!JSON.parse(process.env.NEXT_PUBLIC_USE_SLIDE_HERO_SECTION) : false
const useFirebase = ["true", "false"].includes(process.env.NEXT_PUBLIC_USE_FIREBASE) ? !!JSON.parse(process.env.NEXT_PUBLIC_USE_FIREBASE) : false;
const disableComment = ["true", "false"].includes(process.env.NEXT_PUBLIC_DISABLE_COMMENT) ? !!JSON.parse(process.env.NEXT_PUBLIC_DISABLE_COMMENT) : false;

export type OnClickFunction =
  "select-state" |
  "scroll" |
  "cdl-manual-book" |
  "dmv-manual-book" |
  "study-plan"

export interface AppMenu {
  name: string;
  slug: string;
  locale?: string;
  type?: string;
  childs?: Array<AppMenu>;
  dynamic?: boolean;
  onClickFunction?: OnClickFunction;
  newFeature?: boolean;
}

export type PracticeViewType =
  "default" |
  "page" |
  "subject"

export interface AppConfig {
  ua?: string;
  ga?: string;
  gtm?: string;
  uiVersion?: number;
  appTitlePostfix?: string;
  appSubtitle?: string;
  userLearningFeature?: boolean;
  facebookId: number;
  facebookAppId?: number;
  multiLocales: boolean;
  testSlug: string;
  license?: string;
  menu: Array<AppMenu>;
  social: Array<{
    name: string;
    link: string;
  }>;
  practiceViewType: PracticeViewType;
  mathJax?: boolean;
  enableChildGameAds?: boolean;
  hasState?: boolean;
  testMode?: boolean;
  logoFeature?: string[];
  useAds?: boolean;
  useSlideHeroSection?: boolean;
  useTrademark?: boolean;
  useFirebase?: boolean;
  disableComment?: boolean;
}

const useAppConfig = (): AppConfig & {
  appName: string;
  enableSEOStudyPage: boolean;
} => {
  let practiceViewType: PracticeViewType = "default";
  if (["toeic, ielts"].includes(appName)) practiceViewType = "page";
  else if (["ged", "alevel"].includes(appName)) practiceViewType = "subject";
  return {
    ...((appConfigs[appName] || {}) as AppConfig),
    practiceViewType,
    appName,
    enableSEOStudyPage: [
      "asvab",
      "cscs",
      "nclex"
    ].includes(appName),
    hasState: ["cdl", "dmv"].includes(appName),
    testMode,
    useSlideHeroSection,
    useFirebase,
    disableComment
  }
}

export default useAppConfig;
import useAppConfig from "../../../hooks/useAppConfig";

export type GoogleAdseneConfig = {
  client: string;
  slot: {
    [adsName: string]: {
      data: "string",
      shape?: "horizontal" | "square" | "vertical"
    }
  }
}

export const googleCommonAdsNames = [
  "The_Medium_Rectangle",
  "Half_Page_or_Large_Skyscraper",
  "The_Leaderboard",
  "Wide_Skyscraper"
] as const;

export type GoogleCommonAdsName = typeof googleCommonAdsNames[number];

export const googleAdsNames = [
  "PracticeHomeBannerAds",
  "TestBannerAds",
  "TopGameAds",
  "GameAds",
  "ListTopicsAds",
  "ReviewGameAds",
  "ReviewBannerAds"
] as const;

export type _GoogleAdsName = typeof googleAdsNames[number];
export type GoogleAdsName = _GoogleAdsName | GoogleCommonAdsName;

export const getGoogleAdsClient = () => {
  const { appName } = useAppConfig();
  if ([
    "cscs",
    "ged",
    "toeic",
    "asvab",
    "ielts"
  ].includes(appName)) {
    return "ca-pub-2966340675066013"
  }
  return "";
}

export const CommonAdsSlot: {
  [client: string]: Partial<Record<GoogleCommonAdsName, string>>;
} = {
  "ca-pub-2966340675066013": {
    The_Medium_Rectangle: "4509551724",
    Half_Page_or_Large_Skyscraper: "2045387522",
    The_Leaderboard: "3713692411",
    Wide_Skyscraper: "4936054997"
  }
}

export const AppAdsSlot: {
  [appName: string]: Partial<Record<_GoogleAdsName, {
    data: string;
    shape?: "horizontal" | "square" | "vertical"
  }>>
} = {
  cscs: {
    PracticeHomeBannerAds: { data: "5695285749", shape: "horizontal" },
    TestBannerAds: { data: "5092650510", shape: "horizontal" },
    TopGameAds: { data: "4675763839", shape: "horizontal" },
    GameAds: { data: "7468696132", shape: "horizontal" },
    ListTopicsAds: { data: "6610910034", shape: "square" },
    ReviewGameAds: { data: "9689048255", shape: "square" },
    ReviewBannerAds: { data: "2077257322", shape: "vertical" }
  },
  toeic: {
    PracticeHomeBannerAds: { data: "5330563476", shape: "square" },
    TestBannerAds: { data: "1008175082", shape: "square" },
    TopGameAds: { data: "4755848407", shape: "horizontal" },
    GameAds: { data: "6476323873", shape: "horizontal" },
    ListTopicsAds: { data: "6794457450", shape: "square" },
    ReviewGameAds: { data: "4089833683", shape: "square" }
  },
  ged: {
    ListTopicsAds: { data: "5830928797", shape: "square" },
    TopGameAds: { data: "8676583986", shape: "horizontal" },
    GameAds: { data: "9578440416", shape: "horizontal" },
    ReviewGameAds: { data: "6760867080", shape: "square" },
    ReviewBannerAds: { data: "9327158970", shape: "vertical" }
  },
  asvab: {
    ListTopicsAds: { data: "5830928797", shape: "square" },
    TopGameAds: { data: "8676583986", shape: "horizontal" },
    GameAds: { data: "9578440416", shape: "horizontal" },
    ReviewGameAds: { data: "6760867080", shape: "square" }
  },
  ielts: {
    TopGameAds: { data: "4755848407", shape: "horizontal" },
    GameAds: { data: "6476323873", shape: "horizontal" },
    ListTopicsAds: { data: "6794457450", shape: "square" },
    ReviewGameAds: { data: "4089833683", shape: "square" }
  }
}
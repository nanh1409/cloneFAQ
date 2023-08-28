import moment from "moment";
import { ROUTER_GET_PRO } from "../../../app/router";
import useAppConfig from "../../../hooks/useAppConfig";

export type ThirdPartyAdsType =
  "300x250" | "300x600" | "728x90" | "160x600" | "hero-section" | "hero-section-mobile";

export const mapThirdPartyAdsTypeHeight: Partial<Record<ThirdPartyAdsType, number>> = {
  "160x600": 600,
  "300x250": 250,
  "300x600": 600,
  "728x90": 90,
  "hero-section": 750,
  "hero-section-mobile": 864,
}

export type AdsScenario = {
  maxShowTimes: number;
  maxIdleDays: number;

  hidePeriod: {
    value: number;
    unit: moment.unitOfTime.DurationConstructor;
  },
}

export type AdsScenarioData = {
  // lastDisplay: number;
  displayTime: number;
  isDisplaying: boolean;
  lastClick?: number;
  displayDates: Array<number>;
}

export type ThirdPartyAdsData = {
  url: string;
  images?: Partial<Record<ThirdPartyAdsType, string>>;
  localeImages?: Partial<Record<ThirdPartyAdsType, Record<string, string>>>;
  scenario?: AdsScenario;
  allowedLocale?: Array<string>;
  target?: "_blank" | "_self";
  scenarioByUser?: boolean;
  isSlideItemHeroSection?: boolean;
}

const thirdPartyAdsNames = [
  "ngoaingu24h",
  "hocthongminh",
  "getpro-toeic",
  "onthisinhvien"
] as const;

export type ThirdPartyAdsNames = typeof thirdPartyAdsNames[number];

export const thirdPartyAds: Partial<Record<ThirdPartyAdsNames, ThirdPartyAdsData>> = {
  ngoaingu24h: {
    url: `https://ngoaingu24h.vn/luyen-thi-toeic-cap-toc?sharing=${process.env.NEXT_PUBLIC_ADS_SHARING_SRC || "test"}`,
    images: {
      "160x600": "/images/advertisement/third-party/nn24h_wide_skyscraper.gif",
      "300x600": "/images/advertisement/third-party/nn24h_skyscraper.gif",
      "300x250": "/images/advertisement/third-party/nn24h_medium_rect.gif",
      "728x90": "/images/advertisement/third-party/nn24h_leaderboard.gif"
    },
    scenario: {
      maxIdleDays: 3,
      hidePeriod: { value: 1, unit: "week" },
      maxShowTimes: 3
    },
    allowedLocale: ["VN"]
  },
  hocthongminh: {
    url: "https://hocthongminh.com",
    images: {
      "728x90": "/images/advertisement/third-party/htm_leaderboard.gif"
    }
  },
  "getpro-toeic": {
    url: `/${ROUTER_GET_PRO}?from=banner`,
    localeImages: {
      "300x250": {
        "en": "/images/get-pro/toeic/advertisement/rect.png",
        "vi": "/images/get-pro/toeic/advertisement/rect_vi.png"
      },
      "728x90": {
        "en": "/images/get-pro/toeic/advertisement/leaderboard.png",
        "vi": "/images/get-pro/toeic/advertisement/leaderboard_vi.png"
      }
    },
    target: "_self",
    scenario: {
      maxIdleDays: 3,
      hidePeriod: { value: 1, unit: "week" },
      maxShowTimes: 3
    },
    scenarioByUser: true
  },
  onthisinhvien: {
    url: `https://onthisinhvien.com?utm_medium=affiliate&utm_source=${process.env.NEXT_PUBLIC_ADS_SHARING_SRC || "test"}&utm_campaign=affiliate_onthisinhvien&utm_id=affiliate_onthisinhvien`,
    images: {
      "hero-section": "/images/advertisement/third-party/onthisinhvien_hero_section.png",
      "hero-section-mobile": "/images/advertisement/third-party/onthisinhvien_hero_section_mob.png"
    }
  }
}

export const isThirdPartyAdsLocaleCheckRequired = () => {
  const { appName } = useAppConfig();
  return [
    "toeic"
  ].includes(appName);
}

import useAppConfig from "../../hooks/useAppConfig";
import getProConfigs from "../../config/get-pro.json";
import { MapLocaleString } from "../../types/appPracticeTypes";
import { ReactNode } from "react";

export type PlanFeatures = Array<string | boolean>;

export type MapLocalePlanFeatures = {
  [locale: string]: PlanFeatures;
}

export type IntroFeature = {
  title: MapLocaleString, 
  des: MapLocaleString,
  image: string,
  alt: string,
  backgroundColor: string,
  height: number,
  positionImg: Partial<Record<"left" | "right" | "bottom" | "top", string>>,
  colorText?: string,
  colorDes?: string,
  style?: {[locale: string]: Record<"pc" | "tablet" | "mobile", React.CSSProperties>},
  styleImg: {[locale: string]: Record<"pc" | "tablet" | "mobile" | "lg" | "md", React.CSSProperties>}
}

export type SubscriptionType =
  "3-month" | "6-month" | "1-year";

export type GetProConfig = {
  title: string;
  content: {
    [locale: string] : {
      h2Audience: string,
      h2IntroFeature: string,
      h2ChooseUs: string,
      h2Review: string,
      marginBottom: string,
      subTitleReview: string,
      h2Plan: string,
      subTitlePlan: string,
      contentFree: string,
      contentPremium: string,
    }
  };
  features: PlanFeatures | MapLocalePlanFeatures;
  primaryPlanIndex: number;
  plan: {
    [accessLevel: number]: {
      name: string;
      localeNames?: MapLocaleString,
      features: PlanFeatures | MapLocalePlanFeatures;
      totalPrice?: Record<SubscriptionType, {
        price: string;
        primary: boolean;
      }>;
      subTitle: MapLocaleString
    }
  };
  vnpay: boolean;
  contentHeroSection: {
    title: MapLocaleString, 
    name: string, 
    summary: MapLocaleString
  }, 
  audiences: Array<{
    locale: string,
    icon: string,
    title: string,
    des: string,
    alt: string
  }>,
  boostSkillContent: {
    title: MapLocaleString, 
    image: string, 
    des: MapLocaleString
  }, 
  introFeatures: Array<IntroFeature>,
  countUp: Array<{
    number: number,
    title: MapLocaleString,
    color?: string,
    prefix?: MapLocaleString;
  }>
}

export default function useGetProConfig() {
  const { appName } = useAppConfig();
  const config: GetProConfig = getProConfigs[appName];
  return config;
}

export type SelectedPlanData = {
  subsType: string;
  planName: string;
  price: {
    [locale: string]: ReactNode;
  }
}
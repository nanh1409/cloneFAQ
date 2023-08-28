import { PricingPlan } from "../modules/share/model/pricingPlan"

export type UserPricingPlan = PricingPlan & {
  appName: string;
  expireDate: number;
  isExpired: boolean
}
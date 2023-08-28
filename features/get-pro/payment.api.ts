import { PAYMENT_PAYPAL } from "../../modules/share/constraint";
import AppTransaction from "../../modules/share/model/appTransaction";
import Order from "../../modules/share/model/order";
import { PricingPlan } from "../../modules/share/model/pricingPlan";
import { UserPricingPlan } from "../../types/UserPricingPlan";
import { get, getEndpoint, post } from "../../utils/fetcher";

export const apiGetUserSubscriptions = async (args: { token: string; appName?: string; }): Promise<Array<UserPricingPlan>> => {
  const { token, appName } = args;
  const { data, error } = await get({
    endpoint: "/api/user-subscriptions", params: { appName }, customHeaders: { "x-access-token": token }
  });
  return error ? [] : data;
}

export const apiGetUserSubscriptionByApp = async (args: { token: string; appName: string }): Promise<UserPricingPlan | null> => {
  const { token, appName } = args;
  const { data, error } = await get({
    endpoint: `/api/user-subscriptions/${appName}`, customHeaders: { "x-access-token": token }
  });
  return error ? null : data;
}

export const apiGetAppPlans = async (args: { appId: string, serverSide?: boolean; }): Promise<PricingPlan> => {
  const { appId, serverSide } = args;
  const { data, error } = await get({ endpoint: getEndpoint("/api/pricing-plans", serverSide), params: { appId } });
  return error ? [] : data;
}


export type CreateUserPlanOrderArgs = {
  token: string;
  planId: string;
  serial?: string;
  content?: string;
  paymentMethod?: number;
  email?: string;
  checkSum?: string;
  returnUrl?: string;
  affiliateCode?: string;
}
export type CreatePlanOrderErrorResponse = { error: boolean; data?: any };
export type CreatePlanOrderResponse = { id: string }
| string
| Order
| CreatePlanOrderErrorResponse
export const apiCreateUserPlanOrder = async (args: CreateUserPlanOrderArgs): Promise<CreatePlanOrderResponse> => {
  const { token, paymentMethod = PAYMENT_PAYPAL, ...payload } = args;
  const { data, error } = await post({
    endpoint: "/api/pricing-plans/checkout", body: {
      ...payload,
      paymentMethod
    }, customHeaders: { "x-access-token": token }
  });
  return error
    ? (paymentMethod === PAYMENT_PAYPAL
      ? { id: "" }
      : "")
    : data;
}

export const apiCapturePayPalPayment = async (args: { paymentId: string; status: number; }): Promise<{
  paymentId: string;
  returnStatus: string;
  orderId: string;
  orderTime: string;
  amount: number;
  appTransaction: AppTransaction | null;
  serial?: string;
}> => {
  const { paymentId, status } = args;
  const { data, error } = await post({ endpoint: `/api/paypal/checkout/${paymentId}/capture`, body: { status } });
  return error ? null : data;
}

export const apiGetPricingPlanById = async (planId: string): Promise<PricingPlan | null> => {
  const { data, error } = await get({ endpoint: `/api/pricing-plans/${planId}` });
  return error ? null : data;
}
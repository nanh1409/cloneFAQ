import { CreateUserPlanOrderArgs } from "./payment.api";
import CryptoJS from "crypto-js";
import { KEY_ORDER_SECRET } from "../../modules/share/constraint";

export function genOrderCheckSum(
  args: Partial<Pick<CreateUserPlanOrderArgs, "planId" | "paymentMethod" | "serial" | "content" | "email" | "affiliateCode">>
) {
  const orderPayload = Object.keys(args).sort().reduce((obj, key) => (obj[key] = args[key], obj), {});
  const checkSum = CryptoJS.SHA256(`${JSON.stringify(orderPayload)}_${KEY_ORDER_SECRET}_${args.serial}`).toString();
  return checkSum;
}
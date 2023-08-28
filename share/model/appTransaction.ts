import { isObject } from "../utils";
import { PricingPlan } from "./pricingPlan";

export interface IAppTransaction {
  _id?: any;
  userId?: any;
  planId?: any;
  inAppPurchaseId: any;
  startDate?: number;
  expriedDate?: number;
}

export default class AppTransaction implements IAppTransaction {
  _id: any;
  userId: any;
  planId: any;
  inAppPurchaseId: any;
  transactionId: any;
  status: number;
  source: string;
  startDate: number;
  expriedDate: number;
  createdAt?: Date;
  updatedAt?: Date;
  appName: string;
  deviceId: string;
  plan?: PricingPlan;
  private dbTransform(args: any = {}) {
    if (isObject(args.planId)) {
      this.planId = args.planId?._id ?? "";
      this.plan = new PricingPlan(args.planId);
    }
  }

  constructor(args: any = {}) {
    this._id = args._id;
    this.userId = args.userId;
    this.planId = args.planId;
    this.startDate = args.startDate;
    this.expriedDate = args.expriedDate;
    this.createdAt = args.createdAt;
    this.updatedAt = args.updatedAt;
    this.transactionId = args.transactionId;
    this.inAppPurchaseId = args.inAppPurchaseId;
    this.source = args.source;
    this.status = args.status;
    this.appName = args.appName;
    this.deviceId = args.deviceId;
    this.dbTransform(args);
  }
}
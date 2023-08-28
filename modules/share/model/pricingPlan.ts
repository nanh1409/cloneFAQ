export enum SubscriptionTimeUnit {
  DAY = "day",
  MONTH = "month",
  YEAR = "year"
}

export class PricingPlan {
  _id?: string;
  title: string;
  description: string;
  price: number;
  discountPrice: number;
  currencyCode: string;
  subscriptionTimeValue: number;
  subscriptionTimeUnit: SubscriptionTimeUnit;
  accessLevel: number;
  deletedAt: number | null;
  appId: string;
  appleCode: string; // de app khai bao voi apple example: com.estudyme.cscs.9.99
  googleCode: string;
  constructor(args: any = {}) {
    this._id = args._id;
    this.title = args.title;
    this.description = args.description;
    this.price = args.price;
    this.discountPrice = args.discountPrice;
    this.currencyCode = args.currencyCode;
    this.subscriptionTimeValue = args.subscriptionTimeValue;
    this.subscriptionTimeUnit = args.subscriptionTimeUnit;
    this.accessLevel = args.accessLevel;
    this.deletedAt = args.deletedAt;
    this.appId = args.appId;
    this.googleCode = args.googleCode;
    this.appleCode = args.appleCode;
  }
}

export class UserPricingPlan extends PricingPlan {
  appName: string;
  expireDate: number;
  isExpired: boolean;
}
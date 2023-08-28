import { COUPON_DISCOUNT_UNIT_CURRENCY } from "../constraint";

export default class Coupon {
  _id: string | undefined;
  code: string;
  discount: number;
  /**
   * COUPON_DISCOUNT_UNIT_CURRENCY (VND) - 0, COUPON_DISCOUNT_UNIT_PERCENT (%) - 1
   */
  discountUnit: number;
  /**
   * <= 0: Unlimited
   */
  totalUses: number;
  /**
   * 0: Unlimited
   */
  expiredAt: number;
  /**
   * Time to active the coupon; <= 0: Immediately active
   */
  activeAt: number;
  description: string;
  isDeleted: boolean;
  userIds?: string[];
  orderTypes?: number[]

  constructor(args: any = {}) {
    this._id = args._id ?? undefined;
    this.code = args.code ?? '';
    this.discount = args.discount ?? 0;
    this.discountUnit = args.discountUnit ?? COUPON_DISCOUNT_UNIT_CURRENCY;
    this.totalUses = args.totalUses ?? 0;
    this.expiredAt = args.expiredAt ?? 0;
    this.activeAt = args.activeAt ?? 0;
    this.description = args.description ?? '';
    this.isDeleted = args.isDeleted ?? false;
    this.userIds = args.userIds ?? [];
    this.orderTypes = args.orderTypes ?? [];
  }
}
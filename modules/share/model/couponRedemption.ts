export default class CouponRedemtion {
  _id: string | undefined;
  couponId: string | null;
  orderId: string | null;
  userId: string | null;
  redemptionDate: number;

  constructor(args: any = {}) {
    this._id = args?._id ?? undefined;
    this.couponId = args?.couponId?._id ?? (args?.couponId ?? null);
    this.orderId = args?.orderId?._id ?? (args?.orderId ?? null);
    this.userId = args?.userId?._id ?? (args?.userId ?? null);
    this.redemptionDate = args?.redemptionDate ?? 0;
  }
}
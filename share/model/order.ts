import Code from './code';
import { IOrderComboBase } from './orderCombo';
import { UserInfo } from './user';
export interface IOrder {
    _id?: any,
    userId: any,
    codeId: Code | any,
    serial: string,
    userName?: string,
    email?: string,
    address?: string,
    phone?: string,
    bank?: string,
    content?: string,
    note?: string,
    paymentId?: string,
    signId?: string,
    paymentType?: number,
    paymentStatus?: number,
    status: number,
    createDate: number,
    lastUpdate: number,
    price: number,
    discount: number,
    type: number,
    orderCombo?: IOrderComboBase[],
    courseIds?: any[],
    categories?: any[];
    listCouponIds?: string[];
    currencyCode?: string;
    appId?: string;
    affiliateCode?: string;
}
class Order implements IOrder {
    _id?: any;
    userId: string;
    codeId: Code | any;
    serial: string;
    userName: string;
    email: string;
    address: string;
    phone: string;
    bank: string;
    content: string;
    note: string;
    paymentId: string;
    signId: string;
    paymentType: number;
    paymentStatus: number;
    status: number;
    createDate: number;
    lastUpdate: number;
    price: number;
    discount: number;
    type: number;
    orderCombo: IOrderComboBase[] | undefined;
    courseIds: any[];
    categories: any[];
    user: UserInfo | null;
    couponId: string;
    listCouponIds: string[];
    currencyCode?: string;
    appId?: string;
    affiliateCode?: string;
    constructor(args: any = {}) {
        this._id = args._id ?? undefined;
        this.address = args.address ?? '';
        this.bank = args.bank ?? '';
        this.codeId = args.codeId ?? null;
        this.content = args.content ?? '';
        this.createDate = args.createDate ?? 0;
        this.discount = args.discount ?? 0;
        this.email = args.email ?? '';
        this.lastUpdate = args.lastUpdate ?? 0;
        this.note = args.note ?? '';
        this.paymentId = args.paymentId ?? null;
        this.paymentStatus = args.paymentStatus ?? 0;
        this.paymentType = args.paymentType ?? 0;
        this.phone = args.phone ?? '';
        this.price = args.price ?? 0;
        this.serial = args.serial ?? '';
        this.signId = args.signId ?? null;
        this.status = args.status ?? 0;
        this.type = args.type ?? 0;
        this.userId = args.userId ?? null;
        this.userName = args.userName ?? '';
        this.orderCombo = args.orderCombo ?? [];
        this.courseIds = args.courseIds ?? [];
        this.categories = args.categories ?? [];
        this.couponId = args.couponId;
        this.listCouponIds = args?.listCouponIds ?? [];
        this.currencyCode = args.currencyCode;
        this.appId = args.appId;
        this.affiliateCode = args.affiliateCode;
    }

}

export default Order;

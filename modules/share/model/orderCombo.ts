import { ORDER_TYPE_MARK_ASSIGNMENT_RETAIL } from '../constraint';
import { isObject } from "../utils";
import { Course } from "./courses";
import MarkAssignmentCombo from "./markAssignmentCombo";

export interface IOrderComboBase {
    _id: any,
    orderId?: any,
    comboId?: any,
    courseIds?: Array<string>,
    comboName?: string,
    price?: number,
    discount?: number,
    type?: number,
    currencyCode?: string;
    classIds?: Array<string>,
    /**
     * Tính theo tháng
     */
    studyTime?: number;
    /**
     * 1: Acellus Academy
     * 2: PowerHome School
     */
    optionAccount?: number;
}

export class OrderCombo implements IOrderComboBase {
    _id: any;
    orderId?: any;
    comboId?: any;
    courseIds?: Array<string>;
    comboName?: string;
    price?: number;
    discount?: number;
    type?: number;
    currencyCode: string;
    classIds?: Array<string>;
    studyTime: number;
    optionAccount?: number;

    // POPULATE
    courses: Array<Course>;
    markAssignmentCombo?: MarkAssignmentCombo;
    constructor(args: any = {}) {
        this._id = args._id ?? undefined;
        this.orderId = args.orderId;
        this.comboId = args.comboId?._id ?? (args.comboId ?? null);
        this.courseIds = (args.courseIds ?? []).map((e: any) => e?._id ?? e);
        this.comboName = args.comboName;
        this.price = args.price;
        this.discount = args.discount;
        this.type = args.type;
        this.currencyCode = args.currencyCode;
        this.classIds = args.classIds ?? [];
        this.studyTime = args.studyTime ?? 0;
        this.optionAccount = args.optionAccount;

        if (args.courseIds && isObject(args.courseIds[0])) {
            this.courses = args.courseIds.map((e: any) => new Course(e));
        }

        if (args.type === ORDER_TYPE_MARK_ASSIGNMENT_RETAIL) {
            this.markAssignmentCombo = new MarkAssignmentCombo(args.comboId);
        }
    }
}

export default OrderCombo;




export interface IOrderCombo extends IOrderComboBase {

}
export interface IOrderComboRetail extends IOrderComboBase {

}
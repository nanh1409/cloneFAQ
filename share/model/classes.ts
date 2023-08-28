import { ClassType } from "../classes_manager_utils/config";
import { STATUS_PUBLIC } from "../constraint";
import { isObject } from "../utils";
import { UserInfo } from "./user";

export interface IClasses {
    _id?: string;
    startDate?: number;
    endDate?: number;
    status?: number;
    type?: number;
    price?: number;
    studyTime?: number;
    payTime?: number;
    name?: string;
    description?: string;
    avatar?: string
}
class Classes {
    _id: string | undefined;
    startDate: number;
    endDate: number;
    status: number;
    type: number;
    price: number;
    trialPrice: number;
    studyTime: number;
    payTime: number;
    name: string;
    code: string;
    password: string;
    courseIds: string[];
    avatar?: string;
    description?: string;
    maxMembers?: number;
    available?: number;
    level: number;
    levels: number[];
    dType: number;
    headTeacherId: string;
    studentIds: string[];
    headTeacher: UserInfo;
    isClub?: number;

    constructor(args: any = {}) {
        this._id = args._id?._id ?? (args._id ?? undefined)
        this.name = args.name?._id ?? (args.name ?? null)
        this.startDate = args.startDate ?? 0;
        this.endDate = args.endDate ?? 0;
        this.status = args.status ?? STATUS_PUBLIC;
        this.type = args.type ?? 0;
        this.price = args.price ?? 0;
        this.studyTime = args.studyTime ?? 0;
        this.payTime = args.payTime ?? 0;
        this.courseIds = args.courseIds ?? [];
        this.code = args.code ?? '';
        this.password = args.password ?? '';
        this.avatar = args.avatar ?? '';
        this.description = args.description ?? '';
        this.maxMembers = args.maxMembers ?? 0;
        this.available = args.available ?? 0;
        this.level = args.level ?? 0;
        this.dType = args.dType ?? ClassType.normal;
        this.levels = args.levels ?? [];
        this.headTeacherId = args.headTeacherId ?? null;
        this.studentIds = args.studentIds ?? [];
        this.trialPrice = args.trialPrice ?? (this.price / 2)
        this.isClub = args.isClub ?? 0;
        if (isObject(args.headTeacherId)) {
            this.headTeacher = new UserInfo(args.headTeacherId);
        }
    }
}
export { Classes };

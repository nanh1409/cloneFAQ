import { CodeActiveTypes, CODE_NOT_ACTIVE, TIME_STUDY } from "../constraint";

export interface ICode {
    _id?: any,
    userCreateId?: string | null,
    userBuyId?: string | null,
    courseId?: Array<string>,
    comboIds?: string[],
    categoriesId?: Array<string>,
    content?: string,
    serial?: string,
    price?: number,
    discount?: number,
    daysStudy?: number,
    activeType?: number,
    maxActiveNum?: number,
    createDate?: number,
    startTime?: number,
    endTime?: number,
    status?: number,
    lastUpdate?: number,
    quantities?: number
}

class Code implements ICode {
    _id?: any;
    userCreateId: string | null;
    userBuyId: string | null;
    courseId: string[] | undefined;
    categoriesId: string[];
    content: string;
    serial: string;
    price: number;
    discount: number;
    daysStudy: number;
    activeType: number;
    maxActiveNum: number;
    createDate: number;
    startTime: number;
    endTime: number;
    status: number;
    lastUpdate: number;
    quantities: number | undefined;

    constructor(args: ICode = {}) {
        this._id = args._id ?? undefined;
        this.userCreateId = args.userCreateId ?? null; 
        this.createDate = args.createDate ?? 0;
        this.status = args.status ?? CODE_NOT_ACTIVE;
        this.activeType = args.activeType ?? CodeActiveTypes.ALL;
        this.categoriesId = args.categoriesId ?? [];
        this.content = args.content ?? '';
        this.daysStudy = args.daysStudy ?? 0;
        this.discount = args.discount ?? 0;
        this.endTime = args.endTime ?? 0;
        this.lastUpdate = args.lastUpdate ?? 0;
        this.maxActiveNum = args.maxActiveNum ?? 1;
        this.price = args.price ?? 0;
        this.serial = args.serial ?? '';
        this.startTime = args.startTime ?? 0 ;
        this.userBuyId = args.userBuyId ?? null;
        this.courseId = args.courseId ?? [];
        this.quantities = args.quantities;
    }
}
export default Code;
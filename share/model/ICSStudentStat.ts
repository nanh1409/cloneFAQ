import { isObject } from "lodash";
import { STATUS_PUBLIC } from "../constraint";
import { Classes } from "./classes";
export interface AssignmentItemStat {
    news: number,
    done: number,
    pass: number,
    fail: number,
}
class ICSStudentStat {
    _id: string | undefined;
    userId: string | null;
    classesId: string | null;
    assignmentId: string | null;
    classes: Classes | null;
    date: number;
    month: number;
    year: number;
    status: number;
    stat: string;
    statInfo: Object
    constructor(args: any) {
        if (!args) {
            args = {}
        }
        this._id = args._id ?? undefined;
        this.assignmentId = args.assignmentId?._id ?? (args.assignmentId ?? null);
        this.classesId = args.classesId?._id ?? (args.classesId ?? null);
        this.userId = args.userId?._id ?? (args.userId ?? null);
        this.date = args.createdDate ?? new Date().getDate();
        this.month = args.lastUpdate ?? new Date().getMonth();
        this.year = args.year ?? new Date().getFullYear();
        this.status = args.status ?? STATUS_PUBLIC;
        this.stat = args.stat ?? JSON.stringify(new Map<number, AssignmentItemStat>());
        try {
            this.statInfo = args.statInfo ?? JSON.parse(this.stat)
        } catch (error) {

        }
        if (isObject(args.classesId)) {
            this.classes = new Classes(args.classesId);
        }
    }
}

export { ICSStudentStat }
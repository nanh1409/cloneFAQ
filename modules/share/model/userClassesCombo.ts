import { STATUS_PUBLIC } from "../constraint";
import { isObject } from "../utils";
import { ClassesCombo } from "./classesCombo";
import { UserInfo } from "./user";

class UserClassesCombo {
    _id: string | undefined;
    userId: string | null;
    classesIds: string[];
    comboId: string | null;
    user: UserInfo | null;
    combo: ClassesCombo | null;
    createdDate: number;
    lastUpdate: number;
    status: number;
    type: number;
    price: number;
    studyTime: number;
    constructor(args?: any) {
        if (!args) {
            args = {};
        }
        this._id = args._id ?? undefined;
        this.createdDate = args.createdDate ?? Date.now();
        this.lastUpdate = args.lastUpdate ?? Date.now();
        this.status = args.status ?? STATUS_PUBLIC;
        this.type = args.type ?? 0;
        this.price = args.price ?? 0;
        this.studyTime = args.studyTime ?? 0;
        this.userId = args.userId?._id ?? (args.userId ?? null);
        this.comboId = args.comboId?._id ?? (args.comboId ?? null);
        this.classesIds = args.classesIds ?? [];
        if (isObject(args.userId)) {
            this.user = new UserInfo(args.userId);
        }
        if (isObject(args.comboId)) {
            this.combo = new ClassesCombo(args.comboId);
        }
    }
}
export { UserClassesCombo }
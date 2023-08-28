import { STATUS_PUBLIC } from "../constraint";
import { isObject } from "../utils";

class ICSOrder {
    _id: string | undefined;
    orderId: string | null;
    department: number;
    acellus: number;
    powerHome: number;
    club: number;
    status: number;
    constructor(args?: any) {
        if (!args) {
            args = {}
        }
        this._id = args._id ?? undefined;
        this.orderId = args.orderId?._id ?? (args.orderId ?? null);
        this.department = args.department ?? -1;
        this.acellus = args.acellus ?? -1;
        this.powerHome = args.powerHome ?? -1;
        this.club = args.club ?? -1;
        this.status = args.status ?? STATUS_PUBLIC;
        if (isObject(args.orderId)) {
            // this.classes = new Classes(args.classesId);
        }
    }
}

export { ICSOrder }
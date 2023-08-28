import { STATUS_PUBLIC } from '../constraint';
import { isObject } from '../utils';
import { Classes } from "./classes";
import { Course } from "./courses";
import { UserInfo } from "./user";

class TeacherClasses {
    _id: string | undefined;
    classesId: string | null;
    userId: string | null;
    user: UserInfo | null;
    classes: Classes | null;
    joinDate: number;
    expriedDate: number;
    status: number;
    constructor(args: any = {}) {
        this._id = args._id?._id ?? (args._id ?? undefined);
        this.userId = args.userId?._id ?? (args.userId ?? null);
        this.classesId = args.classesId?._id ?? (args.classesId ?? null);
        this.joinDate = args.joinDate ?? 0;
        this.expriedDate = args.expriedDate ?? 0;
        this.status = args.status ?? STATUS_PUBLIC;
        if (isObject(args.userId)) {
            this.user = new UserInfo(args.userId);
        }
        if (isObject(args.classesId)) {
            this.classes = new Classes(args.classesId);
        }
        if (args.user) {
            this.user = new UserInfo(args.user)
        }
        if (args.classes) {
            this.classes = new Classes(args.classes)
        }
    }
}

export { TeacherClasses }

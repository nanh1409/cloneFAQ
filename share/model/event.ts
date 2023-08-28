import { STATUS_PUBLIC } from '../constraint';
import { isObject } from '../utils';
import { Classes } from "./classes";
import { UserInfo } from "./user";

class Event {
    _id: string | undefined;
    title: string;
    userId: string | null;
    classesId: string | null;
    startTime: number;
    endTime: number;
    status: number;
    user: UserInfo | null;
    classes: Classes | null;
    type: number;
    content: string;
    createdDate: number;
    constructor(args?: any) {
        if (!args) {
            args = {}
        }
        this._id = args._id ?? undefined;
        this.title = args.title ?? '';
        this.userId = args.userId?._id ?? (args.userId ?? null)
        this.classesId = args.classesId?._id ?? (args.classesId ?? null)
        this.startTime = args.startTime ?? 0;
        this.endTime = args.endTime ?? 0;
        this.createdDate = args.endTime ?? 0;
        this.type = args.type ?? 0;
        this.status = args.status ?? STATUS_PUBLIC;
        this.content = args.content ?? '';
        if (isObject(args.userId)) {
            this.user = new UserInfo(args.userId);
        }
        if (isObject(args.classesId)) {
            this.classes = new Classes(args.classesId)
        }
    }

}
export { Event };

import { isObject } from "../utils";
import { Assignment } from "./assignment";
import { Classes } from "./classes";
import { UserInfo } from "./user";

class AssignmentActivity {
    _id: string | undefined;
    userId: string;
    assignmentId: string | null;
    content: string;
    type: number;
    status: number;
    createDate: number;
    assignment: Assignment | null;
    user: UserInfo | null;
    classesId: string | null;
    classes: Classes | null;
    constructor(args?: any) {
        if (!args) {
            args = {}
        }
        this._id = args._id ?? undefined;
        this.userId = args.userId?._id ?? (args.userId ?? null);
        this.assignmentId = args.assignmentId?._id ?? (args.assignmentId ?? null);
        this.content = args.content ?? '';
        this.type = args.type ?? 0;
        this.status = args.status ?? 0;
        this.createDate = args.createDate ?? 0;
        this.classesId = args.classesId?._id ?? (args.classesId ?? null);
        if (isObject(args.userId)) {
            this.user = new UserInfo(args.userId);
        }
        if (isObject(args.assignmentId)) {
            this.assignment = new Assignment(args.assignmentId);
        }
        if (isObject(args.classesId)) {
            this.classes = new Classes(args.classesId);
        }
    }
}

export { AssignmentActivity }
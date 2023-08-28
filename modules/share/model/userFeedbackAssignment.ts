import { FeedbackType } from "../classes_manager_utils/config";
import { isObject } from "../utils";
import { UserInfo } from "./user";
import { UserAssignment } from "./userAssignment";

class UserFeedbackAssignment {
    _id: string | undefined;
    userId: string | null;
    userAssignmentId: string | null;
    content: string;
    time: number;
    status: number;
    user: UserInfo | null;
    userAssignment: UserAssignment | null;
    feedbackId: string | null;
    type: number;
    classesId: string;
    feedbacker: UserInfo | null;
    createdDate: number;
    lastUpdate: number;
    createAt: string;
    updateAt: string

    constructor(args: any = {}) {
        this._id = args._id ?? undefined;
        this.userId = args.userId?._id ?? (args.userId ?? null)
        this.userAssignmentId = args.userAssignmentId?._id ?? (args.userAssignmentId ?? null)
        this.content = args.content ?? '';
        this.status = args.status ?? 0;
        this.time = args.time ?? 0;
        if (isObject(args.userId)) {
            this.user = new UserInfo(args.userId);
        }
        if (isObject(args.userAssignmentId)) {
            this.userAssignment = new UserAssignment(args.userAssignmentId);
        }
        this.feedbackId = args.feedbackId ?? null;
        if (isObject(args.feedbackId)) {
            this.feedbacker = new UserInfo(args.feedbackId);
        }
        this.classesId = args.classesId ?? null;
        this.type = args.type ?? FeedbackType.normal;
        this.createdDate = args.createdDate ?? Date.now();
        this.lastUpdate = args.lastUpdate ?? Date.now();
    }
}
export { UserFeedbackAssignment }
import { ExcercisePassStatus } from '../classes_manager_utils/config';
import { isObject } from '../utils';
import { Assignment } from "./assignment";
import { Classes } from "./classes";
import { UserInfo } from "./user";

class UserAssignment {
    _id: string | undefined;
    classesId: string | null;
    userId: string | null;
    assignmentId: string | null;
    startTime: number;
    endTime: number;
    status: number;
    classes: Classes | null;
    user: UserInfo | null;
    assigment: Assignment | null;
    content: string;
    score: number;
    mcScore: number;
    essayScore: number;
    attachments: string[];
    createdDate: number;
    lastUpdate: number;
    checkin: number;
    checkout: number;
    teacherFeedback?: string;
    passStatus?: ExcercisePassStatus;
    reported: boolean;
    averageAssess: number | null;
    comment?: string;
    audios: string[];

    constructor(args: any = {}) {
        this._id = args._id ?? undefined;
        this.classesId = args.classesId?._id ?? (args.classesId ?? null);
        this.userId = args.userId?._id ?? (args.userId ?? null);
        this.assignmentId = args.assignmentId?._id ?? (args.assignmentId ?? null);
        this.startTime = args.startTime ?? 0;
        this.endTime = args.endTime ?? 0;
        this.status = args.status ?? 0;
        this.score = args.score ?? 0;
        this.mcScore = args.mcScore ?? 0;
        this.essayScore = args.essayScore ?? 0;
        this.attachments = args.attachments ?? [];
        this.content = args.content ?? '';
        this.createdDate = args.createdDate ?? Date.now();
        this.lastUpdate = args.lastUpdate ?? Date.now();
        this.checkin = args.checkin ?? 0;
        this.checkout = args.checkout ?? 0;
        this.teacherFeedback = args.teacherFeedback ?? '';
        this.passStatus = args.passStatus ?? ExcercisePassStatus.pass;
        this.reported = args.reported ?? false;
        this.comment = args.comment ?? '';
        this.audios = args.audios ?? [];
        if (isObject(args.classesId)) {
            this.classes = new Classes(args.classesId);
        } else if (args.classes) {
            this.classes = new Classes(args.classes);
        }
        if (isObject(args.userId)) {
            this.user = new UserInfo(args.userId);
        }
        if (isObject(args.assignmentId)) {
            this.assigment = new Assignment(args.assignmentId);
        } else if (args.assigment) {
            this.assigment = args.assigment;
        }
        if (this.teacherFeedback?.length ?? false) {
            try {
                this.averageAssess = 0;
                const tempMap = JSON.parse(this.teacherFeedback ?? "");
                Object.keys(tempMap).forEach((_item) => {
                    this.averageAssess! += parseInt(tempMap[_item]['score']);
                });
                this.averageAssess = this.averageAssess / Object.keys(tempMap).length;

            } catch (error) {

            }
        }
    }
    fromAssignment(_item: Assignment, userId: string): UserAssignment {
        this._id = undefined;
        this.userId = userId;
        this.assignmentId = _item._id!;
        this.classesId = _item.classesId;
        this.content = _item.content;
        this.startTime = _item.startTime;
        this.endTime = _item.endTime;
        this.createdDate = Date.now();
        this.lastUpdate = Date.now();
        this.status = 0;
        return this;
    }
}
export { UserAssignment }
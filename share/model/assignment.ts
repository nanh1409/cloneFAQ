import moment from 'moment';
import { STATUS_PUBLIC } from '../constraint';
import { isObject } from '../utils';
import { Classes } from "./classes";
import { Course } from "./courses";
import Topic from "./topic";
import { UserInfo } from "./user";

class Assignment {
    _id: string | undefined;
    title: string;
    teacherId: string | null;
    courseId: string | null;
    topicId: string | null;
    classesId: string | null;
    startTime: number;
    endTime: number;
    status: number;
    teacher: UserInfo | null;
    course: Course | null;
    topic: Topic | null;
    classes: Classes | null;
    type: number;
    content: string;
    acceptEditTime: number;
    attachments: string[]
    constructor(args?: any) {
        if (!args) {
            args = {}
        }
        this._id = args._id ?? undefined;
        this.title = args.title ?? '';
        this.teacherId = args.teacherId?._id ?? (args.teacherId ?? null)
        this.courseId = args.courseId?._id ?? (args.courseId ?? null)
        this.topicId = args.topicId?._id ?? (args.topicId ?? null)
        this.classesId = args.classesId?._id ?? (args.classesId ?? null)
        this.startTime = args.startTime ?? 0;
        this.endTime = args.endTime ?? 0;
        this.type = args.type ?? 0;
        this.content = args.content ?? '';
        this.acceptEditTime = args.acceptEditTime ?? this.endTime;
        this.status = args.status ?? STATUS_PUBLIC;
        this.attachments = args.attachments ?? [];
        if (isObject(args.teacherId)) {
            this.teacher = new UserInfo(args.teacherId);
        }
        if (isObject(args.courseId)) {
            this.course = new Course(args.courseId);
        }
        if (isObject(args.topicId)) {
            this.topic = new Topic(args.topicId);
        }
        if (isObject(args.classesId)) {
            this.classes = new Classes(args.classesId)
        }
    }
    cloneNewAssignment = (props: { classesId?: string, teacherId?: string, durationDate?: number }): Assignment => {
        let newAss = new Assignment(this);
        newAss._id = undefined;
        if (props.classesId) {
            newAss.classesId = props.classesId;
        }
        if (props.teacherId) {
            newAss.teacherId = props.teacherId;
        }
        if (props.durationDate) {
            const oldStartTime = moment(newAss.startTime);
            const oldEndTime = moment(newAss.endTime);
            const oldAcceptEditTime = moment(newAss.acceptEditTime);
            const newStartTime = oldStartTime.add(props.durationDate, 'days');
            const newEndTime = oldEndTime.add(props.durationDate, "days");
            const newAcceptEditTime = oldAcceptEditTime.add(props.durationDate, "days");
            newAss.startTime = newStartTime.valueOf();
            newAss.endTime = newEndTime.valueOf();
            newAss.acceptEditTime = newAcceptEditTime.valueOf();
        }
        return newAss;
    }
}
export { Assignment }
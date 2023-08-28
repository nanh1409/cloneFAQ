import { STATUS_PUBLIC, UNREAD_STATUS, UNREPLY_STATUS, GRADING_STATUS } from '../constraint';
import { isObject } from '../utils';
import { Classes } from "./classes";
import { UserInfo } from "./user";
import { Course } from "./courses";
import Topic from "./topic";
import { Category } from "./category";
import Skill from "./skill";
export enum NotifType {
    ALL = 0,
    PARENT = 1,
    STUDENT = 2,
    TARGET = 3
}
class Notification {
    _id: string | undefined;
    title: string;
    userId: string | null;
    classesId: string | null;
    courseId: string | null;
    topicId: string | null;
    targetId: string | null;
    readStatus: number;
    startTime: number;
    endTime: number;
    status: number;
    user: UserInfo | null;
    userTarget: UserInfo | null;
    course: Course | null;
    topic: Topic | null;
    category: Category | null;
    skill: Skill | null;
    classes: Classes | null;
    createdDate: number;
    type: number;
    content: string;
    discussionsId: string | null;
    replyStatus: number;
    categoryId: string | null;
    skillId: string | null;
    assignStatus: number;
    bannerUrl: string | null;
    url: string | null
    constructor(args?: any) {
        if (!args) {
            args = {}
        }
        this._id = args._id ?? undefined;
        this.title = args.title ?? '';
        this.userId = args.userId?._id ?? (args.userId ?? null)
        this.classesId = args.classesId?._id ?? (args.classesId ?? null)
        this.courseId = args.courseId?._id ?? (args.courseId ?? null)
        this.topicId = args.topicId?._id ?? (args.topicId ?? null)
        this.targetId = args.targetId?._id ?? (args.targetId ?? null)
        this.readStatus = args.readStatus ?? UNREAD_STATUS;
        this.startTime = args.startTime ?? 0;
        this.endTime = args.endTime ?? 0;
        this.type = args.type ?? NotifType.ALL;
        this.createdDate = args.createdDate ?? Date.now();
        this.content = args.content ?? '';
        this.status = args.status ?? STATUS_PUBLIC;
        this.discussionsId = args.discussionsId ?? null
        this.replyStatus = args.replyStatus ?? UNREPLY_STATUS;
        this.categoryId = args.categoryId?._id ?? (args.categoryId ?? null)
        this.skillId = args.skillId?._id ?? (args.skillId ?? null)
        this.assignStatus = args.assignStatus ?? GRADING_STATUS;
        this.bannerUrl = args.bannerUrl ?? '';
        this.url = args.url ?? '';
        if (isObject(args.userId)) {
            this.user = new UserInfo(args.userId);
        }
        if (isObject(args.classesId)) {
            this.classes = new Classes(args.classesId)
        }
        if (isObject(args.targetId)) {
            this.userTarget = new UserInfo(args.targetId);
        }
        if (isObject(args.courseId)) {
            this.course = new Course(args.courseId);
        }
        if (isObject(args.topicId)) {
            this.topic = new Topic(args.topicId);
        }
        if (isObject(args.categoryId)) {
            this.category = new Category(args.categoryId);
        }
        if (isObject(args.skillId)) {
            this.skill = new Skill(args.skillId);
        }
    }

}
export { Notification };

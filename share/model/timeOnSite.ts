import { UserInfo } from './user';
import { Course } from './courses';
import Topic from './topic';
import { isObject } from '../utils';
import { Classes } from './classes';

export interface ITimeOnSite {
    _id?: any;
    userId?: any;
    courseId?: any;
    topicId?: any;
    date?: number;
    totalTime?: number;
    classesId?: any;
    type?: number
}

export default class TimeOnSite implements ITimeOnSite {
    _id: any;
    userId: any;
    courseId: any;
    topicId: any;
    date: number;
    totalTime: number;
    user?: UserInfo;
    course?: Course;
    topic?: Topic;
    classesId: any;
    classes?: Classes | null;
    type?: number; // web: 0, 1: cms, 2: crm, 3: smart classes
    constructor(args: ITimeOnSite = {}) {
        this._id = args._id ?? undefined;
        this.userId = args.userId?._id ?? (args.userId ?? null);
        this.courseId = args.courseId?._id ?? (args.courseId ?? null);
        this.topicId = args.topicId?._id ?? (args.topicId ?? null);
        this.date = args.date ?? 0;
        this.totalTime = args.totalTime ?? 0;
        this.classesId = args.classesId?._id ?? (args.classesId ?? null);
        this.type = args.type ?? 0;
        if (isObject(args.userId)) this.user = new UserInfo(args.userId);
        if (isObject(args.courseId)) this.course = new Course(args.courseId);
        if (isObject(args.topicId)) this.topic = new Topic(args.topicId);
        if (isObject(args.classesId)) this.classes = new Classes(args.classesId);

    }
}

function TimeOnSiteModel(object) {
    return {
        _id: object._id ? object._id : undefined,
        userId: object.userId ? object.userId : null,
        courseId: object.courseId ? object.courseId : null,
        topicId: object.topicId ? object.topicId : null,
        date: object.date ? object.date : 0,
        totalTime: object.totalTime ? object.totalTime : 0,
    }
}

function convertJsonToTimeOnsiteModel(datas: any[]) {
    let dataReturns: TimeOnSite[] = []
    if (datas && datas.length > 0) {
        datas.map(e => {
            dataReturns.push(new TimeOnSite(e))
        })
    }
    return dataReturns
}

export { TimeOnSiteModel, convertJsonToTimeOnsiteModel }

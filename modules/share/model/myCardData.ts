import { isObject } from '../utils';
import { Course } from './courses';
import Topic from './topic';
import { UserInfo } from './user';

export interface IMyCardData {
    _id?: any;
    userId?: any;
    courseId?: any;
    topicId?: any;
    boxCard?: any;
    cardIgnores?: any[];
    cardBookmarks?: any[];
    lastUpdate?: number;
}

export default class MyCardData implements IMyCardData {
    _id: any;
    userId: any;
    courseId: any;
    topicId: any;
    boxCard: any;
    cardIgnores: any[];
    cardBookmarks: any[];
    lastUpdate: number;
    user?: UserInfo;
    course?: Course;
    topic?: Topic;
    constructor(args: IMyCardData = {}) {
        this._id = args._id ?? undefined;
        this.userId = args.userId?._id ?? (args.userId ?? null);
        this.courseId = args.courseId?._id ?? (args.courseId ?? null);
        this.topicId = args.topicId?._id ?? (args.topicId ?? null);
        this.boxCard = args.boxCard ?? {};
        this.cardIgnores = args.cardIgnores ?? [];
        this.cardBookmarks = args.cardBookmarks ?? [];
        this.lastUpdate = args.lastUpdate ?? 0;
        if (isObject(args.userId)) this.user = new UserInfo(args.userId);
        if (isObject(args.courseId)) this.course = new Course(args.courseId);
        if (isObject(args.topicId)) this.topic = new Topic(args.topicId);
    }
}

function MyCardDataModel(object) {
    if (!object) {
        return
    }
    return {
        _id: object._id ? object._id : undefined,
        userId: object.userId ? object.userId : undefined,
        courseId: object.courseId ? object.courseId : undefined,
        topicId: object.topicId ? object.topicId : undefined,
        boxCard: object.boxCard ? object.boxCard : {},
        cardIgnores: object.cardIgnores ? object.cardIgnores : [],
        cardBookmarks: object.cardBookmarks ? object.cardBookmarks : [],
        lastUpdate: object.lastUpdate ? object.lastUpdate : 0
    }
}

export { MyCardDataModel }
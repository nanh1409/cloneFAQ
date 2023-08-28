export interface ITotalTimeOnSite {
    _id?: any;
    userId?: any;
    courseId?: any;
    topicId?: any;
    date?: number;
    totalTime?: number;
    classesId?: any;
    type?: number
}
export default class TotalTimeOnSite implements ITotalTimeOnSite {
    _id: any;
    userId: any;
    courseId: any;
    topicId: any;
    date: number;
    totalTime: number;
    user?: any;
    course?: any;
    topic?: any;
    classesId: any;
    classes?: any;
    type?: number; // web: 0, 1: cms, 2: crm, 3: smart classes
    constructor(args: ITotalTimeOnSite = {}) {
        this._id = args._id ?? undefined;
        this.userId = args.userId?._id ?? (args.userId ?? null);
        this.courseId = args.courseId?._id ?? (args.courseId ?? null);
        this.topicId = args.topicId?._id ?? (args.topicId ?? null);
        this.date = args.date ?? 0;
        this.totalTime = args.totalTime ?? 0;
        this.classesId = args.classesId?._id ?? (args.classesId ?? null);
        this.type = args.type ?? 0;
        // if (isObject(args.userId)) this.user = new UserInfo(args.userId);
        // if (isObject(args.courseId)) this.course = new Course(args.courseId);
        // if (isObject(args.topicId)) this.topic = new Topic(args.topicId);
        // if (isObject(args.classesId)) this.classes = new Classes(args.classesId);
    }
}

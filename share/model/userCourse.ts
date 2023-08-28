import { isObject } from '../utils';
import { Course } from './courses';
import { UserInfo } from './user';
import UserCourseStudy from './userCourseStudy';

export interface IUserCourse {
    _id?: any;
    userId?: any;
    courseId?: any;
    userCourseStudyId?: any;
    joinDate?: number;
    expireDate?: number;
    studyType?: number;
    lastUpdate?: number;
    status?: number;
    isExpired?: boolean;
    isTeacher?: boolean;
    course?: Course;
}

export default class UserCourse implements IUserCourse {
    _id: any;
    userId: any;
    courseId: any;
    userCourseStudyId: any;
    joinDate: number;
    expireDate: number;
    studyType: number;
    lastUpdate: number;
    status: number;
    user?: UserInfo;
    course?: Course;
    userCourseStudy?: UserCourseStudy;
    isExpired?: boolean;
    isTeacher?: boolean;
    constructor(args: IUserCourse = {}) {
        this._id = args._id ?? undefined;
        this.userId = args.userId?._id ?? (args.userId ?? null);
        this.courseId = args.courseId?._id ?? (args.courseId ?? null);
        this.userCourseStudyId = args.userCourseStudyId?._id ?? (args.userCourseStudyId ?? null);
        this.joinDate = args.joinDate ?? 0;
        this.expireDate = args.expireDate ?? 0;
        this.studyType = args.studyType ?? 0;
        this.lastUpdate = args.lastUpdate ?? 0;
        this.status = args.status ?? 0;
        this.isExpired = args.isExpired;
        this.isTeacher = args.isTeacher;
        this.course = args.course;
        if (isObject(args.userId)) this.user = new UserInfo(args.userId);
        if (isObject(args.courseId)) this.course = new Course(args.courseId);
        if (isObject(args.userCourseStudyId)) this.userCourseStudy = new UserCourseStudy(args.userCourseStudyId);
    }
}

function UserCourseModel(object) {
    return {
        _id: object._id ? object._id : undefined,
        userId: object.userId ?? null,
        courseId: object.courseId ?? null,
        userCourseStudyId: object.userCourseStudyId ?? null,
        joinDate: object.joinDate ?? 0,
        expireDate: object.expireDate ?? 0,
        studyType: object.studyType ?? 0,
        lastUpdate: object.lastUpdate ?? 0,
        status: object.status ?? 0,
    }
}

export { UserCourseModel }
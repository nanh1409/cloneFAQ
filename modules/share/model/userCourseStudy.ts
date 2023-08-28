import { isObject } from '../utils';
import { Course } from './courses';
import { UserInfo } from './user';

export interface IUserCourseStudy {
  _id?: any;
  userId?: any;
  courseId?: any;
  totalTimeStudy?: number;
  topicPassed?: number;
  exp?: number;
  router?: number;
}

export default class UserCourseStudy implements IUserCourseStudy {
  _id: any;
  userId: any;
  courseId: any;
  totalTimeStudy: number;
  topicPassed: number;
  exp: number;
  router: number;
  user?: UserInfo;
  course?: Course;
  constructor(args: IUserCourseStudy = {}) {
    this._id = args._id ?? undefined;
    this.userId = args.userId?._id ?? (args.userId ?? null);
    this.courseId = args.courseId?._id ?? (args.courseId ?? null);
    this.totalTimeStudy = args.totalTimeStudy ?? 0;
    this.topicPassed = args.topicPassed ?? 0;
    this.exp = args.exp ?? 0;
    this.router = args.router ?? 0;
    if (isObject(args.userId)) this.user = new UserInfo(args.userId);
    if (isObject(args.courseId)) this.course = new Course(args.courseId);
  }
}
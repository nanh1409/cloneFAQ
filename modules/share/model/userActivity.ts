import {
  USER_ACTIVITY_COMMENT,
  USER_ACTIVITY_COURSE,
  USER_ACTIVITY_LESSON,
  USER_ACTIVITY_PLAY_GAME_PARACTICE,
  USER_ACTIVITY_PLAY_GAME_SCENARIO,
  USER_ACTIVITY_PLAY_GAME_TEST,
  USER_ACTIVITY_WATCH_VIDEO
} from '../constraint';
import { isObject } from '../utils';
import { Course } from './courses';
import Discussion from './discussion';
import Document from './document';
import { StudyScoreData } from './studyScoreData';
import Topic from './topic';
import { UserInfo } from './user';

export interface IUserActivity {
  _id?: any;
  courseId?: any;
  itemId?: any;
  userId?: any;
  type?: number;
  createDate?: number;
  lastUpdate?: number;
}

export class UserActivity implements IUserActivity {
  _id: string | undefined;
  courseId: string | null;
  itemId: string | null;
  userId: string | null;
  type: number;
  createDate: number;
  lastUpdate: number;
  course?: Course;
  user?: UserInfo;
  item?: Discussion | StudyScoreData | Topic | Course | Document;

  constructor(args: IUserActivity = {}) {
    const activityType = args.type ?? USER_ACTIVITY_COURSE;
    this._id = args._id ?? undefined;
    this.courseId = args.courseId._id ?? (args.courseId ?? null);
    this.itemId = args.itemId._id ?? (args.itemId ?? null);
    this.userId = args.userId._id ?? (args.userId ?? null);
    this.type = activityType;
    this.createDate = args.createDate ?? Date.now();
    this.lastUpdate = args.lastUpdate ?? Date.now();
    if (isObject(args.courseId)) this.course = new Course(args.courseId);
    if (isObject(args.userId)) this.user = new UserInfo(args.userId);
    if (isObject(args.itemId)) {
      if (activityType === USER_ACTIVITY_COMMENT) this.item = new Discussion(args.itemId);
      else if (activityType === USER_ACTIVITY_PLAY_GAME_PARACTICE || activityType === USER_ACTIVITY_PLAY_GAME_TEST) this.item = new StudyScoreData(args.itemId);
      else if (activityType === USER_ACTIVITY_LESSON || activityType === USER_ACTIVITY_WATCH_VIDEO || activityType === USER_ACTIVITY_PLAY_GAME_SCENARIO) this.item = new Topic(args.itemId);
    }
  }
}

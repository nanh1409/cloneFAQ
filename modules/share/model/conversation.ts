import { isObject } from '../utils';
import { Course } from './courses';

export interface IConversation {
  _id?: any;
  courseId?: any;
  parentId?: any;
  lastUpdate?: number;
  type?: number;
}

export default class Conversation implements IConversation {
  _id: string | undefined;
  courseId: string | null;
  parentId: string | null;
  lastUpdate: number;
  type: number;
  course?: Course;
  constructor(args: IConversation = {}) {
    this._id = args._id ?? undefined;
    this.courseId = args.courseId?._id ?? (args.courseId ?? null);
    this.parentId = args.parentId ?? null;
    this.lastUpdate = args.lastUpdate ?? 0;
    this.type = args.type ?? 0;
    if (isObject(args.courseId)) this.course = new Course(args.courseId);
  }
}
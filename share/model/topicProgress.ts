import { isObject } from '../utils';
import { Course } from './courses';
import Topic from './topic';
import { UserInfo } from './user';

export interface ITopicProgress {
    _id?: any;
    topicId?: any;
    parentId?: any;
    userId?: any;
    courseId?: any;
    progress?: number;
    status?: number;
    lastUpdate?: number;
    childCardnum?: number;
}

class TopicProgress implements ITopicProgress {
  _id: any;
  topicId: any;
  parentId: any;
  userId: any;
  courseId: any;
  progress: number;
  status: number;
  lastUpdate: number;
  childCardnum?: number;
  user?: UserInfo;
  parent?: Topic;
  topic?: Topic;
  course?: Course;
  constructor(args: ITopicProgress = {}) {
    this._id = args._id ?? undefined;
    this.topicId = args.topicId?._id ?? (args.topicId ?? null);
    this.parentId = args.parentId?._id ?? (args.parentId ?? null);
    this.userId = args.userId?._id ?? (args.userId ?? null);
    this.courseId = args.courseId?._id ?? (args.courseId ?? null);
    this.progress = args.progress ?? 0;
    this.status = args.status ?? 0;
    this.lastUpdate = args.lastUpdate ?? 0;
    this.childCardnum = args.childCardnum;
    if (isObject(args.userId)) this.user = new UserInfo(args.userId);
    if (isObject(args.courseId)) this.course = new Course(args.courseId);
    if (isObject(args.topicId)) this.topic = new Topic(args.topicId);
    if (isObject(args.parentId)) this.parent = new Topic(args.parentId);
  }
}

// function TopicProgress() {
//     this._id = '';
//     this.topicId = '';
//     this.parentId = '';
//     this.userId = '';
//     this.courseId = '';
//     this.progress = 0;
//     this.status = 0;
//     this.lastUpdate = 0;
// }
export default TopicProgress; 
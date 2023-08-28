import { UNREPLY_STATUS } from '../constraint';
import { UserInfo } from './user';
import { Course } from './courses';
import Topic from './topic';
import Conversation from './conversation';
import { isObject } from '../utils';
export interface IDiscussion {
  _id?: any;
  userId?: any;
  courseId?: any;
  parentId?: any;
  topicId?: any;
  conversationId?: any;
  userName?: string;
  content?: string;
  imageUrl?: string;
  sourceUrl?: string;
  likes?: any[];
  role?: number;
  status?: number;
  createDate?: number;
  lastUpdate?: number;
  userParentId?: any;
  href?: any;
  courseName?: any;
  topicName?: any;
  replyStatus?: number;
}

export default class Discussion implements IDiscussion {
  _id: string | undefined;
  userId: string | null;
  courseId: string | null;
  parentId: string | null;
  topicId: string | null;
  conversationId: string | null;
  userName: string;
  content: string;
  imageUrl: string;
  sourceUrl: string;
  likes: any[];
  role: number;
  status: number;
  createDate: number;
  lastUpdate: number;
  user?: UserInfo;
  course?: Course;
  topic?: Topic;
  conversation?: Conversation;
  userParentId: string | null;
  href: string | null;
  courseName: string | null;
  topicName: string | null;
  replyStatus: number;
  constructor(args: IDiscussion = {}) {
    this._id = args._id ?? undefined;
    this.userId = args.userId?._id ?? (args.userId ?? null);
    this.courseId = args.courseId?._id ?? (args.courseId ?? null);
    this.parentId = args.parentId ?? null;
    this.topicId = args.topicId?._id ?? (args.topicId ?? null);
    this.conversationId = args.conversationId?._id ?? (args.conversationId ?? null);
    this.userName = args.userName ?? '';
    this.content = args.content ?? '';
    this.imageUrl = args.imageUrl ?? '';
    this.sourceUrl = args.sourceUrl ?? '';
    this.likes = args.likes ?? [];
    this.role = args.role ?? 0;
    this.status = args.status ?? 1;
    this.createDate = args.createDate ?? 0;
    this.lastUpdate = args.lastUpdate ?? 0;
    this.userParentId = args.userParentId ?? '';
    this.href = args.href ?? '';
    this.courseName = args.courseName ?? '';
    this.topicName = args.topicName ?? '';
    this.replyStatus = args.replyStatus ?? UNREPLY_STATUS;
    if (isObject(args.userId)) {
      this.user = new UserInfo(args.userId);
    }
    if (isObject(args.courseId)) {
      this.course = new Course(args.courseId);
    }
    if (isObject(args.topicId)) {
      this.topic = new Topic(args.topicId);
    }
    if (isObject(args.conversationId)) {
      this.conversation = new Conversation(args.conversationId);
    }
  }
}

function DiscussionModel(object) {
  return {
    _id: object._id ? object._id : '',
    userId: object.userId ? object.userId : '',
    courseId: object.courseId ? object.courseId : '',
    parentId: object.parentId ? object.parentId : '',
    topicId: object.topicId ? object.topicId : '',
    converstaionId: object.conversationId ? object.conversationId : '',
    userName: object.userName ? object.userName : '',
    content: object.content ? object.content : '',
    imageUrl: object.imageUrl ? object.imageUrl : '',
    sourceUrl: object.sourceUrl ? object.sourceUrl : '',
    likes: object.likes ? object.likes : [],
    role: object.role ? object.role : 0,
    status: object.status ? object.status : 1,
    createDate: object.createDate ? object.createDate : 0,
    lastUpdate: object.lastUpdate ? object.lastUpdate : 0,
  }
}

function convertDiscussionsToModel(datas: any[]) {
  let dataReturn: Discussion[] = []
  if (datas && datas.length > 0) {
    datas.map((e) => {
      let c = new Discussion(e)
      dataReturn.push(c)
    })
  }
  // console.log('dataReturn ', dataReturn)
  return dataReturn
}

export { DiscussionModel, convertDiscussionsToModel }
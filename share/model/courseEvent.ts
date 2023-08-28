import { CourseEventTypes, STATUS_PUBLIC } from '../constraint';
import { isObject } from '../utils';
import { Course } from './courses';
import Topic from './topic';

export interface ICourseEvent {
  _id?: any;
  name?: string;
  shortDescription?: string;
  description?: string;
  image?: string;
  courseId?: any;
  createDate?: number;
  publishDate?: number;
  expireDate?: number;
  status?: number;
  url?: string;
  type?: number;
  topicTestId?: string;
  topicPracticeIds?: string[];
}

export class CourseEvent {
  _id: string | undefined;
  name: string;
  shortDescription: string;
  description: string;
  image: string;
  courseId: string | null;
  createDate: number | null;
  publishDate: number | null;
  expireDate: number | null;
  status: number;
  url: string;
  type: number;
  topicTestId?: string;
  topicPracticeIds?: string[];

  course?: Course;
  test?: Topic;
  practices?: Topic[];

  constructor(args: any = {}) {
    this._id = args._id ?? undefined; 
    this.name = args.name ?? '';
    this.shortDescription = args.shortDescription ?? '';
    this.description = args.description ?? '';
    this.image = args.image ?? '';
    this.courseId = args.courseId?._id ?? (args.courseId ?? null);
    this.createDate = args.createDate ?? null;
    this.publishDate = args.publishDate ?? null;
    this.expireDate = args.expireDate  ?? null;
    this.status = args.status ?? STATUS_PUBLIC;
    this.url = args.url ?? '';
    this.type = args.type ?? CourseEventTypes.DEFAULT;
    this.topicTestId = args.topicTestId ?? null;
    this.topicPracticeIds = args.topicPracticeIds ?? null;
    
    if(isObject(args.courseId)) this.course = new Course(args.courseId);
  }
}
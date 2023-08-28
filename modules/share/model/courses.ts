import { COURSE_TYPE_VIDEO_ONLINE, STATUS_PUBLIC } from "../constraint";
import CourseContent from "./courseContent";
import CourseSystem from "./courseSystem";
import IUserInfo, { UserInfo } from "./user";
import { isObject } from "../utils";

export class Course {
  _id: string;
  name: string;
  shortDesc: string;
  avatar: string;
  startTime: number;
  endTime: number;
  cost: number;
  discountPercent: number;
  discountPrice: number;
  privacy: number;
  type: number;
  status: number;
  password: string;
  slug: string;
  courseSystemId: string;
  courseContentId: string;
  courseSystem: any;
  courseContent: any;
  ownerId: string;
  owner: IUserInfo | null;
  categoryId: string | null;
  level: number;
  bucket?: string;
  constructor(object: any = {}, categoryId?: string) {
    let courseContent: any = null;
    if (object.courseContent) {
      courseContent = new CourseContent(object.courseContent);
    } else if (isObject(object.courseContentId)) {
      courseContent = new CourseContent(object.courseContentId);
    }
    let courseSystem: any = null;
    if (object.courseSystem) {
      courseSystem = new CourseSystem(object.courseSystem);
    } else if (isObject(object.courseSystemId)) {
      courseSystem = new CourseSystem(object.courseSystemId);
    }
    let ownerId: any;
    let owner: any = null;
    if (object.owner) {
      owner = new UserInfo(object.owner);
      ownerId = owner._id;
    } else if (isObject(object.ownerId)) {
      owner = new UserInfo(object.ownerId);
      ownerId = owner._id;
    } else {
      ownerId = object.ownerId;
    }

    this._id = object._id ? object._id : undefined;
    this.name = object.name ? object.name : "";
    this.shortDesc = object.shortDesc ? object.shortDesc : "";
    this.avatar = object.avatar ? object.avatar : "";
    this.startTime = object.startTime ? object.startTime : 0;
    this.endTime = object.endTime ? object.endTime : 0;
    this.cost = object.cost ? object.cost : 0;
    this.discountPercent = object.discountPercent ? object.discountPercent : 0;
    this.discountPrice = object.discountPrice ? object.discountPrice : 0;
    this.privacy = object.privacy ? object.privacy : 0;
    this.type = object.type ?? COURSE_TYPE_VIDEO_ONLINE;
    this.status = object.status ?? STATUS_PUBLIC;
    this.password = object.password ? object.password : "";
    this.slug = object.slug ? object.slug : "";
    this.courseSystemId = this._id;
    this.courseContentId = this._id;
    this.courseSystem = courseSystem;
    this.courseContent = courseContent;
    this.ownerId = ownerId ?? null;
    this.owner = owner;
    this.categoryId = object.categoryId ?? null;
    this.level = object.level ? object.level : 1;
    this.bucket = object?.bucket;
  }

  toInterFace() {
    return { ...this };
  }
}

export interface ICourse {
  _id: any;
  name: string;
  shortDesc: string;
  avatar: string;
  startTime: number;
  endTime: number;
  cost: number;
  discountPercent: number;
  discountPrice: number;
  privacy: number;
  type: number;
  status: number;
  password: string;
  slug: string;
  courseSystemId: string;
  courseContentId: string;
  courseSystem: any | null | undefined;
  courseContent: any | null | undefined;
  ownerId: any | null;
  owner: IUserInfo | null;
  level: number;
  bucket?: string;
}

export const convertJsonToCourse = (datas?: Array<any>) => {
  let courses: Array<Course> = [];
  if (datas) {
    datas.map((e) => {
      courses.push(new Course(e));
    });
  }
  return courses;
};

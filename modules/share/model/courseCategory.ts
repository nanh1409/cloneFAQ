import { STATUS_PUBLIC } from "../constraint";
import { Course, ICourse } from './courses';
import { Category } from './category';
import { isObject } from '../utils';

export interface ICourseCategory {
    _id?: any;
    courseId?: any;
    categoryId?: any;
    rootCategoryId?: any;
    status?: any;
    index?: any;
    course?: ICourse;
}

export default class CourseCategory implements ICourseCategory {
    _id: any;
    courseId: any;
    categoryId: any;
    rootCategoryId: any;
    status: any;
    index: any;
    course?: Course;
    category?: Category;
    rootCategory?: Category;

    constructor(args: ICourseCategory = {}) {
        this._id = args._id ?? undefined;
        this.courseId = args.courseId?._id ?? (args.courseId ?? null);
        this.categoryId = args.categoryId?._id ?? (args.categoryId ?? null);
        this.rootCategoryId = args.rootCategoryId?._id ?? (args.rootCategoryId ?? null);
        this.status = args.status ?? STATUS_PUBLIC;
        this.index = args.index ?? 0;
        if (isObject(args.categoryId)) {
            this.category = new Category(args.categoryId);
        }
        if (isObject(args.rootCategoryId)) {
            this.rootCategory = new Category(args.rootCategoryId);
        }
        if (args.course) {
            this.course = new Course(args.course);
            this.courseId = this.course._id;
        } else if (isObject(args.courseId)) {
            this.course = new Course(args.courseId);
            this.courseId = this.course._id;
        }
    }
}

function CourseCategoryModel(object) {
    let course
    let courseId = null
    if (object.course) {
        course = new Course(object.course)
        courseId = course._id
    } else if (object.courseId && typeof (object.courseId) === 'object') {
        course = new Course(object.courseId)
        courseId = course._id
    } else {
        courseId = object.courseId
    }
    return {
        _id: object._id ? object._id : undefined,
        courseId: courseId,
        categoryId: object.categoryId ? object.categoryId : null,
        rootCategoryId: object.rootCategoryId ? object.rootCategoryId : null,
        status: object.status ? object.status : STATUS_PUBLIC,
        index: object.index ? object.index : 0,
        course: course,
    }
}

function convertJsonToCourseCategory(datas?: any[]): CourseCategory[] {
    let courses = datas?.map((e) => new CourseCategory(e)) || [];
    return courses;
}

export { CourseCategoryModel, convertJsonToCourseCategory };

import { isObject } from "../utils";
import { Classes } from "./classes";
import { Course } from "./courses";

class CourseClasses {
    _id: string | undefined;
    classesId: string | null;
    courseId: string | null;
    classes: Classes | null;
    course: Course | null;
    constructor(args: any = {}) {
        this._id = args._id?._id ?? (args._id ?? undefined);
        this.classesId = args.classesId?._id ?? (args.classesId ?? null);
        this.courseId = args.courseId?._id ?? (args.courseId ?? null);

        if (isObject(args.classesId)) {
            this.classes = new Classes(args.classesId);
        }
        if (isObject(args.courseId)) {
            this.course = new Course(args.courseId);
        }
    }
}

export { CourseClasses }
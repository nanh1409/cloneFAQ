import { STATUS_PUBLIC } from "../constraint";
import { Classes } from "./classes";
import { Course } from "./courses";

class ClassesCombo {
    _id: string | undefined;
    classesIds: string[];
    code: string | null;
    createdDate: number;
    lastUpdate: number;
    startDate: number;
    endDate: number;
    status: number;
    type: number;
    price: number;
    studyTime: number;
    name: string;
    classes: Classes[];
    clubNum:number;
    clubRandomNum: number;
    courses: Course[];
    coursesNum: number;
    courseRandomNum: number;
    testRequired: number;
    descriptions: string[];
    index: number
    constructor(args: any) {
        if (!args) {
            args = {};
        }
        this._id = args._id ?? undefined;
        this.classesIds = args.classesIds ?? [];
        this.code = args.code ?? null;
        this.createdDate = args.createdDate ?? Date.now();
        this.lastUpdate = args.lastUpdate ?? Date.now();
        this.startDate = args.startDate ?? 0;
        this.endDate = args.endDate ?? 0;
        this.status = args.status ?? STATUS_PUBLIC;
        this.type = args.type ?? 0;
        this.price = args.price ?? 0;
        this.studyTime = args.studyTime ?? 0;
        this.name = args.name ?? "";
        this.classes = args.classes ?? [];
        this.clubRandomNum = args.clubRandomNum ?? 0;
        this.courses = args.courses ?? [];
        this.coursesNum = args.coursesNum ?? 0;
        this.courseRandomNum = args.courseRandomNum ?? 0;
        this.clubNum = args.clubNum ?? 0;
        this.courseRandomNum = args.courseRandomNum ?? 0;
        this.testRequired = args.testRequired ?? 0;
        this.descriptions = args.descriptions ?? [];
        this.index = args.index ?? 0;
    }
}
export { ClassesCombo }
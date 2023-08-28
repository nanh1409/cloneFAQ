import { CourseMarkType, COURSE_MODE_NORMAL } from "../constraint"

export interface ICourseContent {
    _id?: any;
    desc?: string;
    dayToOpenLesson?: number;
    videoIntro?: string;
    mode?: number;
    timeStudy?: number;
    titleSeo?: string;
    robotSeo?: string;
    seo301?: string;
    descriptionSeo?: string;
    markType?: number;
}

export default class CourseContent {
    _id: any;
    desc: string;
    dayToOpenLesson: number;
    videoIntro: string;
    mode: number;
    timeStudy: number;
    titleSeo: string;
    robotSeo: string;
    seo301: string;
    descriptionSeo: string;
    markType: number;
    constructor(args: ICourseContent = {}) {
        this._id = args._id ?? undefined;
        this.desc = args.desc ?? '';
        this.dayToOpenLesson = args.dayToOpenLesson ?? 0;
        this.videoIntro = args.videoIntro ?? '';
        this.mode = args.mode ?? COURSE_MODE_NORMAL;
        this.timeStudy = args.timeStudy ?? 0;
        this.titleSeo = args.titleSeo ?? '';
        this.robotSeo = args.robotSeo ?? '';
        this.seo301 = args.seo301 ?? '';
        this.descriptionSeo = args.descriptionSeo ?? '';
        this.markType = args?.markType ?? CourseMarkType.FREE;
    }
}

function CourseContentModel(object) {

    return {
        _id: object._id ? object._id : undefined,
        desc: object.desc ? object.desc : '',
        dayToOpenLesson: object.dayToOpenLesson ? object.dayToOpenLesson : 0,
        videoIntro: object.videoIntro ? object.videoIntro : '',
        mode: object.mode ?? COURSE_MODE_NORMAL,
        timeStudy: object.timeStudy ? object.timeStudy : 0,
        titleSeo: object.titleSeo ? object.titleSeo : '',
        robotSeo: object.robotSeo ? object.robotSeo : '',
        seo301: object.seo301 ? object.seo301 : '',
        descriptionSeo: object.descriptionSeo ? object.descriptionSeo : '',
    }
}
export { CourseContentModel }
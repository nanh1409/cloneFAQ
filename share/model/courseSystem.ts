export interface ICourseSystem {
    _id?: any;
    vote?: number;
    memberNum?: number;
    totalVideo?: number;
    totalExercise?: number;
    totalTest?: number;
    totalDoc?: number;
    totalAudio?: number;
    lastUpdate?: number;
    createDate?: number;
}

export default class CourseSystem implements ICourseSystem {
    _id: any;
    vote: number;
    memberNum: number;
    totalVideo: number;
    totalExercise: number;
    totalTest: number;
    totalDoc: number;
    totalAudio: number;
    lastUpdate: number;
    createDate: number;
    constructor(args: ICourseSystem = {}) {
        this._id = args._id ?? undefined;
        this.vote = args.vote ?? 0;
        this.memberNum = args.memberNum ?? 0;
        this.totalVideo = args.totalVideo ?? 0;
        this.totalExercise = args.totalExercise ?? 0;
        this.totalTest = args.totalTest ?? 0;
        this.totalDoc = args.totalDoc ?? 0;
        this.totalAudio = args.totalAudio ?? 0;
        this.lastUpdate = args.lastUpdate ?? 0;
        this.createDate = args.createDate ?? 0;
    }
}

function CourseSystemModel(object) {
    return {
        _id: object._id ? object._id : undefined,
        vote: object.vote ? object.vote : 0,
        memberNum: object.memberNum ? object.memberNum : 0,
        totalVideo: object.totalVideo ? object.totalVideo : 0,
        totalExercise: object.totalExercise ? object.totalExercise : 0,
        totalTest: object.totalTest ? object.totalTest : 0,
        totalDoc: object.totalDoc ? object.totalDoc : 0,
        totalAudio: object.totalAudio ? object.totalAudio : 0,
        lastUpdate: object.lastUpdate ? object.lastUpdate : 0,
        createDate: object.createDate ? object.createDate : 0,
    }
}
export { CourseSystemModel }
export interface ITopicSystem {
    _id?: any;
    topicId?: any;
    createdAt?: Date;
    updatedAt?: Date;
    totalVideo?: number;
    lengthVideo?: number;
    totalExercise?: number;
    totalTest?: number;
    totalDoc?: number;
    totalAudio?: number;
    totalQuestions?: number;
    totalChild?: number;
}

class TopicSystem implements ITopicSystem {
    _id: any;
    topicId: any;
    createdAt?: Date;
    updatedAt?: Date;
    totalVideo: number;
    lengthVideo: number;
    totalExercise: number;
    totalTest: number;
    totalDoc: number;
    totalAudio: number;
    totalQuestions: number;
    totalChild: number;
    constructor(args: ITopicSystem = {}) {
        this._id = args._id ?? undefined;
        this.topicId = args.topicId ?? null;
        this.createdAt = args.createdAt;
        this.updatedAt = args.updatedAt;
        this.totalVideo = args.totalVideo ?? 0;
        this.lengthVideo = args.lengthVideo ?? 0;
        this.totalExercise = args.totalExercise ?? 0;
        this.totalTest = args.totalTest ?? 0;
        this.totalDoc = args.totalDoc ?? 0;
        this.totalAudio = args.totalAudio ?? 0;
        this.totalQuestions = args.totalQuestions ?? 0;
        this.totalChild = args.totalChild ?? 0;
    }
}

// function TopicSystem() {
//     this._id = '';
//     this.topicId = '';
//     this.lastUpdate = 0;
//     this.createDate = 0;
//     this.totalVideo = 0;
//     this.totalExercise = 0;
//     this.totalTest = 0;
//     this.totalDoc = 0;
//     this.totalAudio = 0;
// }
export default TopicSystem; 
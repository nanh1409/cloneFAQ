import { isObject } from "../utils";
import Skill from './skill';
import { IStudyScore, StudyScore } from "./studyScore";
import Topic from './topic';
import IUserInfo, { UserInfo } from "./user";

export interface StudyScoreDataStatistics {
    mapSkillValueCard: { [skillValue: number]: { correctNum: number; totalCardNum: number } };
    mapSkillTypeScore: { [skillType: number]: number };
    mapSkillTypeCard: { [skillType: number]: { correctNum: number, totalCardNum: number } };
}
export interface IStudyScoreData {
    _id: any,
    studyScoreId: string,
    courseId: string,
    userId: string,
    skillId: string,
    topicId: string,
    pauseTimeNum: number,
    studyTime: number,
    pauseTimeAt: number,
    currentPart: number,
    currentTimePart: number,
    correctNum: number,
    incorrectNum: number,
    totalCardNum: number,
    lastUpdate: number,
    currentIndex: number,
    totalTime: number,
    score: number,
    status: number,
    type: number,
    shuffleQuestionOrder?: string[];
    statistics?: StudyScoreDataStatistics;

    userInfo?: IUserInfo,
    studyScore?: IStudyScore,
}

export class StudyScoreData {
    _id: any;
    studyScoreId: string;
    courseId: string;
    userId: string;
    skillId: string;
    topicId: string;
    pauseTimeNum: number;
    studyTime: number;
    pauseTimeAt: number;
    currentPart: number;
    currentTimePart: number;
    correctNum: number;
    incorrectNum: number;
    totalCardNum: number;
    lastUpdate: number;
    currentIndex: number;
    totalTime: number;
    score: number;
    status: number;
    type: number;
    shuffleQuestionOrder?: string[];
    statistics?: StudyScoreDataStatistics;

    userInfo?: IUserInfo;
    studyScore?: IStudyScore;
    topic?: Topic;
    skill?: Skill;

    constructor(object: any = {}) {
        this._id = object._id ? object._id : undefined
        this.courseId = object.courseId ? object.courseId : null
        this.skillId = object.skillId?._id ?? (object.skillId ?? null);
        this.topicId = object.topicId?._id ?? (object.topicId ?? null);
        this.pauseTimeNum = object.pauseTimeNum ? object.pauseTimeNum : 0
        this.studyTime = object.studyTime ? object.studyTime : 0
        this.pauseTimeAt = object.pauseTimeAt ? object.pauseTimeAt : 0
        this.currentPart = object.currentPart ? object.currentPart : 0
        this.currentTimePart = object.currentTimePart ? object.currentTimePart : 0
        this.correctNum = object.correctNum ? object.correctNum : 0
        this.incorrectNum = object.incorrectNum ? object.incorrectNum : 0
        this.totalCardNum = object.totalCardNum ? object.totalCardNum : 0;
        this.lastUpdate = object.lastUpdate ? object.lastUpdate : 0
        this.currentIndex = object.currentIndex ? object.currentIndex : 0
        this.totalTime = object.totalTime ? object.totalTime : 0
        this.score = object.score ? object.score : 0
        this.status = object.status ? object.status : 0
        this.type = object.type ? object.type : 0;
        this.shuffleQuestionOrder = object.shuffleQuestionOrder ?? undefined;
        this.statistics = object?.statistics;

        if (isObject(object.userId)) {
            this.userInfo = new UserInfo(object.userId)
            this.userId = this.userInfo._id
        } else {
            this.userId = object.userId ? object.userId : null
            this.userInfo = object.userInfo ?? null
        }
        if (isObject(object.studyScoreId)) {
            this.studyScore = new StudyScore(object.studyScoreId)
            this.studyScoreId = this.studyScore._id
        } else {
            this.studyScoreId = object.studyScoreId ? object.studyScoreId : null
            this.studyScore = object.studyScore ?? null
        }
        if (isObject(object.topicId)) {
            this.topic = new Topic(object.topicId);
        }
        if (isObject(object.skillId)) {
            this.skill = new Skill(object.skillId)
        }
    }
}

// function StudyScoreDataModel(object) {
//     return {
//         _id: object._id ? object._id : undefined,
//         studyScoreId: object.studyScoreId ? object.studyScoreId : null,
//         courseId: object.courseId ? object.courseId : null,
//         userId: object.userId ? object.userId : null,
//         pauseTimeNum: object.pauseTimeNum ? object.pauseTimeNum : 0,
//         studyTime: object.studyTime ? object.studyTime : 0,
//         pauseTimeAt: object.pauseTimeAt ? object.pauseTimeAt : 0,
//         currentPart: object.currentPart ? object.currentPart : 0,
//         currentTimePart: object.currentTimePart ? object.currentTimePart : 0,
//         correctNum: object.correctNum ? object.correctNum : 0,
//         incorrectNum: object.incorrectNum ? object.incorrectNum : 0,
//         lastUpdate: object.lastUpdate ? object.lastUpdate : 0,
//         currentIndex: object.currentIndex ? object.currentIndex : 0,
//         totalTime: object.totalTime ? object.totalTime : 0,
//         score: object.score ? object.score : 0,
//         status: object.status ? object.status : 0,
//         type: object.type ? object.type : 0,
//     }
// }
// export { StudyScoreDataModel };
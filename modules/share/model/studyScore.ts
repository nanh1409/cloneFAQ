import { EXAM_SCORE_WAITING, GAME_TYPE_PRACTICE } from "../constraint";
import { isObject } from '../utils';
import { IStudyScoreData } from './studyScoreData';
import Topic from './topic';
import { ISkillSettingInfo } from "./topicSetting";

export interface IStudyScore {
    _id: any;
    userId: string;
    courseId: string;
    topicId: string;
    userName: string;
    score: number;
    scoreHightest: number;
    progress: number;
    pass: number;
    registerDate: number;
    lastUpdate: number;
    status: number;
    currentIndex: number;
    totalTime: number;
    totalCardStudy: number;
    type: number;
    scenarioDataId?: string;

    studyScoreData?: IStudyScoreData
    studyScoreDatas?: IStudyScoreData[]
    skillSettingInfo?: ISkillSettingInfo
}

export class StudyScore {
    _id: any;
    userId: string;
    courseId: string;
    topicId: string;
    userName: string;
    score: number;
    scoreHightest: number;
    progress: number;
    pass: number;
    registerDate: number;
    lastUpdate: number;
    status: number;
    currentIndex: number;
    totalTime: number;
    totalCardStudy: number;
    type: number;
    scenarioDataId?: string;

    studyScoreData?: IStudyScoreData;
    studyScoreDatas?: IStudyScoreData[]
    topic?: Topic;
    skillSettingInfo?: ISkillSettingInfo;


    constructor(object: any = {}) {
        this._id = object._id ? object._id : undefined
        this.userId = object.userId ? object.userId : null
        this.courseId = object.courseId ? object.courseId : null
        this.userName = object.userName ?? ''
        this.score = object.score ?? 0
        this.scoreHightest = object.scoreHightest ?? 0
        this.progress = object.progress ?? 0
        this.pass = object.pass ?? 0
        this.registerDate = object.registerDate ? object.registerDate : 0
        this.lastUpdate = object.lastUpdate ? object.lastUpdate : 0
        this.status = object.status ?? EXAM_SCORE_WAITING
        this.currentIndex = object.currentIndex ? object.currentIndex : 0
        this.totalTime = object.totalTime ? object.totalTime : 0
        this.totalCardStudy = object.totalCardStudy ? object.totalCardStudy : 0
        this.type = object.type ?? GAME_TYPE_PRACTICE
        this.studyScoreData = object.studyScoreData
        this.studyScoreDatas = object.studyScoreDatas
        if (isObject(object.topicId)) {
            this.topic = new Topic(object.topicId);
            this.topicId = this.topic._id
        } else {
            this.topicId = object.topicId ? object.topicId : null
        }
        this.scenarioDataId = object.scenarioDataId;
    }
}

// function StudyScoreModel(object) {
//     if (!object) {
//         return
//     }
//     let studyScoreData = object.studyScoreData ? new StudyScoreDataModel(object.studyScoreData) : null
//     return {
//         _id: object._id ? object._id : undefined,
//         userId: object.userId ? object.userId : null,
//         courseId: object.courseId ? object.courseId : null,
//         topicId: object.topicId ? object.topicId : null,
//         userName: object.userName ?? '',
//         score: object.score ?? 0,
//         scoreHightest: object.scoreHightest ?? 0,
//         progress: object.progress ?? 0,
//         pass: object.pass ?? 0,

//         registerDate: object.registerDate ? object.registerDate : 0,
//         lastUpdate: object.lastUpdate ? object.lastUpdate : 0,
//         status: object.status ?? EXAM_SCORE_WAITING,
//         currentIndex: object.currentIndex ? object.currentIndex : 0,
//         totalTime: object.totalTime ? object.totalTime : 0,
//         totalCardStudy: object.totalCardStudy ? object.totalCardStudy : 0,
//         type: object.type ?? GAME_TYPE_PRACTICE,
//         studyScoreData: studyScoreData
//     }
// }

// function convertJsonToStudyScore(datas) {
//     let dataReturns = []
//     if (typeof datas === 'string') {
//         datas = JSON.parse(datas)
//     }
//     datas.map(e => {
//         dataReturns.push(new StudyScoreModel(e))
//     })
//     return dataReturns
// }

// export { StudyScoreModel, convertJsonToStudyScore };
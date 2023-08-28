import { STATUS_PUBLIC, SCENARIO_TYPE_VIDEO, VIDEO_PAUSE_PLAY, SCENARIO_VIDEO } from "../constraint"
import ScenarioDataItem, { convertScenarioDataToModel } from "./scenarioDataItem"

export interface IScenarioInfo {
    _id?: any;
    courseId?: any;
    topicId?: any;
    videoId?: string;
    status?: number;
    type?: number;
    autoPlay?: number;
    startTime?: number;
    endTime?: number;
    url?: string;
    timeQuestionData?: Array<any>;
    questionDatas?: Array<any>;
    title?: string;
    lastUpdate?: number;
}

export default class ScenarioInfo implements IScenarioInfo {
    _id: any;
    courseId: string | null;
    topicId: string | null;
    videoId: string;
    status: number;
    type: number;
    autoPlay: number;
    startTime: number;
    endTime: number;
    url: string;
    questionDatas: Array<ScenarioDataItem>;
    title: string;
    lastUpdate: number;
    constructor(args: IScenarioInfo = {}) {
        this._id = args._id ?? undefined;
        this.courseId = args.courseId ?? null;
        this.topicId = args.topicId ?? null;
        this.videoId = args.videoId ?? '';
        this.status = args.status ?? STATUS_PUBLIC;
        this.type = args.type ?? SCENARIO_VIDEO;
        this.autoPlay = args.autoPlay ?? VIDEO_PAUSE_PLAY;
        this.startTime = args.startTime ?? 0;
        this.endTime = args.endTime ?? 0;
        this.url = args.url ?? '';
        this.questionDatas = convertScenarioDataToModel(args.questionDatas ?? args.timeQuestionData ?? []);
        this.title = args.title ?? '';
        this.lastUpdate = args.lastUpdate ?? 0;
    }
}

function ScenarioInfoModel(object: any): IScenarioInfo {
    // let questionDatas = convertScenarioDataToModel(object.questionDatas)
    let questionDatas = convertScenarioDataToModel(object.timeQuestionData)
    return {
        _id: object._id ? object._id : '',
        courseId: object.courseId ? object.courseId : '',
        topicId: object.topicId ? object.topicId : '',
        videoId: object.videoId ? object.videoId : '',
        status: object.status ? object.status : STATUS_PUBLIC,
        type: object.type ? object.type : SCENARIO_TYPE_VIDEO,
        startTime: object.startTime ? object.startTime : 0,
        endTime: object.endTime ? object.endTime : 0,
        url: object.url ? object.url : '',
        questionDatas: questionDatas,
        title: object.title ? object.title : '',
        lastUpdate: object.lastUpdate ? object.lastUpdate : 0,
    }
}

function convertScenarioInfoToModel(datas: any): Array<ScenarioInfo> {
    let dataReturn: Array<ScenarioInfo> = []
    if (datas) {
        if (typeof datas !== 'object') {
            datas = JSON.parse(datas)
        }
        if (datas.length > 0) {
            datas.map((e: IScenarioInfo) => {
                dataReturn.push(new ScenarioInfo(e))
            })
        }
    }
    return dataReturn
}

export { ScenarioInfoModel, convertScenarioInfoToModel }
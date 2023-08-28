import { SCENARIO_CONTENT_TYPE_QUESTION, STATUS_PUBLIC, VIDEO_CONTENT_TYPE_QUESTION } from "../constraint"

export interface IScenarioItem {
    _id?: any;//code
    index?: number;
    title?: string;
    time?: number;
    timePractice?: number;
    type?: number;
    startTime?: number;
    cardIds?: Array<any>;
    status?: number;//SCENARIO_STATUS_PLAY_AGAIN
    playAgain?: boolean;
}

export default class ScenarioDataItem implements IScenarioItem {
    _id: any;
    index: number;
    title: string;
    timePractice: number;
    type: number;
    startTime: number;
    cardIds: Array<string>;
    status: number;
    playAgain: boolean;
    constructor(args: any = {}) {
        this._id = args._id ?? undefined;
        this.index = args.index ?? 0;
        this.title = args.title ?? '';
        this.timePractice = args.time ?? args.timePractice ?? 0;
        this.type = args.type ?? VIDEO_CONTENT_TYPE_QUESTION;
        this.startTime = args.startTime ?? 0;
        this.cardIds = <Array<string>>args.cardIds ?? [];
        this.status = args.status ?? STATUS_PUBLIC;
        this.playAgain = args.playAgain ?? false;
    }
}

function ScenarioDataItemModel(object: any): IScenarioItem {
    let timePractice = 0
    if (object.time) {
        timePractice = object.time
    } else if (object.timePractice) {
        timePractice = object.timePractice
    }
    return {
        _id: object._id,//code
        index: object.index ?? 0,
        title: object.title ? object.title : '',
        timePractice: timePractice,
        type: object.type ? object.type : SCENARIO_CONTENT_TYPE_QUESTION,
        startTime: object.startTime ?? 0,
        cardIds: object.cardIds ? object.cardIds : [],
        status: object.status ? object.status : 0,//SCENARIO_STATUS_PLAY_AGAIN
        playAgain: false
    }
}

function convertScenarioDataToModel(datas: any): Array<ScenarioDataItem> {
    let dataReturn: Array<ScenarioDataItem> = []
    if (datas) {
        if (typeof datas !== 'object') {
            datas = JSON.parse(datas)
        }
        if (datas.length > 0) {
            datas.map((e: IScenarioItem) => {
                dataReturn.push(new ScenarioDataItem(e))
            })
        }
    }

    return dataReturn
}

export { ScenarioDataItemModel, convertScenarioDataToModel }
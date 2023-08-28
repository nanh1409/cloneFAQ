import { BAREM_SCORE_DEFAULT, TOPIC_CONTENT_TYPE_CARD } from "../constraint";
import { isObject } from "../utils";
import { TopicSetting } from "./topicSetting";

export interface ITopicContentInfo {
    linkQuestion?: string;
    linkExplanation?: string;
    textExplanation?: string;
}

export class TopicContentInfo {
    linkQuestion: string;
    linkExplanation: string;
    textExplanation?: string;
    constructor(args: ITopicContentInfo = {}) {
        this.linkQuestion = args.linkQuestion ?? '';
        this.linkExplanation = args.linkExplanation ?? '';
        this.textExplanation = args.textExplanation;
    }
}

export interface ITopicExercise {
    _id?: any;
    topicId?: any;
    questionsNum?: number;
    questionsPlayNum?: number;
    mode?: number;
    duration?: number;
    durationOfQuestion?: number;
    pass?: number;
    replay?: number;
    contentType?: number;
    contentInfo?: ITopicContentInfo;
    pauseTimes?: number;
    baremScore?: number;
    showHighScore?: number;
    showHighScoreTime?: number;
    showResult?: number;
    showResultTime?: number;
    showQuestion?: number;
    settingInfo?: string;
    additionalInfo?: string;
    categoriesData?: string;
    shuffleQuestion?: boolean;
    topicSettingId?: any;
}

export default class TopicExercise implements ITopicExercise {
    _id: any;
    topicId: any;
    questionsNum: number;
    questionsPlayNum: number;
    mode: number;
    duration: number;
    durationOfQuestion: number;
    pass: number;
    replay: number;
    contentType: number;
    contentInfo: TopicContentInfo;
    pauseTimes: number;
    baremScore: number;
    showHighScore: number;
    showHighScoreTime: number;
    showResult: number;
    showResultTime: number;
    showQuestion: number;
    settingInfo: string;
    additionalInfo: string;
    categoriesData: string;
    shuffleQuestion: boolean;
    topicSettingId: string | null;
    topicSetting: TopicSetting;

    constructor(args: ITopicExercise = {}) {
        this._id = args._id ?? undefined;
        this.topicId = args.topicId ?? null;
        this.questionsNum = args.questionsNum ?? 0;
        this.questionsPlayNum = args.questionsPlayNum ?? 0;
        this.mode = args.mode ?? 0;
        this.duration = args.duration ?? 0;
        this.durationOfQuestion = args.durationOfQuestion ?? 0;
        this.pass = args.pass ?? 0;
        this.replay = args.replay ?? 1;
        this.contentType = args.contentType ?? TOPIC_CONTENT_TYPE_CARD;
        this.contentInfo = new TopicContentInfo(args.contentInfo);
        this.pauseTimes = args.pauseTimes ?? 0;
        this.baremScore = args.baremScore ?? BAREM_SCORE_DEFAULT;
        this.showHighScore = args.showHighScore ?? 0;
        this.showHighScoreTime = args.showHighScoreTime ?? 0;
        this.showResult = args.showResult ?? 0;
        this.showResultTime = args.showResultTime ?? 0;
        this.showQuestion = args.showQuestion ?? 0;
        this.settingInfo = args.settingInfo ?? '';
        this.additionalInfo = args.additionalInfo ?? '';
        this.categoriesData = args.categoriesData ?? '';
        this.shuffleQuestion = args.shuffleQuestion ?? false;

        if (isObject(args.topicSettingId)) {
            this.topicSetting = new TopicSetting(args.topicSettingId);
            this.topicSettingId = this.topicSetting._id;
        } else {
            this.topicSettingId = args.topicSettingId;
        }
    }
}

// function TopicExercise(object) {
//     return {
//         _id: object._id ? object._id : undefined,
//         topicId: object.topicId ? object.topicId : null,
//         questionsNum: object.questionsNum ? object.questionsNum : 0,
//         questionsPlayNum: object.questionsPlayNum ? object.questionsPlayNum : 0,
//         mode: object.mode ? object.mode : 0,//shuffle questions in the categories, fixed questions in a category
//         duration: object.duration ? object.duration : 0,
//         pass: object.pass ? object.pass : 0,
//         replay: object.replay ?? 1,
//         contentType: object.contentType ?? TOPIC_CONTENT_TYPE_CARD,
//         contentInfo: {
//             linkQuestion: object.contentInfo ? object.contentInfo.linkQuestion : '',
//             linkExplanation: object.contentInfo ? object.contentInfo.linkExplanation : '',
//         },
//         pauseTimes: object.pauseTimes ? object.pauseTimes : 0,
//         baremScore: object.baremScore ? object.baremScore : 0,
//         showHighScore: object.showHighScore ? object.showHighScore : 0,
//         showHighScoreTime: object.showHighScoreTime ? object.showHighScoreTime : 0,
//         showResult: object.showResult ? object.showResult : 0,
//         showResultTime: object.showResultTime ? object.showResultTime : 0,
//         settingInfo: object.settingInfo ? object.settingInfo : 0,
//         additionalInfo: object.additionalInfo ? object.additionalInfo : '',
//         categoriesData: object.categoriesData ? object.categoriesData : '',
//     }
// }
export { TopicExercise };
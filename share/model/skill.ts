import { isObject } from '../utils';

export const SkillReviewMode = {
    NONE: 0, // Tu review
    TEXT: 1, // Teacher Review
    AI_CHECK_GRAMMARTICAL_ERRORS: 2, // AI kiểm tra ngữ pháp
    AI_GET_IMPORVING_SUGGESTIONS: 3 // AI gợi ý tối ưu đoạn văn
}
const skillReviewLanguages = [
    "en",
    "vi"
] as const;
export type SkillReviewLanguage = typeof skillReviewLanguages[number];

export interface ISkill {
    _id?: any;
    parentId?: any;
    name?: string;
    tutorial?: string;
    value?: number;
    type?: number;
    examType?: number;
    timeStudy?: number;
    timePrepare?: number;
    gameMode?: number;
    reviewModes?: number[];
    reviewLanguages?: SkillReviewLanguage[];
    audioTutorial?: string;
    childSkills?: Array<ISkill>;
}

export default class Skill implements ISkill {
    _id: any;
    parentId: any;
    name: string;
    tutorial: string;
    value: number;
    type: number;
    examType: number;
    timeStudy: number;
    timePrepare: number;
    gameMode: number;
    childSkills: Array<Skill>;
    parent?: Skill;
    reviewModes?: number[];
    reviewLanguages?: SkillReviewLanguage[];
    audioTutorial?: string;
    constructor(args: ISkill = {}) {
        this._id = args._id ?? undefined;
        this.parentId = args.parentId?._id ?? (args.parentId ?? null);
        this.name = args.name ?? '';
        this.tutorial = args.tutorial ?? '';
        this.value = args.value ?? 0;
        this.type = args.type ?? 0;
        this.examType = args.examType ?? 0;
        this.timeStudy = args.timeStudy ?? 0;
        this.timePrepare = args.timePrepare ?? 0;
        this.gameMode = args.gameMode ?? 0;
        this.childSkills = convertSkillToModel(args.childSkills);
        this.reviewModes = args.reviewModes ?? [SkillReviewMode.TEXT];
        this.reviewLanguages = args.reviewLanguages;
        this.audioTutorial = args.audioTutorial ?? "";
        if (isObject(args.parentId)) this.parent = new Skill(args.parentId);
    }
}

// function SkillModel(object) {
//     let childSkills = convertSkillToModel(object.childSkills)
//     return {
//         _id: object._id ? object._id : '',
//         parentId: object.parentId ? object.parentId : null,
//         name: object.name ? object.name : '',
//         tutorial: object.tutorial ?? '',
//         value: object.value ? object.value : 0,
//         type: object.type ? object.type : 0,
//         timeStudy: object.timeStudy ? object.timeStudy : 0,
//         timePrepare: object.timePrepare ? object.timePrepare : 0,
//         gameMode: object.gameMode ? object.gameMode : 0,
//         childSkills: childSkills
//     }
// }

function convertSkillToModel(datas?: any[]): Skill[] {
    let dataReturns: Skill[] = []
    if (datas && typeof (datas) === 'object') {
        dataReturns = datas.map(e => new Skill(e))
    }
    return dataReturns
}

export { convertSkillToModel }
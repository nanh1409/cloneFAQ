export const SkillReviewMode = {
    NONE: 0, // Tu review
    TEXT: 1, // Teacher Review
    AI_CHECK_GRAMMARTICAL_ERRORS: 2, // AI kiểm tra ngữ pháp
    AI_GET_IMPORVING_SUGGESTIONS: 3 // AI gợi ý tối ưu đoạn văn
}

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
    /** In Second */
    timePrepare: number;
    gameMode: number;
    childSkills: Array<Skill>;
    parent?: Skill;
    reviewModes?: number[];
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
    }
}

function convertSkillToModel(datas?: any[]): Skill[] {
    let dataReturns: Skill[] = []
    if (datas && typeof (datas) === 'object') {
        dataReturns = datas.map(e => new Skill(e))
    }
    return dataReturns
}

export { convertSkillToModel }
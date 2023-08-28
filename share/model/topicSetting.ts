import { EXAM_TYPE_IELTS, TOPIC_SETTING_DEFAULT } from "../constraint"
import { ISkill } from "./skill"

export interface ISkillSettingInfo {
    orderIndex: number,
    skillId: string,
    time: number

    skill?: ISkill
}

export class SkillSettingInfo implements ISkillSettingInfo {
    orderIndex: number
    skillId: string
    time: number

    skill?: ISkill

    constructor(args: any = {}) {
        this.orderIndex = args.orderIndex ?? 0;
        this.skillId = args.skillId ?? null;
        this.time = args.time ?? 0;
    }
}

export interface ITopicSetting {
    _id?: any,
    name?: string,
    skillInfos?: ISkillSettingInfo[] | null,
    examType: number;
    type: number;
}

export class TopicSetting implements ITopicSetting {
    _id: any;
    name: string;
    skillInfos: ISkillSettingInfo[] | null;
    examType: number;
    type: number;


    constructor(args: any = {}) {
        this._id = args._id ?? undefined;
        this.name = args.name ?? '';
        this.skillInfos = args.skillInfos ? args.skillInfos.map(skillInfo => new SkillSettingInfo(skillInfo)) : [];
        this.examType = args.examType ?? EXAM_TYPE_IELTS;
        this.type = args.type ?? TOPIC_SETTING_DEFAULT;
    }
}
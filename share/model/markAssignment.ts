import { MARK_STATUS_INIT } from '../constraint';
import { isObject } from '../utils';
import Skill, { ISkill } from './skill';
import { StudyScoreData } from './studyScoreData';
import { UserInfo } from './user';

export interface IMarkAssignment {
  _id?: any;
  teacherId?: any;
  courseId?: any;
  studyScoreDataId?: any;
  markStatus?: number;
  requestedAt?: number | null;
  markedAt?: number | null;
  acceptedAt?: number | null;
  ratingScore?: number;
  paid?: boolean;
  code?: string;
  isRevoked?: boolean;

  skill?: ISkill | null;
}

export default class MarkAssignment implements IMarkAssignment {
  _id: string | undefined;
  teacherId: string | null;
  courseId: string | null;
  studyScoreDataId: string | null;
  markStatus: number;
  requestedAt: number | null;
  acceptedAt: number | null;
  markedAt: number | null;
  ratingScore: number;
  paid: boolean;
  code: string;
  isRevoked: boolean;

  teacher?: UserInfo;
  studyScoreData?: StudyScoreData;
  skill?: Skill | null;
  constructor(args: IMarkAssignment = {}) {
    this._id = args._id ?? undefined;
    this.teacherId = args.teacherId?._id ?? (args.teacherId ?? null);
    this.courseId = args.courseId ?? null;  
    this.studyScoreDataId = args.studyScoreDataId?._id ?? (args.studyScoreDataId ?? null);
    this.markStatus = args.markStatus ?? MARK_STATUS_INIT;
    this.requestedAt = args.requestedAt ?? null;
    this.acceptedAt = args.acceptedAt ?? null;
    this.markedAt = args.markedAt ?? null;
    this.ratingScore = args.ratingScore ?? 0;
    this.paid = args.paid ?? false;
    this.code = args.code ?? '';
    this.isRevoked = args.isRevoked ?? false;
    
    if (isObject(args.teacherId)) {
      this.teacher = new UserInfo(args.teacherId);
    }
    if (isObject(args.studyScoreDataId)) {
      this.studyScoreData = new StudyScoreData(args.studyScoreDataId);
    }
    if (args.skill) this.skill = new Skill(args.skill);
  }
}

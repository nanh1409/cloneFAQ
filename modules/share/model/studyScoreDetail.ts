import { STUDY_SCORE_DETAIL_NO_STUDY } from "../constraint";
import { isObject } from "../utils";
import { Card, CardGames } from "./card";
import { Course } from "./courses";
import { StudyScoreData } from "./studyScoreData";
import Topic from "./topic";
import { UserInfo } from "./user";

interface IAnswerOptional {
  file?: string[];
  textNote?: string;
  content?: string;
  contentArr?: string[];
  score?: number;
  progress?: number;
  totalTime?: number;
  bandScores?: Array<{ key: string, value: number }>;
  imageFiles?: string[];
  contentMap?: Record<string, string>;
  contentMapTrans?: Record<string, Record<string, string>>;
}

export interface ISelectAnswer {
  answer: number;
  correct: number;
}

class SelectAnswer {
  answer: number;
  correct: number;

  constructor(args: any = {}) {
    this.answer = args.answer ?? -1;
    this.correct = args.correct ?? -1;
  }
}

class AnswerOptional {
  file: string[];
  textNote: string;
  content?: string;
  contentArr?: string[];
  score?: number;
  progress?: number;
  totalTime?: number;
  bandScores?: Array<{ key: string, value: number }>;
  imageFiles?: string[];
  contentMap?: Record<string, string>;
  contentMapTrans?: Record<string, Record<string, string>>;

  constructor(args: IAnswerOptional = {}) {
    this.file = args.file ?? [];
    this.textNote = args.textNote ?? "";
    this.content = args.content ?? "";
    this.contentArr = args.contentArr ?? [];
    this.score = args.score ?? 0;
    this.progress = args.progress;
    this.totalTime = args.totalTime ?? 0;
    this.bandScores = args.bandScores ?? [];
    this.imageFiles = args.imageFiles ?? [];
    this.contentMap = args.contentMap ?? {};
    this.contentMapTrans = args.contentMapTrans ?? {};
  }
}

export interface IStudyScoreDetail {
  _id?: any;
  userId?: any;
  cardId?: any;
  topicId?: any;
  courseId?: any;
  studyScoreDataId?: any;
  answer?: number;
  correct?: number;
  lastUpdate?: number;
  bookmark?: number;
  cardType?: number;
  answerText?: string;
  answerOptional?: IAnswerOptional;
  answerTeacher?: IAnswerOptional;
  answers?: ISelectAnswer[];
  bookmarkAnswers?: number[];
  cardHistory?: number[];
  mockTestId?: string;
  mockTestStudyTime?: number;
  gameType?: CardGames;
  matchGameOrders?: [Array<number>, Array<number>];
  matchAnswers?: Array<[number, number]>;
}

export default class StudyScoreDetail implements IStudyScoreDetail {
  _id: any;
  userId: any;
  cardId: any;
  topicId: any;
  courseId: any;
  studyScoreDataId: any;
  answer: number;
  correct: number;
  lastUpdate: number;
  bookmark: number;
  cardType: number;
  answerText: string;
  answerOptional: IAnswerOptional;
  answerTeacher: IAnswerOptional;
  answers: ISelectAnswer[];
  bookmarkAnswers: number[];
  cardHistory: number[];
  mockTestId?: string;
  mockTestStudyTime?: number;
  gameType?: CardGames;
  matchGameOrders?: [Array<number>, Array<number>];
  matchAnswers?: Array<[number, number]>;

  user?: UserInfo;
  card?: Card;
  topic?: Topic;
  course?: Course;
  studyScoreData?: StudyScoreData;
  constructor(args: IStudyScoreDetail = {}) {
    this._id = args._id ?? undefined;
    this.userId = args.userId?._id ?? args.userId ?? null;
    this.cardId = args.cardId?._id ?? args.cardId ?? null;
    this.topicId = args.topicId?._id ?? args.topicId ?? null;
    this.courseId = args.courseId?._id ?? args.courseId ?? null;
    this.studyScoreDataId =
      args.studyScoreDataId?._id ?? args.studyScoreDataId ?? null;
    this.answer = args.answer ?? -1;
    this.correct = args.correct ?? STUDY_SCORE_DETAIL_NO_STUDY;
    this.lastUpdate = args.lastUpdate ?? Date.now();
    this.bookmark = args.bookmark ?? 0;
    this.cardType = args.cardType ?? 0;
    this.answerText = args.answerText ?? "";
    this.answerOptional = new AnswerOptional(args.answerOptional);
    this.answerTeacher = new AnswerOptional(args.answerTeacher);
    this.bookmarkAnswers = args.bookmarkAnswers ?? [];
    this.answers = args.answers ?? [];
    this.cardHistory = args?.cardHistory ?? [];
    this.mockTestId = args?.mockTestId;
    this.mockTestStudyTime = args?.mockTestStudyTime;
    this.gameType = args?.gameType;
    this.matchGameOrders = args?.matchGameOrders;
    this.matchAnswers = args?.matchAnswers;
    if (this.answer > -1 && this.correct > STUDY_SCORE_DETAIL_NO_STUDY) {
      this.answers.push({
        answer: this.answer,
        correct: this.correct,
      });
    }
    if (isObject(args.userId)) this.user = new UserInfo(args.userId);
    if (isObject(args.cardId)) this.card = new Card(args.cardId);
    if (isObject(args.topicId)) this.topic = new Topic(args.topicId);
    if (isObject(args.courseId)) this.course = new Course(args.courseId);
    if (isObject(args.studyScoreDataId))
      this.studyScoreData = new StudyScoreData(args.studyScoreDataId);
  }
}

function genStudyScoreDetailModel({
  userId = undefined,
  cardId = undefined,
  topicId = undefined,
  studyScoreDataId = undefined,
  courseId = undefined,
  answer = -1,
  correct = STUDY_SCORE_DETAIL_NO_STUDY,
  lastUpdate = Date.now(),
  bookmark = 0,
  cardType = 0,
  answerText = "",
  bookmarkAnswers = [],
}) {
  return {
    userId,
    cardId,
    topicId,
    courseId,
    studyScoreDataId,
    answer,
    correct,
    lastUpdate,
    bookmark,
    cardType,
    answerText,
    bookmarkAnswers,
  };
}

export { genStudyScoreDetailModel };

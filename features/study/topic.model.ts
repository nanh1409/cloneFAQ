import MyCardData from "../../modules/share/model/myCardData";
import Skill from "../../modules/share/model/skill";
import { StudyScore } from "../../modules/share/model/studyScore";
import { StudyScoreData, StudyScoreDataStatistics } from "../../modules/share/model/studyScoreData";
import Topic, { ITopic } from "../../modules/share/model/topic";
import TopicExercise from "../../modules/share/model/topicExercise";
import TopicProgress from "../../modules/share/model/topicProgress";
import { TopicSetting } from "../../modules/share/model/topicSetting";

export class ClientTopicProgress {
  id: string;
  studyTime: number;
  topicId: string;
  skillId: string;
  userId: string;
  progress: number;
  score: number;
  status: number;
  totalCardNum: number;
  correctNum: number;
  incorrectNum: number;
  totalTime: number;
  cardOrder: string[];
  boxCard: {
    [cardId: string]: number;
  };
  cardBookmarks: string[];
  simulationMode?: boolean;
  lastUpdate?: number;
  constructor(args: Partial<ClientTopicProgress> = {}) {
    [
      "studyTime",
      "topicId",
      "skillId",
      "userId",
      "progress",
      "score",
      "status",
      "totalCardNum",
      "correctNum",
      "incorrectNum",
      "cardOrder",
      "boxCard",
      "cardBookmarks",
      "totalTime",
      "simulationMode",
      "lastUpdate"
    ].forEach((key) => {
      if (args.hasOwnProperty(key)) this[key] = args[key];
      this.id = `${args.topicId}${args.skillId ? `_${args.skillId}` : ''}`;
    });
  }

  static clone(args: ClientTopicProgress) {
    return new ClientTopicProgress({ ...args });
  }

  static fromServerTopicProgress(args: TopicProgress & { score?: number; totalTime?: number; correctNum?: number; incorrectNum?: number; }) {
    const clientTopicProgress = new ClientTopicProgress({
      topicId: args.topicId, status: args.status, progress: args.progress, userId: args.userId, score: args.score, totalTime: args.totalTime,
      correctNum: args.correctNum, incorrectNum: args.incorrectNum,
      lastUpdate: args.lastUpdate
    });
    return clientTopicProgress;
  }

  static fromServerStudyScore(args: StudyScore & { myCardData?: MyCardData }) {
    const studyData = args.studyScoreData;
    const clientTopicProgress = new ClientTopicProgress({
      topicId: args.topicId, status: args.status, progress: args.progress, userId: args.userId,
      cardOrder: studyData?.shuffleQuestionOrder ?? [],
      correctNum: studyData?.correctNum, incorrectNum: studyData?.incorrectNum, totalCardNum: studyData?.totalCardNum,
      studyTime: studyData?.studyTime,
      boxCard: args.myCardData?.boxCard ?? {},
      cardBookmarks: args.myCardData?.cardBookmarks ?? [],
      score: args.score,
      totalTime: args.totalTime,
      lastUpdate: args.lastUpdate
      // skillId: studyData?.skillId,
    });
    return clientTopicProgress;
  }

  static fromServerStudyScoreData(args: StudyScoreData) {
    const clientTopicProgress = new ClientTopicProgress({
      topicId: args.topicId, status: args.status, progress: 100 * (args.correctNum || 0) / (args.totalCardNum || 1), userId: args.userId,
      cardOrder: args.shuffleQuestionOrder ?? [],
      correctNum: args.correctNum, incorrectNum: args.incorrectNum, totalCardNum: args.totalCardNum,
      studyTime: args.studyTime,
      score: args.score,
      totalTime: args.totalTime,
      skillId: args.skillId,
      lastUpdate: args.lastUpdate
    });
    return clientTopicProgress;
  }

  setProgress(progress: number) {
    this.progress = progress;
  }
  setScore(score: number) {
    this.score = score;
  }
  setQuestionStats(args: {
    totalQuestions?: number;
    totalCorrect?: number;
    totalIncorrect?: number;
  }) {
    if (typeof args.totalQuestions !== "undefined") {
      this.totalCardNum = args.totalQuestions;
    }
    if (typeof args.totalCorrect !== "undefined") {
      this.correctNum = args.totalCorrect;
    }
    if (typeof args.totalIncorrect !== "undefined") {
      this.incorrectNum = args.totalIncorrect;
    }
  }
  setCardOrder(cardOrder: string[]) {
    this.cardOrder = cardOrder;
  }

  setStatus(status: number) {
    this.status = status;
  }

  increaseStudyTime() {
    this.studyTime = (this.studyTime || 0) + 1;
  }

  setUserId(userId: string) {
    this.userId = userId;
  }

  setStudyData(args: Partial<Omit<ClientTopicProgress,
    "studyTime" | "topicId" | "userId" | "id" | "skillId" |
    "setProgress" | "setScore" | "setQuestionStats" | "setCardOrder" | "setStatus" | "increaseStudyTime" | "setStudyData" | "setTotalTime" | "setUserId"
  >>) {
    [
      "progress",
      "score",
      "status",
      "totalCardNum",
      "correctNum",
      "incorrectNum",
      "cardOrder",
      "boxCard"
    ].forEach((key) => {
      if (args.hasOwnProperty(key) && typeof args[key] !== "undefined") this[key] = args[key];
    })
  }

  setTotalTime(second: number) {
    this.totalTime = second;
  }
}

export type CreateAppPracticeDataArgs = Partial<Pick<
  ClientTopicProgress,
  "userId" | "topicId" | "cardOrder" | "studyTime" | "skillId"
>> & { courseId?: string; parentId?: string; gameType?: number }

export type UpdateAppPracticeDataArgs = {
  studyScoreId?: string;
  studyScoreDataId?: string;
  topicProgressId?: string;
  progress?: number;
  totalCorrect?: number;
  totalIncorrect?: number;
  totalQuestions?: number;
  cardOrder?: string[];
  studyTime?: number;
  status?: number;
  totalTime?: number;
  score?: number;
  isSkillBasedExam?: boolean;
  isFinalGame?: boolean;
  rootProgress?: number;
  statistics?: Partial<StudyScoreDataStatistics>;
}

export type CreateSkillGameArgs = {
  studyScoreId?: string;
  userId: string;
  courseId: string;
  topicId: string;
  skillId: string;
  studyTime?: number;
}

export type OffsetTopicsByParentIdArgs = {
  parentId: string | null;
  courseId: string;
  field?: keyof ITopic;
  limit?: number;
  asc?: boolean;
  skip?: number;
  userId?: string;
  private?: boolean;
  topicTypes?: number[];
  topicFields?: Array<keyof Topic>;
  exerciseFields?: Array<keyof TopicExercise>;
  serverSide?: boolean;
}

export type GetTopicsByParentSlugArgs = {
  courseId: string;
  field?: keyof ITopic;
  asc?: boolean;
  baseSlug?: string;
  slug: string | string[];
  skip?: number;
  limit?: number;
  topicFields?: Array<keyof Topic>;
  exerciseFields?: Array<keyof TopicExercise>;
  topicTypes?: number[];
  local?: boolean;
  countPracticedUsers?:boolean
}

export type GetTopicsBySlugsArgs = {
  courseId: string;
  slug: string | string[];
  topicFields?: Array<keyof Topic>;
  exerciseFields?: Array<keyof TopicExercise>;
  local?: boolean;
}

export type _TopicSetting = TopicSetting & {
  skills?: Skill[];
  mapCardNumSkillType?: {
    [skillType: number]: number;
  }
}

export type TopicWithUser = Topic & {
  countPracticedUsers?: number
}
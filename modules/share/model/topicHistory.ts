import { GAME_TYPE_PRACTICE } from "../constraint";

export enum LearningEvent {
  /** Start Practice, Start or Continue Test */
  start_learning,
  finish_learning,
  replay
}

export default class TopicHistory {
  _id?: string;
  courseId: string | null;
  topicId: string | null;
  account: string;
  /** Percent */
  progress?: number;
  score?: number;
  correct?: number;
  /**
   * Total Answered
   */
  total?: number;
  /**
   * Time Played, in second
   */
  totalTime?: number;
  boxCard?: {
    [cardId: string]: number;
  }
  lastUpdate: number;
  gameType: number;
  event?: LearningEvent;
  constructor(args: Partial<TopicHistory> = {}) {
    this._id = args._id;
    this.courseId = args.courseId ?? null;
    this.topicId = args.topicId ?? null;
    this.account = args.account ?? "";
    this.progress = args.progress;
    this.score = args.score;
    this.correct = args.correct;
    this.total = args.total;
    this.totalTime = args.totalTime;
    this.boxCard = args.boxCard;
    this.lastUpdate = args.lastUpdate ?? 0;
    this.gameType = args.gameType ?? GAME_TYPE_PRACTICE;
    this.event = args.event;
  }
}
import { BAREM_SCORE_DEFAULT } from "../constraint";

export class MockTestStudyInfo {
  studyTime: number;
  correctNum: number;
  totalCardNum: number
  score: number;
  status: number;
  totalTime: number;
  constructor (args: any = {}) {
    this.studyTime = args.studyTime ?? 0;
    this.correctNum = args.correctNum ?? 0;
    this.totalCardNum = args.totalCardNum ?? 0
    this.score = args.score ?? 0;
    this.status = args.status ?? 0;
    this.totalTime = args.totalTime ?? 0;
  }
}

export default class MockTest {
  _id: string | undefined;
  /**
   * Owner's ID
   */
  userId: string | null;
  /**
   * Lib Course's ID
   */
  courseId: string | null;
  /**
   * Mock Test title
   */
  title: string;
  /**
   * Mock Test description
   */
  description: string | undefined;
  /**
   * Cards list (ordered)
   */
  cardIds: Array<string>;
  /**
   * Duration of the test, in `minutes`
   */
  duration: number;
  pauseTimes: number;
  replay: number;
  /**
   * Point to pass
   */
  pass: number;
  createdAt: number;
  baremScore: number;
  questionsNum: number;
  /**
   * Root Lib Topic's ID
   */
  parentId: string | null;
  updatedAt: number;
  studyInfo: MockTestStudyInfo | undefined;

  constructor(args: any = {}) {
    this._id = args._id;
    this.userId = args.userId ?? null;
    this.courseId = args.courseId ?? null;
    this.title = args.title ?? '';
    this.description = args.description;
    this.cardIds = args.cardIds ?? [];
    this.duration = args.duration ?? 0;
    this.pauseTimes = args.pauseTimes ?? 0;
    this.replay = args.replay ?? 0;
    this.pass = args.pass ?? 0;
    this.createdAt = args.createdAt ?? 0;
    this.baremScore = args.baremScore ?? BAREM_SCORE_DEFAULT;
    this.questionsNum = args.questionsNum ?? 0;
    this.parentId = args.parentId ?? null;
    this.updatedAt = args.updatedAt ?? 0;
    this.studyInfo = args.studyInfo ? new MockTestStudyInfo(args.studyInfo) : undefined;
  }
}

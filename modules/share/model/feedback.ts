import { FeedbackTypes, STATUS_PUBLIC } from "../constraint";

export default class Feedback {
  _id: string | undefined;
  courseId: string | null;
  userId: string | null;
  /**
   * Feedback from: Android, iOS, Web
   */
  sourceName: string;
  /**
   * 11.0, 15.0.1, ...
   */
  sourceNum: string;
  /**
   * App: `<major>.<minor>.<patch>`, Web: `<release>`
   */
  version: string;
  /**
   * Version's Code
   */
  versionCode: string;
  /**
   * Card, Topic, Comment
   */
  tableName: string;
  /**
   * Reference ID
   */
  tableId: string;
  staffId: string | null;
  content: string | null;
  /**
   * Screenshot URL
   */
  screenshot: string | null;
  /** Report from WEB LINK */
  link?: string;
  tags: number[];
  createdDate: number;
  lastUpdate: number;
  status: number;
  /**
   * Waiting: 0,
   * Progress: 1,
   * Done: 2
   */
  type: number;
  constructor(args: any = {}) {
    this._id = args._id ?? undefined;
    this.courseId = args.courseId ?? null;``
    this.userId = args.userId?._id ?? (args.userId ?? null);
    this.sourceName = args.sourceName ?? '';
    this.sourceNum = args.sourceNum ?? '';
    this.version = args.version ?? '';
    this.versionCode = args.versionCode ?? '';
    this.tableName = args.tableName ?? '';
    this.tableId = args.tableId ?? '';
    this.staffId = args.staffId ?? null;
    this.content = args.content ?? '';
    this.screenshot = args.screenshot ?? '';
    this.link = args.link;
    this.tags = args.tags ?? [];
    this.createdDate = args.createdDate ?? 0;
    this.lastUpdate = args.lastUpdate ?? 0;
    this.status = args.status ?? STATUS_PUBLIC;
    this.type = args.type ?? FeedbackTypes.WAITING;
  }
}

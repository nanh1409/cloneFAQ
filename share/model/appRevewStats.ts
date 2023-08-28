export default class AppReviewStats {
  _id: string | undefined;
  appId: string | null;
  userId: string | null;
  platform: string;
  totalShow: number;
  cancelClick: number;
  rateLaterClick: number;
  remindNumber: number;
  stars: number;
  note: number;
  createdDate: number;
  lastUpdate: number;
  constructor(args?: any) {
    if (!args) {
      args = {}
    }
    this._id = args._id ?? undefined;
    this.userId = args.userId?._id ?? (args.userId ?? null)
    this.createdDate = args.createdDate ?? Date.now();
    this.lastUpdate = args.lastUpdate ?? Date.now();
    this.appId = args.appId?.appId ?? (args.appId ?? null)
    this.platform = args.platform ?? '';
    this.totalShow = args.totalShow ?? 1;
    this.cancelClick = args.cancelClick ?? 0;
    this.rateLaterClick = args.rateLaterClick ?? 0;
    this.remindNumber = args.remindNumber ?? 0;
    this.stars = args.stars ?? 0;
    this.note = args.note ?? '';
  }
}
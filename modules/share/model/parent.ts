import { STATUS_PUBLIC } from "../constraint";
import { isObject } from "../utils";
import { UserInfo } from "./user";

class Parent {
  _id: string | undefined;
  userId: string | null;
  user: UserInfo | null;
  childId: string | null;
  child: UserInfo;
  lastUpdate: number;
  createdDate: number;
  status: number;
  type: number;

  constructor(args: any = {}) {
    this._id = args._id?._id ?? args._id ?? undefined;
    this.userId = args.userId?._id ?? args.userId ?? null;
    this.type = args.type ?? 0;
    this.createdDate = args.createdDate ?? 0;
    this.lastUpdate = args.lastUpdate ?? 0;
    this.childId = args.childId?._id ?? args.childId ?? null;
    this.status = args.status ?? STATUS_PUBLIC;
    if (isObject(args.userId)) {
      this.user = new UserInfo(args.userId);
    }
    if (isObject(args.childId)) {
      this.child = new UserInfo(args.childId);
    }
  }
}

export { Parent };

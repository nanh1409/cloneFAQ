import { STATUS_PUBLIC } from "../constraint";
import { isObject } from "../utils";
import { UserInfo } from "./user";

class ParentInfo {
  _id: string | undefined;
  userId: string | null;
  user: UserInfo | null;
  childId: string | null;
  child: UserInfo;
  lastUpdate: number;
  createdDate: number;
  status: number;
  type: number;
  name: string;
  phoneNum: string;
  address: string;
  source: number;
  info: string;
  infoObject: Object

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
    this.name = args.name ?? "";
    this.phoneNum = args.phoneNum ?? "";
    this.address = args.address ?? "";
    this.source = args.source ?? -1;
    this.info = args.info ?? JSON.stringify({});
    try {
        this.infoObject = JSON.parse(this.info);
    } catch (error) {
        
    }
  }
}

export { ParentInfo  };

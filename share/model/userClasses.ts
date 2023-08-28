import { ClassesManagerConfig } from "../classes_manager_utils/config";
import { STATUS_PUBLIC } from "../constraint";
import { isObject } from "../utils";
import { Classes } from "./classes";
import { ParentInfo } from "./parentInfo";
import { UserInfo } from "./user";
import { UserAdditionalInfo } from "./userAdditionalInfo";

class UserClasses {
  _id: string | undefined;
  classesId: string | null;
  userId: string | null;
  user: UserInfo | null;
  classes: Classes | null;
  joinDate: number;
  expriedDate: number;
  endDate: number;
  status: number;
  studyStatus: number
  constructor(args: any = {}) {
    this._id = args._id?._id ?? args._id ?? undefined;
    this.userId = args.userId?._id ?? args.userId ?? null;
    this.classesId = args.classesId?._id ?? args.classesId ?? null;
    this.joinDate = args.joinDate ?? 0;
    this.expriedDate = args.expriedDate ?? 0;
    this.endDate = args.endDate ?? 0;
    this.studyStatus = args.studyStatus ?? ClassesManagerConfig.USER_CLASSES_TYPE_STUDY_WAITTING_PURCHASE
    this.status = args.status ?? STATUS_PUBLIC;
    if (isObject(args.userId)) {
      this.user = new UserInfo(args.userId);
    }
    if (isObject(args.classesId)) {
      this.classes = new Classes(args.classesId);
    }
    if (args.user) {
      this.user = args.user;
    }
    if (args.classes) {
      this.classes = args.classes;
    }
  }
}

class UserProfileClasses extends UserClasses {
  userInfoAdditional: UserAdditionalInfo | null;
  parentInfo: ParentInfo | null;
  constructor(args: any = {}) {
    super(args);
    this.userInfoAdditional = args.userInfoAdditional ?? null;
    this.parentInfo = args.parentInfo ?? null;
  }

}

export { UserClasses, UserProfileClasses };
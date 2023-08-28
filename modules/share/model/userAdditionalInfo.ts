import { UserInfo } from "./user";
import { isObject } from "../utils";

class UserAdditionalInfo {
    _id: string | undefined;
    userId: string | null;
    user: UserInfo | null;
    createdDate: number;
    info: string;
    infoObject: Object | null;
    constructor(args?: any) {
        if (!args) {
            args = {}
        }
        this._id = args._id ?? undefined;
        this.userId = args.userId ? `${args.userId}` : null;
        if (isObject(args.userId)) {
            this.user = new UserInfo(args.userId);
        }
        this.createdDate = args.createdDate ?? Date.now();
        if (!args.info) {
            this.info = JSON.stringify({});
        } else this.info = args.info;
        try {
            this.infoObject = JSON.parse(this.info)
        } catch (error) {

        }
    }

}
export { UserAdditionalInfo }
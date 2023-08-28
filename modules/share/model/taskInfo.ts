import { isObject } from "../utils";
import { UserInfo } from "./user";

class TaskInfo {
    _id: string | undefined;
    name: string;
    userId: string;
    user: UserInfo | null;
    status: number;
    lastUpdate: number;

    constructor(object: any = {}) {
        this._id = object._id ? object._id : undefined;
        this.name = object.name ? object.name : '';
        this.status = object.status ? object.status : 0;
        this.lastUpdate = object.lastUpdate ? object.lastUpdate : 0;
        this.userId = object.userId?._id ?? (object.userId ?? null);
        if (isObject(object.userId)) {
            this.user = new UserInfo(object.userId);
        }
    }
}
export { TaskInfo }
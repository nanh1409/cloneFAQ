import { isObject } from "../utils";
import { UserInfo } from "./user";

class MailHistory {
    _id: string | undefined;
    sender_id: string;
    fromEmail: string
    toEmail: string
    title: string
    content: string
    status: number
    createdDate: number;
    sender: UserInfo
    constructor(args: any = {}) {
        this._id = args._id ?? undefined;
        this.sender_id = args.sender_id?._id ?? (args.sender_id ?? null);
        this.fromEmail = args.fromEmail ?? '';
        this.toEmail = args.toEmail ?? ''
        this.title = args.title ?? ''
        this.content = args.content ?? ''
        this.status = args.status ?? 0;
        this.createdDate = args.createdDate ?? 0
        if (isObject(args.sender_id)) {
            this.sender = new UserInfo(args.sender_id);
        }

    }
}
export { MailHistory }
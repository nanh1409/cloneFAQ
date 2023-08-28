import { STATUS_PUBLIC } from "../constraint";
import { isObject } from "../utils";
import { UserInfo } from "./user";
import Document from './document';
class DocumentTempUser {
    _id: string | undefined;
    userId: string | null;
    approverId: string | null;
    createDate: number;
    documentId: string | null;
    currentStatus: number = 0; // Config.DOCUMENT_NOT_APPROVE
    status: number;
    reason: string;
    user?: UserInfo;
    approver?: UserInfo;
    document?: Document;
    constructor(args?: any) {
        if (!args) {
            args = {}
        }
        this._id = args._id ?? undefined;
        this.userId = args.userId?._id ?? (args.userId ?? null);
        this.approverId = args.approverId?._id ?? (args.approverId ?? null);
        this.documentId = args.documentId?._id ?? (args.documentId ?? null);
        this.createDate = args.createDate ?? Date.now();
        this.status = args.status ?? STATUS_PUBLIC;
        this.currentStatus = args.currentStatus ?? 0;
        this.reason = args.reason ?? '';
        if (isObject(args.userId)) {
            this.user = new UserInfo(args.userId);
        }
        if (isObject(args.approverId)) {
            this.approver = new UserInfo(args.approverId);
        }
        if (isObject(args.documentId)) {
            this.document = new Document(args.documentId);
        }
    }
}
export { DocumentTempUser }

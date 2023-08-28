import Discussion, { IDiscussion } from "../../modules/share/model/discussion";
import { UserInfo } from "../../modules/share/model/user";

export class ClientComment extends Discussion {
  totalReplies: number | null;
  childComments: ClientComment[];
  constructor(args: IDiscussion & { user?: UserInfo, totalReplies?: number, childComments?: ClientComment[] }) {
    super(args);
    this.user = args.user ?? null;
    this.totalReplies = args.totalReplies ?? 0;
    this.childComments = args.childComments ?? [];
  }
}
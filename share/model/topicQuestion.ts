import { STATUS_PUBLIC } from "../constraint";

class TopicQuestion {
  _id: string | undefined;
  topicId: string | null;
  cardId: string | null;
  stateId: string | null;
  status: number;
  constructor(args?: any) {
    if (!args) {
      args = {}
    }
    this._id = args._id ?? undefined;
    this.cardId = args.cardId?._id ?? (args.cardId ?? null);
    this.topicId = args.topicId?._id ?? (args.topicId ?? null);
    this.status = args.status ?? STATUS_PUBLIC;
    this.stateId = args.stateId?._id ?? (args.stateId ?? null);
  }
}

export { TopicQuestion }
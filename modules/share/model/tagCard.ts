import { STATUS_PUBLIC } from "../constraint";

export interface ITagCard {
  _id?: any;
  tagId?: any;
  cardId?: any;
  status?: number;
}

export class TagCard implements ITagCard {
  _id: string | undefined;
  tagId: string;
  cardId: string;
  status: number;

  constructor(args: any = {}) {
    this._id = args._id ?? undefined;
    this.tagId = args.courseId ?? '';
    this.cardId = args.parentId ?? '';
    this.status = args.status ?? STATUS_PUBLIC;
  }
}
import { STATUS_PUBLIC } from "../constraint";

export interface ITag {
  _id?: any;
  courseId?: any;
  parentId?: any;
  name?: string;
  value?: string;
  status?: number;
}

export class Tag implements ITag {
  _id: string | undefined;
  courseId: string | null;
  parentId: string | null;
  name: string;
  value: string;
  status: number;

  constructor(args: any = {}) {
    this._id = args._id ?? undefined;
    this.courseId = args.courseId ?? null;
    this.parentId = args.parentId ?? null;
    this.name = args.name ?? '';
    this.value = args.value ?? '';
    this.status = args.status ?? STATUS_PUBLIC;
  }
}
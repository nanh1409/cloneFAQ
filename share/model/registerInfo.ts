import { STATUS_PUBLIC } from '../constraint';

export interface IRegisterInfo {
  _id?: any;
  phone?: string;
  name?: string;
  email?: string;
  createdAt?: number;
  status?: number;
  sourceUrl?: string;
  courses?: string[];
}

export class RegisterInfo {
  _id: string | undefined;
  phone: string;
  name: string;
  email: string;
  createdAt: number | null;
  status: number;
  sourceUrl: string;
  courses: string[];

  constructor(args: any = {}) {
    this._id = args._id ?? undefined;
    this.phone = args.phone ?? '';
    this.name = args.name ?? '';
    this.email = args.email ?? '';
    this.createdAt = args.createdAt ?? null;
    this.status = args.status ?? STATUS_PUBLIC;
    this.sourceUrl = args.sourceUrl ?? '';
    this.courses = args.courses ?? [];
  }
}

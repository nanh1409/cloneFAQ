export interface IUserData {
  _id: any;
  otherId: string;

  userName?: string;
}

export class UserData implements IUserData {
  _id: any;
  otherId: string;

  userName?: string;

  constructor(args: any = {}) {
    this._id = args._id ?? undefined;
    this.otherId = args.otherId ?? null;
  }
}

export default class UserApp {
  _id?: string;
  userId: string;
  appId: string;
  localRegisterTime?: number;

  constructor(args: Partial<UserApp> = {}) {
    this._id = args._id;
    this.userId = args.userId!;
    this.appId = args.appId!;
    this.localRegisterTime = args.localRegisterTime;
  }
}
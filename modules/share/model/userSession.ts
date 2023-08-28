export class UserSession {
  /**
   * Session's ID
   */
  _id: string | undefined;
  /**
   * User's ID
   */
  userId: string | null;
  /**
   * Login Token
   */
  token: string;
  /**
   * Login Time
   */
  createdAt: Date;
  updatedAt: Date;

  constructor(args: any = {}) {
    this._id = args?._id ?? undefined;
    this.userId = args?.userId ?? null;
    this.token = args?.token ?? '';
    this.createdAt = args?.createdAt;
    this.updatedAt = args?.updatedAt;
  }
}
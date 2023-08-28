export interface IMarkAssignmentWallet {
  /**
   * Wallet's ID
   */
  _id?: any;
  /**
   * User's ID
   */
  userId?: any;
  /**
   * Remaining quantities
   */
  quantities?: number;
}

export default class MarkAssignmentWallet implements IMarkAssignmentWallet {
  _id: string | undefined;
  userId: string | null;
  quantities: number;

  constructor(args: IMarkAssignmentWallet = {}) {
    this._id = args._id ?? undefined;
    this.userId = args.userId ?? null;
    this.quantities = args.quantities ?? 0
  }
}

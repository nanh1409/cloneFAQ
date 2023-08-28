
export interface IMarkAssignmentCombo {
  /**
   * Combo's ID
   */
  _id?: any;

  code?: string;
  /**
   * Combo's name
   */

  name?: string;
  /**
   * Number of assignments on a combo
   */
  quantities?: number;
  /**
   * Combo's price (in VND)
   */
  price?: number;
  /**
   * Combo's description
   */
  description?: string;
  /**
   * Combo's discount (in VND)
   */
  discount?: number;
  /**
   * Discount in percent
   */
  discountPercent?: number;
}

export default class MarkAssignmentCombo implements IMarkAssignmentCombo {
  _id: string | undefined;
  name: string;
  quantities: number;
  price: number;
  description: string;
  code: string;
  discount: number;
  discountPercent: number;

  constructor(args: IMarkAssignmentCombo = {}) {
    this._id = args._id ?? undefined;
    this.name = args.name ?? '';
    this.quantities = args.quantities ?? 0;
    this.price = args.price ?? 0;
    this.description = args?.description ?? '';
    this.code = args?.code ?? '';
    this.discount = args?.discount ?? 0;
    this.discountPercent = args?.discountPercent ?? 0;
  }
}

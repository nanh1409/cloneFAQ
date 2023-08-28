interface IWebMenuItem {
  /**
   * Menu Item ID
   */
  _id?: any;
  /**
   * Menu Item Title
   */
  title?: string;
  /**
   * Menu Item URL, full URL or relative URL
   */
  url?: string;
  /**
   * Menu Item ID, `null` for root item
   */
  parentId?: any;
  /**
   * Menu Item order Index
   */
  index?: number;
}

export class WebMenuItem implements IWebMenuItem {
  _id?: string;
  title?: string;
  url?: string;
  parentId?: string | null;
  index?: number;

  constructor(args: IWebMenuItem = {}) {
    this._id = args._id;
    this.title = args.title;
    this.url = args.url;
    this.parentId = args.parentId;
    this.index = args.index;
  }
}

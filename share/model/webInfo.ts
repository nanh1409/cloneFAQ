export interface IWebInfo {
  _id?: any;
  name?: string;
  description?: string;
  contactInfo?: string;
  email?: string;
  hotLine?: string;
  webLogo?: string;
  address?: string;
  favicon?: string;
  paymentInfo?: string;
  headerScript?: string;
  bodyScript?: string;
}

export default class WebInfo implements IWebInfo {
  _id: any;
  name: string;
  description: string;
  contactInfo: string;
  email: string;
  hotLine: string;
  webLogo: string;
  address: string;
  favicon: string;
  paymentInfo: string;
  headerScript: string;
  bodyScript: string;
  constructor(args: IWebInfo = {}) {
    this._id = args._id ?? undefined;
    this.name = args.name ?? '';
    this.description = args.description ?? '';
    this.contactInfo = args.contactInfo ?? '';
    this.email = args.email ?? '';
    this.hotLine = args.hotLine ?? '';
    this.webLogo = args.webLogo ?? '';
    this.address = args.address ?? '';
    this.favicon = args.favicon ?? '';
    this.paymentInfo = args.paymentInfo ?? '';
    this.headerScript = args.headerScript ?? '';
    this.bodyScript = args.bodyScript ?? '';
  }
}
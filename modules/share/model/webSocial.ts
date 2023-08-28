export interface IWebSocial {
  _id?: any;
  facebookId?: string;
  fanPage?: string;
  youtube?: string;
  googleKeySign?: string;
  gaId?: string;
  talkToChat?: string;
}

export default class WebSocial implements IWebSocial {
  _id: any;
  facebookId: string;
  fanPage: string;
  youtube: string;
  googleKeySign: string;
  gaId: string;
  talkToChat: string;
  constructor(args: IWebSocial = {}) {
    this._id = args._id ?? undefined;
    this.facebookId = args.facebookId ?? '';
    this.fanPage = args.fanPage ?? '';
    this.youtube = args.youtube ?? '';
    this.googleKeySign = args.googleKeySign ?? '';
    this.gaId = args.gaId ?? '';
    this.talkToChat = args.talkToChat ?? '';
  }
}
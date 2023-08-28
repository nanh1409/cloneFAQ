import { STATUS_PUBLIC } from "../constraint";

export default class AppSetting {
  _id: string | undefined;
  favicon: string;
  title: string;
  description: string;
  keywords: string;
  appLogo: string;
  appName: string;
  bucket: string;
  linkGooglePlay: string;
  linkAppStore: string;
  dynamicLinkGooglePlay: string;
  dynamicLinkAppStore: string;
  status: number;
  siteAddress: string;
  faqCourseId: string;
  courseIds?: string[];
  ga?: string;
  ua?: string;
  gtm?: string;
  dmcaScript?: string;
  googleAdsClient?: string;
  adsTxt?: string;
  syncDb: number;
  usingGetPro: boolean;
  // Super WEB
  isSuperApp?: boolean;
  categories?: Array<{
    _id?: string;
    name: string;
    description?: string;
    avatar?: string;
  }>;
  appList?: Array<{
    appId?: string;
    categoryId?: string;
  }>;

  constructor(args: any = {}) {
    this._id = args?._id;
    this.favicon = args?.favicon;
    this.title = args?.title;
    this.description = args?.description;
    this.keywords = args?.keywords;
    this.appLogo = args?.appLogo;
    this.appName = args?.appName;
    this.bucket = args?.bucket;
    this.linkGooglePlay = args?.linkGooglePlay;
    this.linkAppStore = args?.linkAppStore;
    this.dynamicLinkGooglePlay = args?.dynamicLinkGooglePlay;
    this.dynamicLinkAppStore = args?.dynamicLinkAppStore;
    this.status = args?.status ?? STATUS_PUBLIC;
    this.siteAddress = args?.siteAddress;
    this.faqCourseId = args?.faqCourseId;
    this.courseIds = args?.courseIds;
    this.ga = args?.ga;
    this.ua = args?.ua;
    this.gtm = args?.gtm;
    this.dmcaScript = args?.dmcaScript;
    this.googleAdsClient = args?.googleAdsClient;
    this.adsTxt = args?.adsTxt;
    this.isSuperApp = args?.isSuperApp;
    this.syncDb = args?.syncDb;
    this.usingGetPro = args.usingGetPro;
    this.categories = args.categories;
    this.appList = args.appList;
  }
}
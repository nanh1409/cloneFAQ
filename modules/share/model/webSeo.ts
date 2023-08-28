import { META_ROBOT_INDEX_FOLLOW } from "../constraint";

export interface IWebSeo {
  _id?: any;
  slug?: string;
  seoTitle?: string;
  descriptionSeo?: string;
  keyword?: string;
  imageSharing?: string;
  imageSharingMeta?: {
    title?: string;
    alt?: string;
    caption?: string;
    description?: string;
  };
  headerScript?: string;
  bodyScript?: string;
  metaRobot?: number;
  titleH1?: string;
  appId?: string;
  summary?: string;
  content?: string;
  jsonLd?: string[];
}

export default class WebSeo implements IWebSeo {
  _id: any;
  slug: string;
  seoTitle: string;
  descriptionSeo: string;
  keyword: string;
  imageSharing: string;
  imageSharingMeta: {
    title: string;
    alt: string;
    caption: string;
    description: string;
  };
  headerScript: string;
  bodyScript: string;
  metaRobot: number;
  titleH1: string;
  appId: string;
  summary: string;
  content: string;
  jsonLd: string[];
  constructor(args: any = {}) {
    this._id = args?._id;
    this.slug = args?.slug;
    this.seoTitle = args?.seoTitle;
    this.descriptionSeo = args?.descriptionSeo;
    this.keyword = args?.keyword;
    this.imageSharing = args?.imageSharing;
    this.imageSharingMeta = args?.imageSharingMeta;
    this.headerScript = args?.headerScript;
    this.bodyScript = args?.bodyScript;
    this.metaRobot = args?.metaRobot ?? META_ROBOT_INDEX_FOLLOW;
    this.titleH1 = args?.titleH1;
    this.appId = args?.appId;
    this.summary = args?.summary;
    this.content = args?.content;
    this.jsonLd = args?.jsonLd;
  }
}
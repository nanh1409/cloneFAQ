import { META_ROBOT_INDEX_FOLLOW } from "../constraint";
import { isObject } from '../utils';
import { UserInfo } from './user';

export interface INews {
    _id?: any;
    title?: string;
    h1Title?: string;
    description?: string;
    content?: string;
    slug?: string;
    keyWord?: string;
    avatarUrl?: string;
    avatarAlt?: string;
    avatarTitle?: string;
    lastUpdate?: number;
    createDate?: number;
    publishAt?: number;
    status?: number;
    type?: number;
    ownId?: any;
    video?: string;
    urlRedirect?: string;
    metaRobot?: number;
    summary?: string;
}

export default class News implements INews {
    _id: any;
    title: string;
    h1Title: string;
    description: string;
    content: string;
    slug: string;
    keyWord: string;
    avatarUrl: string;
    avatarAlt: string;
    avatarTitle: string;
    lastUpdate: number;
    createDate: number;
    publishAt?: number;
    status: number;
    type: number;
    ownId: any;
    video: string;
    urlRedirect: string;
    metaRobot: number;
    summary: string;
    owner?: UserInfo;
    constructor(args: INews = {}) {
        this._id = args._id ?? undefined;
        this.title = args.title ?? '';
        this.h1Title = args.h1Title ?? '';
        this.description = args.description ?? '';
        this.content = args.content ?? '';
        this.slug = args.slug ?? '';
        this.keyWord = args.keyWord ?? '';
        this.avatarUrl = args.avatarUrl ?? '';
        this.avatarAlt = args.avatarAlt ?? '';
        this.avatarTitle = args.avatarTitle ?? '';
        this.lastUpdate = args.lastUpdate ?? 0;
        this.createDate = args.createDate ?? 0;
        this.publishAt = args.publishAt;
        this.status = args.status ?? 0;
        this.type = args.type ?? 0;
        this.ownId = args.ownId?._id ?? (args.ownId ?? null);
        this.video = args.video ?? '';
        this.urlRedirect = args.urlRedirect ?? '';
        this.metaRobot = args.metaRobot ?? META_ROBOT_INDEX_FOLLOW;
        this.summary = args.summary ?? '';
        if (isObject(args.ownId)) this.owner = new UserInfo(args.ownId);
    }
}

function NewsModel(object) {
    return {
        _id: object._id ? object._id : '',
        title: object.title ? object.title : '',
        description: object.description ? object.description : '',
        content: object.content ? object.content : '',
        slug: object.slug ? object.slug : '',
        keyWord: object.keyWord ? object.keyWord : '',
        avatarUrl: object.avatarUrl ? object.avatarUrl : '',
        lastUpdate: object.lastUpdate ? object.lastUpdate : 0,
        createDate: object.createDate ? object.createDate : 0,
        status: object.status ?? 0,
        type: object.type ?? 0,
        ownId: object.ownId ? object.ownId : '',
        video: object.video ? object.video : '',
        urlRedirect: object.urlRedirect ? object.urlRedirect : '',
    }
}

function convertJsonToNewsModel(newsData?: any[]): News[] {
    let dataReturns: News[] = []
    if (newsData && newsData.length > 0) {
        newsData.map(e => {
            dataReturns.push(new News(e))
        })
    }
    return dataReturns
}

export { NewsModel, convertJsonToNewsModel }

import { isObject } from '../utils';
import { UserInfo } from './user';

export interface ICategoryNews {
    _id?: any;
    name?: string;
    description?: string;
    slug?: string;
    keyWord?: string;
    avatarUrl?: string;
    lastUpdate?: number;
    createDate?: number;
    status?: number;
    index?: number;
    ownId?: any;
    parentId?: any;
}

export default class CategoryNews implements ICategoryNews {
    _id: any;
    name: string;
    description: string;
    slug: string;
    keyWord: string;
    avatarUrl: string;
    lastUpdate: number;
    createDate: number;
    status: number;
    index: number;
    ownId: any;
    parentId: string | null;
    owner?: UserInfo;
    constructor(args: ICategoryNews = {}) {
        this._id = args._id ?? undefined;
        this.name = args.name ?? '';
        this.description = args.description ?? '';
        this.slug = args.slug ?? '';
        this.keyWord = args.keyWord ?? '';
        this.avatarUrl = args.avatarUrl ?? '';
        this.lastUpdate = args.lastUpdate ?? 0;
        this.createDate = args.createDate ?? 0;
        this.status = args.status ?? 0;
        this.index = args.index ?? 0;
        this.ownId = args.ownId?._id ?? (args.ownId ?? null);
        this.parentId = args?.parentId ?? null;
        if (isObject(args.ownId)) {
            this.owner = new UserInfo(args.ownId);
        }
    }
}


function CategoryNewsModel(object) {
    return {
        _id: object._id ? object._id : '',
        name: object.name ? object.name : '',
        description: object.description ? object.description : '',
        slug: object.slug ? object.slug : '',
        keyWord: object.keyWord ? object.keyWord : '',
        avatarUrl: object.avatarUrl ? object.avatarUrl : '',
        lastUpdate: object.lastUpdate ? object.lastUpdate : 0,
        createDate: object.createDate ? object.createDate : 0,
        status: object.status ?? 0,
        index: object.type ?? 0,
        ownId: object.ownId ? object.ownId : '',
        parentId: object?.parentId ?? null
    }
}

function convertJsonToCategoryNewsModel(categoryNewsData?: any) {
    let dataReturns = []
    if (categoryNewsData && categoryNewsData.length > 0) {
        dataReturns = categoryNewsData.map((e: any) => {
            return new CategoryNews(e);
            //     dataReturns.push(new LinkCategoryNewsModel(e))
            // })
        })
    }
    return dataReturns
}

export { CategoryNewsModel, convertJsonToCategoryNewsModel }

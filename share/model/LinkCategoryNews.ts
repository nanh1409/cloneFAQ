import { isObject } from '../utils';
import { Category } from './category';
import News from './news';

export interface ILinkCategoryNews {
    _id?: any;
    categoryId?: any;
    newId?: any;
    index?: number;
}

export default class LinkCategoryNews implements ILinkCategoryNews {
    _id: any;
    categoryId: any;
    newId: any;
    index: number;
    category?: Category;
    news?: News;
    constructor(args: ILinkCategoryNews = {}) {
        this._id = args._id ?? undefined;
        this.categoryId = args.categoryId?._id ?? (args.categoryId ?? null);
        this.newId = args.newId?._id ?? (args.newId ?? null);
        this.index = args.index ?? 0;
        if (isObject(args.categoryId)) {
            this.category = new Category(args.categoryId);
        }
        if (isObject(args.newId)) {
            this.news = new News(args.newId);
        }
    }
}

function LinkCategoryNewsModel(object) {
    return {
        _id: object._id ? object._id : '',
        categoryId: object.categoryId ? object.categoryId : '',
        newId: object.newId ? object.newId : '',
        index: object.type ?? 0,
    }
}

function convertJsonToLinkCategoryNewsModel(categoryNewsData?: any[]): LinkCategoryNews[] {
    let dataReturns: LinkCategoryNews[] = []
    if (categoryNewsData && categoryNewsData.length > 0) {
        categoryNewsData.map(e => {
            // dataReturns.push(new CategoryNewsModel(e))
            dataReturns.push(new LinkCategoryNews(e))
        })
    }
    return dataReturns
}

export { LinkCategoryNewsModel, convertJsonToLinkCategoryNewsModel }

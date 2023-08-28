import { isObject } from '../utils';
import { Course } from './courses';
import DocumentItem from './documentItem';
import Topic from './topic';
import { UserInfo } from './user';

export interface IDocument {
    _id?: any;
    userId?: any;
    parentId?: any;
    courseId?: any;
    title?: string;
    description?: string;
    shortDes?:string
    content?: string;
    slug?: string;
    avatar?: string;
    items?: any[];
    createDate?: number;
    updateDate?: number;
    startDate?: number;
    endDate?: number;
    status?: number;
    index?: number;
    classesId?: any;
}

export default class Document implements IDocument {
    _id: any;
    userId: any;
    parentId: any;
    courseId: any;
    classesId: string | null;
    title: string;
    description: string;
    shortDes: string
    content: string;
    slug: string;
    avatar: string;
    items: string[];
    createDate: number;
    updateDate: number;
    startDate: number;
    endDate: number;
    status: number;
    index: number;
    user?: UserInfo;
    parent?: Topic;
    course?: Course;
    type: number;
    reviewStatus: number;
    itemsDetail?: DocumentItem[];
    url?: any;

    constructor(args?: any) {
        if (!args) {
            args = {};
        }
        this._id = args._id ?? undefined;
        this.userId = args.userId?._id ?? (args.userId ?? null);
        this.parentId = args.parentId?._id ?? (args.parentId ?? null);
        this.courseId = args.courseId?._id ?? (args.courseId ?? null);
        this.title = args.title ?? '';
        this.description = args.description ?? '';
        this.shortDes = args.shortDes ?? '';
        this.content = args.content ?? '';
        this.slug = args.slug ?? '';
        this.avatar = args.avatar ?? '';
        this.items = (args.items ?? []).map((e) => e._id ?? e);
        this.createDate = args.createDate ?? Date.now();
        this.updateDate = args.updateDate ?? Date.now();
        this.startDate = args.startDate ?? 0;
        this.endDate = args.endDate ?? 0;
        this.status = args.status ?? 0;
        this.index = args.index ?? 0;
        this.classesId = args.classesId ?? null;
        this.type = args.type ?? 0;
        this.reviewStatus = args.reviewStatus ?? 0;
        this.url = args.url ?? "";
        if (isObject(args.userId)) {
            this.user = new UserInfo(args.userId);
        }
        if (isObject(args.parentId)) {
            this.parent = new Topic(args.parentId);
        }
        if (isObject(args.courseId)) {
            this.course = new Course(args.courseId);
        }
        if (isObject((args.items ?? [])[0])) {
            this.itemsDetail = (args.items ?? []).map((e) => new DocumentItem(e));
        }
    }
}

function DocumentModel(object) {
    return {
        _id: object._id,
        userId: object.userId ? object.userId : null,
        parentId: object.parentId ? object.parentId : null,
        courseId: object.courseId ? object.courseId : null,
        title: object.title ? object.title : '',
        description: object.description ? object.description : '',
        shortDes: object.shortDes ? object.shortDes : '',
        content: object.content ? object.content : '',
        slug: object.slug ? object.slug : '',
        avatar: object.avatar ? object.avatar : '',
        items: object.items ? object.items : '',
        createDate: object.createDate ? object.createDate : 0,
        updateDate: object.updateDate ? object.updateDate : 0,
        startDate: object.startDate ? object.startDate : 0,
        endDate: object.endDate ? object.endDate : 0,
        status: object.status ? object.status : 0,
        index: object.index ? object.index : 0,
    }
}


function convertDocumentToModel(datas: any[] = []): Document[] {
    let dataReturn: Document[] = []
    if (datas?.length > 0) {
        datas.map((e) => {
            let c = new Document(e)
            dataReturn.push(c)
        })
    }
    return dataReturn
}

export { DocumentModel, convertDocumentToModel };

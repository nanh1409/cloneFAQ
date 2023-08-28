import { CATEGORY_COURSE, CATEGORY_POSITION_LANDING_PAGE, STATUS_PUBLIC, TIME_STUDY } from "../constraint";
import { Course } from './courses';
export class Category {
    _id: any | undefined;
    parentId: string | null = "";
    avatar: string = "";
    name: string = "";
    description: string = "";
    shortDescription: string = "";
    slug: string = "";
    titleSEO: string = "";
    seo301: string = "";
    seoRobot: string = "";
    descriptionSeo: string = "";
    type: number = CATEGORY_COURSE;
    timeStudy: number = TIME_STUDY;
    status: number = STATUS_PUBLIC;
    lastUpdate: number = 0;
    price: number = 0;
    discountPrice: number = 0;
    index: number = 1000;
    position: number;
    domain: string;
    courses: Array<Course> = [];
    constructor(object: ICategory = {
        _id: undefined,
        avatar: '',
        price: 0,
        description: '',
        descriptionSeo: '',
        discountPrice: 0,
        lastUpdate: 0,
        name: '',
        parentId: null,
        seo301: '300000',
        seoRobot: '',
        shortDescription: '',
        slug: '',
        status: STATUS_PUBLIC,
        timeStudy: TIME_STUDY,
        titleSEO: '',
        type: CATEGORY_COURSE,
        index: 1000,
        courses: [],
        position: CATEGORY_POSITION_LANDING_PAGE,
        domain: ''
    }) {
        if (object) {
            this._id = object._id ? object._id : undefined
            this.parentId = object.parentId ? object.parentId : null
            this.avatar = object.avatar ? object.avatar : ''
            this.name = object.name ? object.name : ''
            this.description = object.description ? object.description : ''
            this.shortDescription = object.shortDescription ? object.shortDescription : ''
            this.slug = object.slug ? object.slug : ''
            this.titleSEO = object.titleSEO ? object.titleSEO : ''
            this.seo301 = object.seo301 ? object.seo301 : ''
            this.seoRobot = object.seoRobot ? object.seoRobot : ''
            this.descriptionSeo = object.descriptionSeo ? object.descriptionSeo : ''
            this.type = object.type ? object.type : CATEGORY_COURSE
            this.timeStudy = object.timeStudy ?? TIME_STUDY
            this.status = object.status ?? STATUS_PUBLIC
            this.lastUpdate = object.lastUpdate ? object.lastUpdate : 0
            this.courses = object.courses ?? []
            this.price = object.price ? object.price : 0
            this.discountPrice = object.discountPrice ? object.discountPrice : 0
            this.index = object.index ?? 1000;
            this.position = object?.position ?? CATEGORY_POSITION_LANDING_PAGE;
            this.domain = object?.domain ?? '';
        }
    }
}

export interface ICategory {
    _id: any | undefined
    parentId: string | null
    avatar: string
    name: string
    description: string
    shortDescription: string
    slug: string
    titleSEO: string
    seo301: string
    seoRobot: string
    descriptionSeo: string
    type: number
    timeStudy: number
    status: number
    lastUpdate: number,
    price: number,
    discountPrice: number,
    index: number,
    position: number;
    domain: string;
    courses?: Course[]
}

export function convertJsonToCategoriesModel(datas?: any[]): Category[] {
    let dataReturn: Category[] = []
    if (datas && datas.length > 0) {
        datas.map((e) => {
            let c = new Category(e)
            dataReturn.push(c)
        })
    }
    // console.log('dataReturn ', dataReturn)
    return dataReturn
}

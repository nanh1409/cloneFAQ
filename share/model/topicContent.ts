export interface ITopicContent {
    _id?: any;
    childType?: number;
    totalChild?: number;
    paths?: any[];
    titleSeo?: string;
    robotSeo?: string;
    seo301?: string;
    descriptionSeo?: string;
    keyword?: string;
    imageSharing?: string;
    imageSharingAlt?: string;
}

class TopicContent implements ITopicContent {
    _id: any;
    childType: number;
    totalChild: number;
    paths: any[];
    titleSeo: string;
    robotSeo: string;
    seo301: string;
    descriptionSeo: string;
    keyword: string;
    imageSharing?: string;
    imageSharingAlt?: string;
    constructor(args: ITopicContent = {}) {
        this._id = args._id ?? undefined;
        this.childType = args.childType ?? 0;
        this.totalChild = args.totalChild ?? 0;
        this.paths = args.paths ?? [];
        this.titleSeo = args.titleSeo ?? '';
        this.robotSeo = args.robotSeo ?? '';
        this.seo301 = args.seo301 ?? '';
        this.descriptionSeo = args.descriptionSeo ?? '';
        this.keyword = args.keyword ?? '';
        this.imageSharing = args.imageSharing;
        this.imageSharingAlt = args.imageSharingAlt;
    }
}

// function TopicContent() {
//     this._id = '';
//     this.childType = 0;
//     this.totalChild = 0;
//     this.paths = [];
//     this.titleSeo = '';
//     this.robotSeo = '';
//     this.seo301 = '';
//     this.descriptionSeo = '';
// }
export default TopicContent;
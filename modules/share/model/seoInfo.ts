export interface ISeoInfo {
    title?: any;
    description?: any;
    keywords?: any;
    url?: any;
    ogTitle?: any;
    ogDescription?: any;
    ogUrl?: any;
    ogEmail?: any;
    ogSiteName?: any;
    ogImage?: any;
    ogType?: any;
}

class SeoInfo implements ISeoInfo {
    title: any;
    description: any;
    keywords: any;
    url: any;
    ogTitle: any;
    ogDescription: any;
    ogUrl: any;
    ogEmail: any;
    ogSiteName: any;
    ogImage: any;
    ogType: any;
    constructor(args: ISeoInfo = {}) {
        this.title = args.title ?? '';
        this.description = args.description ?? '';
        this.keywords = args.keywords ?? '';
        this.url = args.url ?? '';
        this.ogTitle = args.ogTitle ?? '';
        this.ogDescription = args.ogDescription ?? '';
        this.ogUrl = args.ogUrl ?? '';
        this.ogEmail = args.ogEmail ?? '';
        this.ogSiteName = args.ogSiteName ?? '';
        this.ogImage = args.ogImage ?? '';
        this.ogType = args.ogType ?? '';
    }
}

// function SeoInfo({ title = '', description = '', keywords = '', url = '',
//     ogTitle = '', ogDescription = '', ogUrl = '', ogEmail = '', ogSiteName = '', ogImage = '', ogType = '' }) {
//     return {
//         title,
//         description,
//         keywords,
//         url,
//         ogTitle,
//         ogDescription,
//         ogUrl,
//         ogEmail,
//         ogSiteName,
//         ogImage,
//         ogType
//     }
// }

export { SeoInfo }
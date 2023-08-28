export default class AppReview { 
    _id: string | undefined;
    content: string;
    appId: string | null;
    author: string;
    rating: number;
    platform: string;
    avatar: string;
    lastUpdate: string; // ngày review

    createdAt?: Date;
    updatedAt?: Date;

    constructor(args: any = {}) { 
        this._id = args?._id; 
        this.appId = args?.appId ?? null; 
        this.content = args?.content ?? ''; 
        this.author = args?.author ?? '';
        this.rating = args?.rating ?? 0;
        this.avatar = args?.avatar ?? '';
        this.platform = args?.platform ?? 'android';
        this.lastUpdate = args?.lastUpdate ?? "";

        this.createdAt = args?.createdAt ?? new Date(); 
        this.updatedAt = args?.updatedAt ?? new Date(); 
    }
}
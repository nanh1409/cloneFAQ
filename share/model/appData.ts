export default class AppData { 
    _id: string | undefined;
    appId: string;
    averageUserRating: number;
    totalReview: number;

    createdAt: Date;
    updatedAt: Date;

    constructor(args: any = {}) { 
        this._id = args?._id; 
        this.appId = args?.appId; 
        this.averageUserRating = args?.averageUserRating ?? 0;
        this.totalReview = args?.totalReview ?? 0;

        this.createdAt = args?.createdAt ?? new Date(); 
        this.updatedAt = args?.updatedAt ?? new Date();
    }
}
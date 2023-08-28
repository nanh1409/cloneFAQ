export interface IAffiliateActivity {
    _id?: any;
    topicId: string;
    courseId: string;
    cardId: string;
    userId: string;
    createdDate: number;
    lastUpdate: number;
    updatedHistory: number[];
    status: number;
}

export class AffiliateActivity implements IAffiliateActivity {
    _id?: any;
    topicId: string;
    cardId: string;
    userId: string;
    createdDate: number;
    lastUpdate: number;
    status: number;
    courseId: string;
    updatedHistory: number[];
    constructor(args: IAffiliateActivity = {
        _id: undefined,
        courseId: "",
        topicId: "",
        cardId: "",
        userId: "",
        createdDate: 0,
        lastUpdate: 0,
        status: 0,
        updatedHistory: []
    }) {
        const timeStamp = Date.now();
        this._id = args._id?? undefined;
        this.topicId = args.topicId?? "";
        this.cardId = args.cardId ?? "";
        this.userId = args.userId ?? "";
        this.createdDate = args.createdDate?? timeStamp;
        this.lastUpdate = args.lastUpdate?? timeStamp;
        this.updatedHistory = args.updatedHistory?? [];
    }
}
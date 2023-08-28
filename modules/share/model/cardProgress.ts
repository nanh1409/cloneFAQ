export class UserEssays {
    time: number;
    content?: string;
    audio?: string;
    image?: string;
    correction?: Record<number, string>;

    constructor(args: Partial<UserEssays>) {
        this.time = args.time ?? 0;
        this.content = args.content;
        this.audio = args.audio;
        this.image = args.image;
        this.correction = args.correction ?? {}
    }
}

export interface ICardProgress {
    _id: any,
    cardId: string | null,
    userId: string | null,
    courseId: string | null,
    parentId: string | null,
    status: number,
    boxNum: number, // -3 , -2, -1, 0(sai 1 lan), 1(dung 1 lan), 2(dung 2 lan), 3(dung 3 lan)
    progress: number, // 
    lastUpdate: number,
    reviewDate: number,
    history: number[], // 0 dybg, 1 sai
    // Old Model
    bookmark?: number;
    isParentCard?: number;
    userEssays?: Array<UserEssays>;
}

class CardProgress implements ICardProgress {
    _id: any;
    cardId = '';
    userId = '';
    courseId = '';
    parentId = '';
    status = 0;
    boxNum = 0; // -3 , -2, -1, 0(sai 1 lan), 1(dung 1 lan), 2(dung 2 lan), 3(dung 3 lan)
    progress = 0;// 
    lastUpdate = 0;
    reviewDate = 0;
    history: number[] = [];
    bookmark?: number;
    isParentCard?: number;
    userEssays?: Array<UserEssays>;

    constructor(object: any = {}) {
        this._id = object._id ? object._id : undefined;
        this.cardId = object.cardId ? object.cardId : null;
        this.userId = object.userId ? object.userId : null;
        this.courseId = object.courseId ? object.courseId : null;
        this.parentId = object.parentId ? object.parentId : null;
        this.status = object.status ? object.status : 0;
        this.boxNum = object.boxNum ? object.boxNum : 0; // -3 , -2, -1, 0(sai 1 lan), 1(dung 1 lan), 2(dung 2 lan), 3(dung 3 lan)
        this.progress = object.progress ? object.progress : 0; // 
        this.lastUpdate = object.lastUpdate ? object.lastUpdate : 0;
        this.reviewDate = object.reviewDate ? object.reviewDate : 0;
        this.history = object.history ? object.history : []; // 0 dybg,
        this.bookmark = object.bookmark;
        this.isParentCard = object.isParentCard;
        this.userEssays = object.userEssays;
    }

}
export default CardProgress;
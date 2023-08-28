export interface ISocialToken {
    _id?: string,
    token: string,
    userId?: string,
    createDate?: any
    lastUpdate?: any
}
export class SocialToken {
    _id?: string
    token: string
    userId?: string
    createDate?: any
    lastUpdate?: any
   
    constructor(args: ISocialToken = {
        _id: undefined,
        token: '',
        userId: '',
        createDate: 0,
        lastUpdate: 0,
    }) {
        for (let key in args) {
            if (Object(this).hasOwnProperty(key)) {
                this[key] = args[key];
            }
        }
    }
}
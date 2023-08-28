export interface IUserCare {
    _id?: any,
    id: any,
    userId?: any,
    userCareId?: any,
    content?: string,
    userName?: string,
    type?: number,
    createDate: number,
    lastUpdate: number,
}

export class UserCare {
    _id: any
    id: any
    userId: any
    userCareId: any
    content: string
    userName: string
    type: number
    createDate: number
    lastUpdate: number
    constructor(args: IUserCare = {
        _id: undefined,
        id: '',
        userId: null,
        userCareId: null,
        content: '',
        userName: '',
        type: 0,
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
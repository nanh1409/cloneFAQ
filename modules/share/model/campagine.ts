export interface ICampagine {
    _id?: any,
    id?: any,
    content?: string,
    emailContent?: string,
    adminNote?: string,
    title?: string,
    avatar?: string,
    itemId?: any[],
    sendAction?: number, // Config.STUDY_DEMO_ADMIN_SEND
    startDateRegister?: number
    endDateRegister?: number,
    startDate?: number,
    endDate?: number,
    dayFree?: number,
    freeUnit?: number,
    status?: number, // Config.STATUS_PRIVATE; 
    createDate?: number,
    lastUpdate?: number,
}

export class Campagine {
    _id: any
    id: any
    content: string
    emailContent: string
    adminNote: string
    title: string
    avatar: string
    itemId: any[]
    sendAction: number // Config.STUDY_DEMO_ADMIN_SEND
    startDateRegister: number
    endDateRegister: number
    startDate: number
    endDate: number
    dayFree: number
    freeUnit: number
    status: number // Config.STATUS_PRIVATE; 
    createDate: number
    lastUpdate: number
    constructor(args: ICampagine = {
        _id: undefined,
        id: '',
        content: '',
        emailContent: '',
        adminNote: '',
        title: '',
        avatar: '',
        itemId: [],
        sendAction: 0, // Config.STUDY_DEMO_ADMIN_SEND
        startDateRegister: 0,
        endDateRegister: 0,
        startDate: 0,
        endDate: 0,
        dayFree: 0,
        freeUnit: 0,
        status: 0, // Config.STATUS_PRIVATE; 
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
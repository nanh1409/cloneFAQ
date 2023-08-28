
export interface IUserDevice {
    _id?: any,
    id?: any,
    userId?: any,
    platform?: number,
    browserName?: string,
    browserVersion?: string,
    deviceModel?: string,
    deviceType?: string,
    osName?: string,
    osVersion?: string,
    sessionId?: string,
    histories?: string,
    keyDevice?: string,
    ip?: string,
    listLogin?: string,
    totalWarning?: number,
    lastUpdate?: number,
}

export class UserDevice {
    _id: any
    id: any
    userId: any
    platform: number
    browserName: string
    browserVersion: string
    deviceModel: string
    deviceType: string
    osName: string
    osVersion: string
    sessionId: string
    histories: string
    keyDevice: string
    ip: string
    listLogin: string
    totalWarning: number
    lastUpdate: number
    constructor(args: IUserDevice = {
        _id: undefined,
        id: '',
        userId: null,
        platform: 0,
        browserName: '',
        browserVersion: '',
        deviceModel: '',
        deviceType: '',
        osName: '',
        osVersion: '',
        sessionId: '',
        histories: '',
        keyDevice: '',
        ip: '',
        listLogin: '',
        totalWarning: 0,
        lastUpdate: 0
    }) {

        for (let key in args) {
            if (Object(this).hasOwnProperty(key)) {
                this[key] = args[key];
            }
        }
    }
}
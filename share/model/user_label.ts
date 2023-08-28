import { UserInfo } from "./user"

export interface IUserLabel {
    _id?: any,
    id: any,
    userId?: any,
    employeeId?: any,
    labelId?: string,
    histories?: string[],
    createDate: number,
    lastUpdate: number,
    employee?: UserInfo
}
export class UserLabel {
    _id?: any
    id?: any
    userId: any
    employeeId: any
    labelId: string
    histories: string[]
    createDate?: number
    lastUpdate?: number
    employee?: UserInfo
    constructor(args?: any) {
       if(!args) {
           args = {}
       }
       this._id = args._id ?? undefined;
       this.userId = args.userId ?? null;
       this.employeeId = args.employeId ?? null;
       this.labelId = args.labelId ?? null;
       this.createDate = args.createDate ?? Date.now();
       this.lastUpdate = args.lastUpdate ?? Date.now();
       
    }
}
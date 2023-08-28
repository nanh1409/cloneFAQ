import { isObject } from '../utils';
import { IRole, Role } from "./role";
import IUserInfo, { UserInfo } from "./user";

export interface IUserRole {
    _id?: any,
    userId?: IUserInfo | UserInfo | any,
    roleId?: Role | IRole | any,
    itemId?: any,
    createDate?: number,
    expireDate?: number,
    status?: number,
    type?: number,
    from?: number,
    role?: IRole
}

export class UserRole {
    _id: string;
    userId: IUserInfo | UserInfo | any;
    roleId: Role | IRole | any;
    itemId: any;
    createDate: number;
    expireDate: number;
    status: number;
    type: number;
    from: number;
    role?: Role;
    constructor(args?: any) {
        if (!args) {
            args = {}
        }
        this._id = args._id ?? undefined;
        this.userId = args.userId ?? null;
        this.roleId = args.roleId ?? null;
        this.itemId = args.itemId ?? null;
        this.createDate = args.createDate ?? 0;
        this.expireDate = args.expireDate ?? 0;
        this.status = args.status ?? 0; // web
        this.type = args.type ?? 0;
        this.from = args.from ?? 0;
        if (isObject(args.role)) this.role = new Role(args.role);
    }

}

export function convertJsonToUserRoleModel(datas: any[]): UserRole[] {
    let dataReturn: UserRole[] = []
    if (datas.length > 0) {
        datas.map((e) => {
            let c = new UserRole(e)
            dataReturn.push(c)
        })
    }
    return dataReturn
}
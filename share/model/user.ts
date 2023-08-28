import { ClassesManagerConfig } from "../classes_manager_utils/config";
import { USER_TYPE_STUDENT, STATUS_PUBLIC } from "../constraint";
import { IRole, Role } from "./role";
import { UserActive } from "./userActive";
// import { convertJsonToUserActiveModel } from './userActive'
import { UserCourseModel } from "./userCourse";
import { convertJsonToUserRoleModel, UserRole } from "./userRole";
import { UserLabel } from "./user_label";
export default interface IUserInfo {
    _id: string;
    account: string;
    name: string;
    avatar: string;
    loginCode: number;
    email: string;
    phoneNumber: string;
    password: string;
    address: string;
    facebookId: string;
    userType: number;
    birth: number;
    gender: number;
    registerDate: number;
    status: number;
    province: number;
    userActives: any;
    userRoles: any;
    userCourse: any;
    orders: any;
    token?: string;
    userTag?: object;
    staff?: object;
    timeOnline?: number;
}

function UserModel(object: any): IUserInfo {
    if (typeof object === "string") {
        object = JSON.parse(object);
    }
    let userActives = object.userActive || object.userActives
        ? (object.userActive || object.userActives).map((e: any) => new UserActive(e))
        : [];
    let userRoles = object.userRoles
        ? convertJsonToUserRoleModel(object.userRoles)
        : [];
    let userCourse = object.userCourse
        ? UserCourseModel(object.userCourse)
        : null;
    // let orders = object.orders ? convertJsonToOrderModel(object.orders) : null
    return {
        _id: object._id ? object._id : "",
        account: object.account ? object.account : "",
        name: object.name ? object.name : "",
        avatar: object.avatar ? object.avatar : "",
        loginCode: 0,
        email: object.email ? object.email : "",
        phoneNumber: object.phoneNumber ? object.phoneNumber : "",
        password: object.password ? object.password : "",
        address: object.address ? object.address : "",
        facebookId: object.facebookId ? object.facebookId : "",
        userType: object.userType ? object.userType : 0,
        birth: object.birth ? object.birth : 0,
        gender: object.gender ? object.gender : 0,
        registerDate: object.registerDate ? object.registerDate : 0,
        status: object.status ? object.status : 0,
        province: object.province ? object.province : -1,
        timeOnline: object.timeOnline ?? 0,
        userActives,
        userRoles,
        userCourse,
        orders: null,
        userTag: object.userTag ? object.userTag : null,
        staff: object.staff ? object.staff : null,
    };
}

function convertJsonToUserModel(datas: IUserInfo[]): IUserInfo[] {
    let dataReturns: IUserInfo[] = [];
    if (datas && datas.length > 0) {
        datas.map((e) => {
            dataReturns.push(UserModel(e));
        });
    }
    return dataReturns;
}

export enum UserClassesManagerType {
    student = 0,
    content_manager = 1,
    manager = 2,
    parent = 3,
    teacher = 4,
    notGranted = -1
}
export class UserInfo {
    _id: string;
    account: string;
    name: string;
    avatar: string;
    loginCode: number;
    email: string;
    phoneNumber: string;
    password: string;
    address: string;
    facebookId: string;
    userType: number;
    birth: number;
    gender: number;
    registerDate: number;
    status: number;
    province: number;
    userActives: any;
    userRoles: any;
    userCourse: any;
    orders: any;
    token: string;
    userLabel?: UserLabel;
    role?: Role | IRole;
    classesMngRole: UserRole | null;
    userClassManagerType: number;
    childIds: string[]
    age: number = 0;
    lastLogin: number;
    constructor(args?: any) {
        if (!args) {
            args = {};
        }
        this._id = args._id ?? undefined;
        this.account = args.account ?? "";
        this.name = args.name ?? "";
        this.avatar = args.avatar ?? "";
        this.loginCode = args.loginCode ?? -1;
        this.email = args.email ?? "";
        this.phoneNumber = args.phoneNumber ?? "";
        this.password = args.password ?? "";
        this.address = args.address ?? "";
        this.facebookId = args.facebookId ?? "";
        this.userType = args.userType ?? 0;
        this.birth = args.birth ?? 0;
        this.gender = args.gender ?? 0;
        this.registerDate = args.registerDate ?? 0;
        this.status = args.status ?? STATUS_PUBLIC;
        this.province = args.province ?? 0;
        this.userActives = args.userActives ?? [];
        this.userRoles = args.userRoles ?? [];
        this.orders = args.orders ?? [];
        this.token = args.token ?? "";
        this.userCourse = args.userCourse ?? [];
        this.classesMngRole = args.classesMngRole ?? null;
        this.userClassManagerType = args.userClassManagerType ?? -1;
        this.childIds = args.childIds ?? [];
        this.lastLogin = args.lastLogin ?? Date.now()
        this.getUserTypeForClassesManager();
        this.calAge();
    }
    getUserTypeForClassesManager() {
        if (this.classesMngRole) {
            let roleId = `${this.classesMngRole.roleId}`;
            if (roleId === ClassesManagerConfig.ROLE_ID_CLASSES_MANAGER) {
                this.userClassManagerType = UserClassesManagerType.manager
            } else if (roleId === ClassesManagerConfig.ROLE_ID_CLASSES_CONTENT_MANAGE) {
                this.userClassManagerType = UserClassesManagerType.content_manager
            } else if (roleId === ClassesManagerConfig.ROLE_ID_CLASSES_TEACHER) {
                this.userClassManagerType = UserClassesManagerType.teacher
            } else {
                this.userClassManagerType = UserClassesManagerType.parent
            }
        } else {
            this.userClassManagerType = UserClassesManagerType.student;
        }
    }
    calAge = () => {
        if (this.birth) {
            const now = new Date();
            const birthDate = new Date(this.birth);
            this.age = now.getFullYear() - birthDate.getFullYear();
            if (now.getMonth() < 5) {
                this.age -= 1;
            }

        }
    }
}

const createExistRole = (args: any) => {
    let userInfo = new UserInfo(args);
    userInfo.role = new Role(args.role);
    return userInfo;
};

export { UserModel, convertJsonToUserModel, createExistRole };

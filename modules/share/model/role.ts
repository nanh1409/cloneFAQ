export interface RoleFunction {
  _id?: any;
  id?: any;
  name?: string;
  isActive?: boolean;
  actions?: number[];
}
export interface RoleAction {
  id?: any;
  name?: string;
  _id?: any;
  isActive?: boolean;
}
export interface IRole {
  _id?: any;
  id?: number;
  name?: string;
  type?: number; // 0 :CMS, 1: CRM, 2: CMS, 3: classes-manager
  roleFunctions?: Array<RoleFunction> | null;
}

export class Role {
  _id: any;
  name: string;
  id: number;
  type: number; // DEFAULT IS WEB
  roleFunctions: Array<RoleFunction>;
  constructor(args: any) {
    if (!args) {
      args = {};
    }
    this._id = args._id ?? undefined;
    this.name = args.name ?? "";
    this.id = args.id ?? 0;
    this.type = args.type ?? 0;
    this.roleFunctions = args.roleFunctions ?? [];
  }
}

export function convertJsonToRoleModel(datas?: any[]): Role[] {
  let dataReturn: Role[] = [];
  if (datas) {
    if (datas.length > 0) {
      datas.map((e) => {
        let c = new Role(e);
        dataReturn.push(c);
      });
    }
  }
  return dataReturn;
}

export const createForSearch = (args: any) => {
  return new Role(args);
};
export const createForCrm = (
  args: any = {
    type: 1,
  }
) => {
  return new Role(args);
};
export const createForCMS = (
  args: any = {
    type: 2,
  }
) => {
  return new Role(args);
};
export const createForClassesManager = (
  args: any = {
    type: 3,
  }
) => {
  return new Role(args);
};

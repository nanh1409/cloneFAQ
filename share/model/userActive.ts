export interface IUserActive {
  _id: any;
  userId: string;
  itemId: string;
  activeDate: number;
  type: number;
  status: number;
  expireDate: number;
  studyType: number;
  unitsStudy: number;
  code?: string;
}

export class UserActive {
  _id: any;
  userId: string;
  itemId: string;
  activeDate: number;
  type: number;
  status: number;
  expireDate: number;
  studyType: number;
  unitsStudy: number;
  code?: string;

  constructor(object: any = {}) {
    this._id = object._id ? object._id : undefined;
    this.userId = object.userId ? object.userId : null;
    this.itemId = object.itemId || null;
    this.activeDate = object.activeDate || 0;
    this.type = object.type || 0;
    this.status = object.status || 0;
    this.expireDate = object.expireDate || 0;
    this.studyType = object.studyType || 0;
    this.unitsStudy = object.unitsStudy || 0;
    this.code = object.code;
  }
}

// function UserActiveModel(object) {
//     return {
//         _id: object._id ? object._id : undefined,
//         userId: object.userId ? object.userId : null,
//         itemId: object.itemId || null,
//         activeDate: object.activeDate || 0,
//         type: object.type || 0,
//         status: object.status || 0,
//         expireDate: object.expireDate || 0,
//         studyType: object.studyType || 0,
//         unitsStudy: object.unitsStudy || 0,
//     }
// }

export function convertJsonToUserActiveModel(datas: any[]) {
  let dataReturn: UserActive[] = [];
  if (datas) {
    if (typeof datas !== "object") {
      datas = JSON.parse(datas);
    }
    if (datas.length > 0) {
      datas.map((e) => {
        let c = new UserActive(e);
        dataReturn.push(c);
      });
    }
  }
  return dataReturn;
}

// export { UserActiveModel, convertJsonToUserActiveModel }

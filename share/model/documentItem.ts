export interface IDocumentItem {
  _id?: any;
  url?: string;
  createDate?: number;
  updateDate?: number;
  type?: string;
  index?: number;
  size?: number;
  name?: string;
}

export default class DocumentItem {
  _id: any;
  url: string;
  createDate: number;
  updateDate: number;
  type: string;
  index: number;
  size: number;
  name: string;
  constructor(args?: any) {
    if (!args) {
      args = {}
    }
    this._id = args._id ?? undefined;
    this.url = args.url ?? '';
    this.createDate = args.createDate ?? 0;
    this.updateDate = args.updateDate ?? 0;
    this.type = args.type ?? '';
    this.index = args.index ?? 0;
    this.size = args.size ?? 0;
    this.name = args.name ?? "";
  }
}

export function convertDocumentItemsToModel(items?: any[]) {
  if (!items) return [];
  return items.map((item) => new DocumentItem(item));
}

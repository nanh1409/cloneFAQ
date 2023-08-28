

class LabelInfo {
    _id: any = undefined
    name: string = ''
    color: string = ''
    userId: string | any
    status: 0
    createDate: number = 0
    lastUpdate: number = 0

    constructor(args: any = {
        _id: undefined,
        name: '',
        color: '',
        userId: '',
        status: 0,
        createDate: 0,
        lastUpdate: 0

    }) {
        this._id = args._id ?? undefined
        this.name = args.name ?? ''
        this.color = args.color ?? ''
        this.status = args.status ?? 0
        this.userId = args.userId ?? null
        this.createDate = args.createDate ?? 0
        this.lastUpdate = args.lastUpdate ?? 0
    }
}
export default LabelInfo;
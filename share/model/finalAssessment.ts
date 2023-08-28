import { STATUS_PUBLIC } from "../constraint";

export default class FinalAssessment {
    _id: string | undefined;
    content: string;
    /**
     * Kiểu loại đánh giá: 1 - Độ chuyên cần, 2 - Thái độ học tập trong giờ, 3 - Bài tập về nhà, 4 - Đề xuất, 5 - Nhận xét chung
     */
    type: number;
    status: number;
    createdDate: number;
    lastUpdate: number;

    constructor(args: any = {}) {
        this._id = args._id ?? undefined;
        this.content = args.content ?? '';
        this.createdDate = args.createdDate ?? 0;
        this.lastUpdate = args.lastUpdate ?? 0;
        this.status = args.status ?? STATUS_PUBLIC;
        this.type = args.type;
    }
}

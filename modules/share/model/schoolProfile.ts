import { STATUS_PUBLIC } from "../constraint";
import { isObject } from "../utils";
import { Classes } from "./classes";

class SchoolProfile {
    _id: string | undefined;
    classesId: string | undefined;
    schoolYear: string;
    userId: string | null;
    acellusScore: number;
    extraScore: number;
    status: number;
    type: number;
    feedback: string;
    note: string;
    createdAt: string;
    updateAt: string;
    classes: Classes | null;
    /**
     * Mức độ hoàn thành
     */
    completionLevel?: number;
    /**
     * Độ chuyên cần
     */
    diligence?: string;
    /**
     * Thái độ học tập
     */
    attitude?: string;
    /**
     * BÀi tập về nhà
     */
    assignment?: string;
    /**
     * Đề xuất
     */
    propose?: string;

    /**
     * Học kỳ
     */
    semester?: number;

    /**
     * Điểm TB bài Acellus đã hoàn thành
     */
    acellusPointComplete?: number;
    constructor(args?: any) {
        if (!args) {
            args = {}
        }
        this._id = args._id ?? undefined;
        this.userId = args.userId?._id ?? (args.userId ?? null)
        this.acellusScore = args.startTime ?? 0;
        this.extraScore = args.endTime ?? 0;
        this.type = args.type ?? 0;
        this.feedback = args.content ?? '';
        this.note = args.acceptEditTime ?? this.extraScore;
        this.status = args.status ?? STATUS_PUBLIC;
        this.createdAt = args.createdAt;
        this.updateAt = args.updateAt;
        this.schoolYear = args.schoolYear ?? new Date().getFullYear();
        this.completionLevel = args.completionLevel ?? 0;
        this.diligence = args.diligence ?? '';
        this.attitude = args.attitude ?? '';
        this.assignment = args.assignment ?? '';
        this.propose = args.propose ?? '';
        this.semester = args.semester ?? 0;
        this.acellusPointComplete = args.acellusPointComplete ?? 0;
        if (isObject(args.classesId)) {
            this.classes = new Classes(args.classesId);
        }
    }
}
export { SchoolProfile }
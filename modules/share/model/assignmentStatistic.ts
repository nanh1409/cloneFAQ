import { STATUS_PUBLIC } from '../constraint';
import { isObject } from '../utils';
import { Assignment } from './assignment';
import { Classes } from "./classes";

class AssignmentStatistic {
    _id: string | undefined;
    classesId: string | null;
    assignmentId: string | null;
    assignment: Assignment | null;
    classes: Classes | null;
    createdDate: number;
    lastUpdate: number;
    status: number;
    total: number;
    done: number;
    submitted: number;
    miss: number;
    constructor(args: any = {}) {
        this._id = args._id?._id ?? (args._id ?? undefined);
        this.assignmentId = args.assignmentId?._id ?? (args.assignmentId ?? null);
        this.classesId = args.classesId?._id ?? (args.classesId ?? null);
        this.createdDate = args.createdDate ?? Date.now();
        this.lastUpdate = args.lastUpdate ?? Date.now();
        this.status = args.status ?? STATUS_PUBLIC;
        this.total = args.total ?? 0;
        this.done = args.done ?? 0;
        this.submitted = args.submitted ?? 0;
        this.miss = args.miss ?? 0;
        if (isObject(args.assignmentId)) {
            this.assignment = new Assignment(args.assignmentId);
        }
        if (isObject(args.classesId)) {
            this.classes = new Classes(args.classesId);
        }
    }
}

export { AssignmentStatistic };


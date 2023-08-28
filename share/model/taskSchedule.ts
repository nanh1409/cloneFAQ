import { isObject } from '../utils';
import { TaskInfo } from './taskInfo';
import { UserInfo } from './user';
class TaskSchedule {
    _id: string | undefined;
    targetId: string | null; //userId;groupId;lableId
    employeeId: string | null;
    taskId: string | null;
    estimatedTime: number;
    exactTime: number;
    status: number; // Config.TASK_SCHEDULE_INIT;//done,cancel,...
    createdDate: number;
    lastUpdate: number;
    task: TaskInfo | null;
    employee: UserInfo | null;
    constructor(object: any = {}) {
        this._id = object._id ? object._id : undefined;
        this.taskId = object.taskId?._id ?? (object.taskId ?? null);
        this.employeeId = object.employeeId?._id ?? (object.employeeId ?? null);
        this.estimatedTime = object.estimatedTime ? object.estimatedTime : 0;
        this.exactTime = object.exactTime ? object.exactTime : 0;
        this.status = object.status ? object.status : 0;
        this.targetId = object.targetId || null
        this.createdDate = object.createdDate ? object.createdDate : Date.now();
        this.lastUpdate = object.lastUpdate ? object.lastUpdate : Date.now();
        if (isObject(object.taskId)) {
            this.task = new TaskInfo(object.taskId);
        }
        if (isObject(object.employeeId)) {
            this.employee = new UserInfo(object.employeeId);
        }
    }
}
export { TaskSchedule }
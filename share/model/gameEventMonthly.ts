import { UserInfo } from './user';
import Topic from './topic';
import { Event } from './event';
import { isObject } from '../utils';

export interface IGameEventMonthly {
    _id?: any;
    userId?: any;
    date?: any;
    eventId?: any;
    point?: any;
}

export default class GameEventMonthly implements IGameEventMonthly {
    _id: string | undefined;
    userId: string | null;
    date: string | null;
    eventId: string | null;
    point: number | null;
    user?: UserInfo;
    event?: Event;

    constructor(args: IGameEventMonthly = {}) {
        this._id = args._id ?? undefined;
        this.userId = args.userId?._id ?? (args.userId ?? null);
        this.eventId = args.eventId?._id ?? (args.eventId ?? null);
        this.point = args.point ?? 0;
        this.date = args.date ?? '';
        if (isObject(args.userId)) {
            this.user = new UserInfo(args.userId);
        }
        if (isObject(args.eventId)) {
            this.event = new Event(args.eventId);
        }
    }
}
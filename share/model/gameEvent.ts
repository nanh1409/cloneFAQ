import { UserInfo } from './user';
import Topic from './topic';
import { Event } from './event';
import { isObject } from '../utils';

export interface IGameEvent {
    _id?: any;
    userId?: any;
    topicId?: any;
    eventId?: any;
    point?: any;
}

export default class GameEvent implements IGameEvent {
    _id: string | undefined;
    userId: string | null;
    topicId: string | null;
    eventId: string | null;
    point: number | null;
    user?: UserInfo;
    topic?: Topic;
    event?: Event;

    constructor(args: IGameEvent = {}) {
        this._id = args._id ?? undefined;
        this.userId = args.userId?._id ?? (args.userId ?? null);
        this.topicId = args.topicId?._id ?? (args.topicId ?? null);
        this.eventId = args.eventId?._id ?? (args.eventId ?? null);
        this.point = args.point ?? 0;
        if (isObject(args.userId)) {
            this.user = new UserInfo(args.userId);
        }
        if (isObject(args.topicId)) {
            this.topic = new Topic(args.topicId);
        }
        if (isObject(args.eventId)) {
            this.event = new Event(args.eventId);
        }
    }
}
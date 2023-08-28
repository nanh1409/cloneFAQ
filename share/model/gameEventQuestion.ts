import { UserInfo } from './user';
import Topic from './topic';
import { Event } from './event';
import { Card } from './card';
import { isObject } from '../utils';

export interface IGameEventQuestionModel {
    _id?: any;
    userId?: any;
    topicId?: any;
    eventId?: any;
    point?: any;
    cardId?: any;
    isCorrect?: any;
    date?: any;
}

export default class GameEventQuestionModel implements IGameEventQuestionModel {
    _id: string | undefined;
    userId: string | null;
    topicId: string | null;
    eventId: string | null;
    cardId: string | null;
    point: number | null;
    isCorrect: boolean | false;
    date: string | null;
    user?: UserInfo;
    topic?: Topic;
    event?: Event;
    card?: Card;

    constructor(args: IGameEventQuestionModel = {}) {
        this._id = args._id ?? undefined;
        this.userId = args.userId?._id ?? (args.userId ?? null);
        this.topicId = args.topicId?._id ?? (args.topicId ?? null);
        this.eventId = args.eventId?._id ?? (args.eventId ?? null);
        this.cardId = args.cardId?._id ?? (args.cardId ?? null);
        this.point = args.point ?? 0;
        this.isCorrect = args.isCorrect ?? false;
        this.date = args.date ?? '';
        if (isObject(args.userId)) {
            this.user = new UserInfo(args.userId);
        }
        if (isObject(args.topicId)) {
            this.topic = new Topic(args.topicId);
        }
        if (isObject(args.eventId)) {
            this.event = new Event(args.eventId);
        }
        if (isObject(args.cardId)) {
            this.card = new Card(args.cardId);
        }
    }
}
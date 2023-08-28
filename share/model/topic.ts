import { STATUS_PUBLIC, TOPIC_TYPE_CHILD_NONE, TOPIC_TYPE_LESSON } from "../constraint"
import { isObject } from '../utils'
import { convertJsonToCourse, Course, ICourse } from "./courses"
import { IStudyScore, StudyScore } from "./studyScore"
import { ITopicExercise, TopicExercise } from "./topicExercise"
import { ITopicSetting, TopicSetting } from "./topicSetting"
import { UserInfo } from './user'

export interface ITopic {
    _id?: any;
    topicContentId?: any;
    topicExerciseId?: any;
    topicSystemId?: any;
    userId?: any;
    courseId?: any;
    parentId?: any;
    name?: string;
    description?: string;
    shortDescription?: string;
    type?: number;
    status?: number;
    startTime?: number;
    endTime?: number;
    lastUpdate?: number;
    slug?: string;
    orderIndex?: number;
    password?: string;
    childType?: number;
    paths?: any[];
    avatar?: string;
    topicSetting?: ITopicSetting | null;
    topicExercise?: ITopicExercise | null;
    courses?: Array<ICourse>;
    studyScore?: IStudyScore | null;
    scenarioInfos?: null;
    videoUrl?: string;
    directLink?: {
        url?: string;
        fileExtension?: string;
    };
    isEntranceTest?: boolean;
    accessLevel?: number;
}

export default class Topic implements ITopic {
    _id: any;
    topicContentId: any;
    topicExerciseId: any;
    topicSystemId: any;
    userId: any;
    courseId: any;
    parentId: any;
    name: string;
    description: string;
    shortDescription: string;
    type: number;
    status: number;
    startTime: number;
    endTime: number;
    lastUpdate: number;
    slug: string;
    orderIndex: number;
    password: string;
    childType: number;
    paths: any[];
    avatar: string;
    topicExercise: ITopicExercise | null;
    topicSetting?: ITopicSetting | null;
    courses: Array<Course>;
    studyScore: StudyScore | null;
    scenarioInfos: null;
    user?: UserInfo;
    course?: Course;
    parent?: Topic;
    videoUrl?: string;
    directLink?: {
        url?: string;
        fileExtension?: string;
    }
    topicPaths?: Topic[];
    isEntranceTest?: boolean;
    accessLevel?: number;

    constructor(args: ITopic = {}) {
        let topicExercise: ITopicExercise | null = null;
        if (args.topicExercise) topicExercise = new TopicExercise(args.topicExercise);
        else if (isObject(args.topicExerciseId)) topicExercise = new TopicExercise(args.topicExerciseId);
        this._id = args._id ?? undefined;
        this.topicContentId = this._id;
        this.topicExerciseId = this._id;
        this.topicSystemId = this._id;
        this.userId = args.userId?._id ?? (args.userId ?? null);
        this.courseId = args.courseId?._id ?? (args.courseId ?? null);
        this.parentId = args.parentId?._id ?? (args.parentId ?? null);
        this.name = args.name ?? '';
        this.description = args.description ?? '';
        this.shortDescription = args.shortDescription ?? '';
        this.type = args.type ?? TOPIC_TYPE_LESSON;
        this.status = args.status ?? STATUS_PUBLIC;
        this.startTime = args.startTime ?? 0;
        this.endTime = args.endTime ?? 0;
        this.lastUpdate = args.lastUpdate ?? 0;
        this.slug = args.slug ?? '';
        this.orderIndex = args.orderIndex ?? 0;
        this.password = args.password ?? '';
        this.childType = args.childType ?? TOPIC_TYPE_CHILD_NONE;
        this.paths = !!args?.paths?.length ? args.paths.map((path) => path._id ?? (path ?? null)) : [];
        this.avatar = args.avatar ?? '';
        this.topicExercise = topicExercise;
        this.courses = args.courses?.map((course) => new Course(course)) ?? [];
        this.studyScore = args.studyScore ? new StudyScore(args.studyScore) : null;
        this.topicSetting = args.topicSetting ? new TopicSetting(args.topicSetting) : null;
        this.scenarioInfos = null;
        this.videoUrl = args.videoUrl ?? '';
        this.directLink = args.directLink ? {
            url: args.directLink?.url ?? '',
            fileExtension: args.directLink?.fileExtension ?? ''
        } : undefined;
        this.isEntranceTest = args.isEntranceTest ?? false;
        this.accessLevel = args.accessLevel;
        if (isObject(args.userId)) {
            this.user = new UserInfo(args.userId);
        }
        if (isObject(args.courseId)) {
            this.course = new Course(args.courseId);
        }
        if (isObject(args.userId)) {
            this.parent = new Topic(args.parentId);
        }
        if (!!args.paths?.length && isObject(args.paths[0])) {
            this.topicPaths = (args.paths ?? []).map((e) => new Topic(e));
        }
    }
}

function TopicModel(object) {
    let _id = object._id ? object._id : undefined
    let topicExercise: TopicExercise | null = null
    if (object.topicExercise) {
        topicExercise = new TopicExercise(object.topicExercise)
    } else if (object.topicExerciseId && typeof (object.topicExerciseId) === 'object') {
        topicExercise = new TopicExercise(object.topicExerciseId)
    }

    let courses = object.courses ? convertJsonToCourse(object.courses) : []
    let studyScore = object.studyScore ? new StudyScore(object.studyScore) : null
    // let scenarioInfos = convertScenarioInfoToModel(scenarioData)
    return {
        _id,
        topicContentId: _id,
        topicExerciseId: _id,
        topicSystemId: _id,
        userId: object.userId ? object.userId : null,
        courseId: object.courseId ? object.courseId : null,
        parentId: object.parentId ? object.parentId : null,
        name: object.name ? object.name : '',
        description: object.description ? object.description : '',
        shortDescription: object.shortDescription ? object.shortDescription : '',
        type: object.type ?? TOPIC_TYPE_LESSON,
        status: object.status ?? STATUS_PUBLIC,
        startTime: object.startTime ? object.startTime : 0,
        endTime: object.endTime ? object.endTime : 0,
        lastUpdate: object.lastUpdate ?? 0,
        slug: object.slug ? object.slug : '',
        orderIndex: object.orderIndex ? object.orderIndex : 0,
        password: object.password ? object.password : '',
        childType: object.childType ?? TOPIC_TYPE_CHILD_NONE,
        paths: object.paths ? object.paths : [],
        avatar: object.avatar ? object.avatar : '',
        topicExercise: topicExercise,
        courses: courses,
        studyScore: studyScore,
        scenarioInfos: null
    }
}

function convertJsonToTopicModel(datas: any[]): Topic[] {
    let dataReturns: Topic[] = []
    if (datas && datas.length > 0) {
        datas.map(e => {
            dataReturns.push(new Topic(e))
        })
    }
    return dataReturns
}

export { TopicModel, convertJsonToTopicModel }

export enum StudyPlanBeginLevel {
  Beginner = "1",
  Intermediate = "2",
  Advanced = "3"
}

export enum StudyPlanTargetLevel {
  Pass = "1",
  Advanced = "2",
  Master = "3"
}

class StudyPlan {
  _id?: string;
  testDate: number;
  userId: any;
  startDate: number;
  lastUpdate: number;
  begin: StudyPlanBeginLevel;
  target: StudyPlanTargetLevel;
  courseId: any;
  stateId?: any;
  topicIds?: null | any[];

  constructor(args: any = {}) {
    this._id = args._id;
    this.userId = args.userId;
    this.testDate = args.testDate;
    this.startDate = args.startDate;
    this.lastUpdate = args.lastUpdate;
    this.begin = args.begin;
    this.target = args.target;
    this.courseId = args.courseId;
    this.stateId = args.stateId;
    this.topicIds = args.topicIds;
  }
};

export default StudyPlan;
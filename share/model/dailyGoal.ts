class DailyGoal {
  _id?: string;
  date: number; // 
  userId: any;
  masteredQuestion: number;
  learned: number;
  dailyGoal: number;
  studyPlanId: any;

  constructor(args: any = {}) {
    this._id = args._id;
    this.date = args.date;
    this.userId = args.userId;
    this.masteredQuestion = args.masteredQuestion;
    this.learned = args.learned;
    this.dailyGoal = args.dailyGoal;
    this.studyPlanId = args.studyPlanId;
  }
}

export default DailyGoal;
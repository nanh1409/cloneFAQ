 import { STATUS_OPEN } from "../constraint";

class EnrollmentInfo {
  _id: string | undefined;
  type: EnrollInfoType;
  status: number;
  startDate: number;
  endDate: number;
  weeks: number;
  totalPrice: number;
  lockTrialDayNums: number;
  powerHomePrice: number | null;
  schoolLevel: number[];
  trialPowerHomePrice: number | null;
  createdDate: number;
  lastUpdate: number;
  constructor(args: any) {
    if (!args) { args = {} };
    this._id = args._id ?? undefined;
    this.type = args.type ?? EnrollInfoType.acellus_class;
    this.status = args.status ?? STATUS_OPEN;
    this.weeks = args.weeks ?? 0;
    this.totalPrice = args.totalPrice ?? 0;
    this.lockTrialDayNums = args.lockTrialDayNums ?? 0;
    this.powerHomePrice = args.powerHomePrice ?? 0;
    this.trialPowerHomePrice = args.trialPowerHomePrice ?? 0;
    this.schoolLevel = args.schoolLevel ?? [];
    this.startDate = args.startDate ?? Date.now();
    this.endDate = args.endDate ?? Date.now();
    this.createdDate = args.createdDate ?? Date.now();
    this.lastUpdate = args.lastUpdate ?? Date.now();
  }
}
export enum EnrollInfoType {
  acellus_class = 5,
  club = 4
}
export { EnrollmentInfo }
class CardStats {
  _id: string | undefined;
  cardId: string | null;
  totalAnswered: number;
  totalCorrect: number;
  totalFavourites: number;
 constructor(args: any) {
   if(!args) {
    this._id = args._id ?? undefined;
    // this.acellusScore = args.startTime ?? 0;
    // this.extraScore = args.endTime ?? 0;
    // this.type = args.type ?? 0;
    // this.feedback = args.content ?? '';
    // this.note = args.acceptEditTime ?? this.extraScore;
    // this.status = args.status ?? STATUS_PUBLIC;
    // this.createdAt = args.createdAt;
    // this.updateAt = args.updateAt;
    // this.schoolYear = args.schoolYear ?? new Date().getFullYear();
   
   }
 }
}
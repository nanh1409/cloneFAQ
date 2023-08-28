import { CARD_NORMAL, STATUS_PUBLIC } from "../utils/constraints";

export enum CardGames {
  quiz,
  matching,
  spelling,
  paragraph,
  toeic_speaking,
  toeic_writing,
  ielts_speaking,
  ielts_writing
}

export enum CardTrapPairType {
  question, answer
}

export interface ICardQuestion {
  text?: string;
  image?: string;
  sound?: string;
  hint?: string;
  audioHint?: string;
}

export class CardQuestion implements ICardQuestion {
  text: string;
  image: string;
  sound: string;
  hint: string;
  audioHint?: string;
  constructor(args: ICardQuestion = {}) {
    this.text = args.text ?? "";
    this.image = args.image ?? "";
    this.sound = args.sound ?? "";
    this.hint = args.hint ?? "";
    this.audioHint = args.audioHint
  }
}

export interface ICardAnswer {
  texts?: string[];
  choices?: string[];
  image?: string;
  sound?: string;
  hint?: string;
  audioHint?: string;
}

export class CardAnswer implements ICardAnswer {
  texts: string[];
  choices: string[];
  image: string;
  sound: string;
  hint: string;
  audioHint?: string;
  constructor(args: ICardAnswer = {}) {
    if (!args) args = {};
    this.texts = args.texts ?? [];
    this.choices = args.choices ?? [];
    this.image = args.image ?? "";
    this.sound = args.sound ?? "";
    this.hint = args.hint ?? "";
    this.audioHint = args.audioHint;
  }
}

export interface ICardSettings {
  shuffleAnswer?: number;
  additional?: string;
  maxPoint?: number;
  pointType?: number;
  splitPointAnswers?: boolean;
  usingParentSkill?: boolean;
  isGapFilling?: boolean;
  isLayoutLeftRight?: boolean;
}

export class CardSettings implements ICardSettings {
  shuffleAnswer: number;
  additional: string;
  maxPoint: number;
  pointType: number;
  /** Check whether card has multiple correct answers and will be marked with 1 point / answer. For example, in IELTS Listening Test */
  splitPointAnswers: boolean;
  /** In some special games like TOEIC WRITING, a part of a game may be grouped as a Paragraph Question. 
   * This field check whether using parent question skill or children question skill 
   * */
  usingParentSkill?: boolean;
  isGapFilling?: boolean;
  isLayoutLeftRight?: boolean;
  constructor(args: ICardSettings = {}) {
    this.shuffleAnswer = args.shuffleAnswer ?? 0;
    this.additional = args.additional ?? "";
    this.maxPoint = args.maxPoint ?? 0;
    this.pointType = args.pointType ?? 0;
    this.splitPointAnswers = args.splitPointAnswers ?? false;
    this.usingParentSkill = args.usingParentSkill;
    this.isGapFilling = args.isGapFilling;
    this.isLayoutLeftRight = args.isLayoutLeftRight;
  }
}

export class CardPairItem {
  text: string;
  image: string;
  sound: string;
  constructor(args: any = {}) {
    this.text = args?.text;
    this.image = args?.image;
    this.sound = args?.sound;
  }
}

export class CardTrapPairItem extends CardPairItem {
  trapFor: CardTrapPairType;
  constructor(args: any = {}) {
    super(args);
    this.trapFor = args?.trapFor ?? CardTrapPairType.question;
  }
}

export interface ICard {
  _id?: any;
  parentId?: any;
  hasChild?: number;
  question?: ICardQuestion;
  answer?: ICardAnswer;
  pairs?: Array<{
    question: any;
    answer: any;
  }>;
  trapPairs?: Array<any>
  games?: Array<CardGames>;
  code?: string;
  status?: number;
  lastUpdate?: number;
  difficultyLevel?: number;
  orderIndex?: number;
  type?: number;
  setting?: ICardSettings;
  childCards?: Array<ICard>;
  isRender?: boolean;
  tags?: number[];
  refId?: string;
}

export class Card implements ICard {
  _id: any;
  parentId: any;
  hasChild: number;
  question: CardQuestion;
  answer: CardAnswer;
  pairs?: Array<{ question: CardPairItem; answer: CardPairItem }>;
  trapPairs?: Array<CardTrapPairItem>
  games?: Array<CardGames>;
  code: string;
  status: number;
  lastUpdate: number;
  difficultyLevel: number;
  orderIndex: number;
  type: number;
  setting: CardSettings;
  childCards?: Array<Card>;
  isRender?: boolean;
  tags?: number[];
  refId?: string;

  constructor(args: ICard = {}) {
    this._id = args._id ?? undefined;
    this.parentId = args.parentId ?? null;
    this.hasChild = args.hasChild ?? CARD_NORMAL;
    this.question = new CardQuestion(args.question);
    this.answer = new CardAnswer(args.answer);
    this.code = args.code ?? "";
    this.status = args.status ?? STATUS_PUBLIC;
    this.lastUpdate = args.lastUpdate ?? 0;
    this.difficultyLevel = args.difficultyLevel ?? 0;
    this.orderIndex = args.orderIndex ?? 0;
    this.type = args.type ?? 0;
    this.setting = new CardSettings(args.setting);
    this.childCards = convertCardsToModel(args.childCards);
    this.isRender = true;
    this.tags = args.tags ?? [];
    this.refId = args.refId;

    if (args?.games && Array.isArray(args.games)) this.games = args.games;
    if (args?.pairs && Array.isArray(args.pairs)) this.pairs = args.pairs.map(({ question, answer }) => ({ question: new CardPairItem(question), answer: new CardPairItem(answer) }));
    if (args?.trapPairs && Array.isArray(args.trapPairs)) this.trapPairs = args.trapPairs.map((e) => new CardTrapPairItem(e));
  }
}

class AnswerObject {
  id: any;
  text: string;
  isCorrect: boolean;
  display: boolean;
  constructor(args: { id: any; text: string; isCorrect: boolean }) {
    this.id = args.id;
    this.text = args.text;
    this.isCorrect = args.isCorrect;
    this.display = true;
  }
}

function convertCardsToModel(data?: any[]) {
  const dataReturn = data?.map((e) => new Card(e)) ?? [];
  return dataReturn;
}

export { convertCardsToModel, AnswerObject };

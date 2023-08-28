import { Card } from "../models/card";
import Skill from "../models/skill";
import { SpellingClientCardProgress } from "../components/spelling/SpellingGameObject";
// import { MapCardProgress } from "../redux/reducers/game.slice";

export const CLASS_GAME_FILL_PARAGRAPH = "table-question";
export const CLASS_GAME_LAYOUT_LEFT_RIGHT = "game-layout-left-right";

export enum GameDisplayMode {
  DEFAULT = 0,
  ALL_IN_PAGE = 1
}

export enum GameObjectStatus {
  NOT_ANSWER = 0,
  ANSWERED = 1,
  SKIP = 2,
  BOOKMARK = 3,
  REVIEW = 4
}

export enum GameTypes {
  INIT = -1,
  PRACTICE = 0,
  TEST = 1,
  FLASH_CARD = 2,
  LESSON = 3
}

export enum GameStatus {
  PLAY = -1,
  NEW = 0,
  CONTINUE = 1,
  REVIEW = 2,
  END = 3
}

export enum FlashCardView {
  OVERVIEW = 0,
  CARD = 1,
  GAME = 2,
  END = 3
}

export enum PracticeView {
  DEFAULT = 0,
  OVERVIEW = 1
}

export interface GameObjectResult {
  gameObject: GameObject;
}

export class QuestionItem {
  id: string;
  index: number;
  status: GameObjectStatus;
  correct: boolean;
  skillValue?: number;
  skillType?: number;
  path: string[];
  selectedChoices: number[];
  answerText: string;
  constructor(args: {
    id?: string; index?: number;
    status?: GameObjectStatus;
    correct?: boolean;
    path?: string[];
    skillValue?: number;
    skillType?: number;
    totalTime?: number;
  } = {}) {
    this.id = args?.id;
    this.index = args?.index;
    this.status = args?.status;
    this.correct = args?.correct;
    this.path = args?.path;
    this.skillValue = args?.skillValue;
    this.skillType = args?.skillType;
  }

  setProgress(args: { correct: boolean; status: GameObjectStatus }) {
    this.correct = args.correct;
    this.status = args.status;
  }

  setSelectedChoices(choiceIds: number[]) {
    this.selectedChoices = choiceIds;
  }

  setAnswerText(answerText: string) {
    this.answerText = answerText;
  }

  static clone(args: QuestionItem) {
    return new QuestionItem({ ...args })
  }
}

export enum FaceTypes {
  NONE = 0,
  QUESTION = 1,
  ANSWER_CORRECT = 2,
  ANSWER_INCORRECT = 3
}

export class Face {
  content: string;
  urlImage: string;
  urlSound: string;
  hint: string;
  type: FaceTypes;
  isLayoutLeftRight?: boolean;
  isGapFilling?: boolean;
  constructor(args: {
    content?: string;
    urlImage?: string;
    urlSound?: string;
    hint?: string;
    type?: FaceTypes;
    isLayoutLeftRight?: boolean;
    isGapFilling?: boolean;
  } = {}) {
    this.content = args.content;
    this.urlImage = args.urlImage;
    this.urlSound = args.urlSound;
    this.hint = args.hint;
    this.type = args.type;
    this.isLayoutLeftRight = args.isLayoutLeftRight;
    this.isGapFilling = args.isGapFilling;
  }
}

export class GameObject {
  id: string;
  parentId: string;
  question: Face;
  status: GameObjectStatus;
  bookmark: boolean;
  isCorrect: boolean;
  index: number;
  label: string;
  explanation: string;
  skill?: Skill;

  constructor(args: Card = new Card()) {
    this.id = args._id;
    this.parentId = args.parentId;
    this.question = new Face({
      content: args.question.text,
      hint: args.question.hint,
      urlImage: args.question.image,
      urlSound: args.question.sound,
      type: FaceTypes.QUESTION,
      isLayoutLeftRight: args.setting.isLayoutLeftRight,
      isGapFilling: args.setting.isGapFilling
    });
    this.status = GameObjectStatus.NOT_ANSWER;
    this.bookmark = false;
    this.isCorrect = false;
    this.index = args.orderIndex;
    this.explanation = args.answer.hint;
  }

  setProgress(args: {
    correct: boolean;
    status: GameObjectStatus
  }) {
    this.isCorrect = args.correct;
    this.status = args.status;
  }

  setStatus(status: GameObjectStatus) {
    this.status = status;
  }

  setBookmark(bookmark: boolean) {
    this.bookmark = bookmark;
  }

  static clone(args: GameObject) {
    const _gameObject = new GameObject();
    Object.assign(_gameObject, args);
    return _gameObject;
  }
}

export class ClientCardProgress {
  id: string;
  studyTime: number;
  cardId: string;
  topicId: string;
  userId: string;
  correct: boolean;
  history: boolean[];
  lastUpdate: number;
  oldLastUpdate?: number;
  bookmark?: boolean;
  skip?: boolean;
  answerOptional?: {
    file?: string[];
    content?: string;
    totalTime?: number;
  }
  constructor(args: Partial<ClientCardProgress> = {}) {
    [
      "studyTime",
      "cardId",
      "topicId",
      "userId",
      "correct",
      "history",
      "lastUpdate",
      "answerOptional",
      "bookmark",
      "skip"
    ].forEach((key) => {
      if (args.hasOwnProperty(key)) this[key] = args[key];
      if (key === "lastUpdate") this.lastUpdate = args.lastUpdate || Date.now();
    });
    this.id = `${args.topicId}_${args.cardId}`
  }

  setHistory(args: boolean[]) {
    this.history = args;
  }

  setBookmark(bookmark: boolean) {
    this.bookmark = bookmark;
  }

  static clone(args: ClientCardProgress) {
    return new ClientCardProgress({ ...args });
  }

  static getUserCardProgress(args: {
    topicId: string; cardId: string; userId: string; cardProgresses?: MapCardProgress;
  }) {
    const { topicId, cardId, userId, cardProgresses = {} } = args;
    const studyId = `${topicId}_${cardId}`;
    let cardProgress = !!cardProgresses[studyId]
      ? (cardProgresses[studyId]?.userId === userId ? this.clone(cardProgresses[studyId]) : undefined)
      : undefined;
    if (!cardProgress) cardProgress = new ClientCardProgress({ cardId, topicId, userId });
    return cardProgress;
  }
};

export type MapCardProgress = {
  [studyId: string]: ClientCardProgress;
}

export type MapCardBox = {
  [cardId: string]: number;
}

export type MapExamTypeSkills = {
  [examType: number]: Skill[]
}

/** Map<CorrectTime, cardIds> */
export type MapCorrectBox = {
  [correctTime: number]: string[];
}

export enum CardStudyOrder {
  DEFAULT = -1,
  NEW = 0,
  MEMORIZED = 1,
  UNMEMORIZED = 2,
  MARKED = 3
}

// export class GameFunction {
//   onAnswer?: (args: ClientCardProgress) => any;
//   fetchCardProgress?: () => Promise<ClientCardProgress[]>;
//   constructor(args: {
//     onAnswer?: (args: ClientCardProgress) => any;
//     fetchCardProgress?: () => Promise<ClientCardProgress[]>;
//   }) {
//     this.onAnswer = args.onAnswer;
//     this.fetchCardProgress = args.fetchCardProgress;
//   }
// }

export type GameLanguage = "en" | "vi"
export type ExplanationType = "explanation" | "example" | "explanation-example";
export type QuizExplanationPosition = "below" | "after-choice";
export type GameFeatureLockType = "login" | "upgrade-plan";


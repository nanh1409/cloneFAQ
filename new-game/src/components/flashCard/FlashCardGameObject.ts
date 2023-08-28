import { Card } from "../../models/card";
import { GameObject } from "../../models/game.core";
import { sampleSize, shuffle } from "../../utils/_lodash";
import { Choice, QuizGameObject } from "../quiz/QuizGameObject";
import { SpellingGameObject } from "../spelling/SpellingGameObject";

export enum FlashCardGameTypes {
  QUIZ = 0,
  SPELLING = 1
}

export class FlashCardGameObject extends GameObject {
  backText: string;
  boxNum: number;
  render: boolean;
  choices: Choice[];

  constructor(args: Card & {
    boxNum?: number;
    bookmark?: boolean;
    render?: boolean
  } = new Card()) {
    super(args);
    this.boxNum = args.boxNum ?? 0;
    this.bookmark = !!args.bookmark;
    this.render = !!args.render;
    this.backText = args?.answer?.texts[0] ?? "";

    const correctChoices = args.answer.texts.map((e) => new Choice({ content: e, isCorrect: true }));
    const inCorrectChoices = args.answer.choices.map((e) => new Choice({ content: e, isCorrect: false }));

    this.choices = ([...correctChoices, ...inCorrectChoices].sort((a, b) => a.content.localeCompare(b.content))).map((c, i) => { c.id = i; return c; });
  }

  setBoxNum(boxNum: number) {
    this.boxNum = boxNum;
  }

  toQuizGameObject(args: {
    samples?: FlashCardGameObject[];
  } = { samples: [] }) {
    const { samples = [] } = args;
    const choices = [new Choice({ content: this.question.content, isCorrect: true })];
    const _samples = samples.filter((go) => go.id !== this.id);
    const _choices = sampleSize(_samples, 3).map((go) => new Choice({ content: go.question.content, isCorrect: false }));
    choices.push(..._choices);
    const quizGameObject = QuizGameObject.fromGameObject({
      ...this,
      choices: shuffle([...choices]).map((choice, i) => { choice.id = i; return choice; }),
      question: {
        ...this.question,
        content: this.backText,
        urlSound: ""
      }
    });
    return quizGameObject;
  }

  toSpellingGameObject() {
    const spellingGameObject = SpellingGameObject.fromGameObject({
      ...this,
      question: {
        content: this.backText,
        urlSound: ""
      },
      answer: this.question.content
    } as SpellingGameObject);
    return spellingGameObject;
  }
}
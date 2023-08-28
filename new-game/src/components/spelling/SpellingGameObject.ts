import { Card } from "../../models/card";
import { ClientCardProgress, GameObject } from "../../models/game.core";

export class SpellingClientCardProgress extends ClientCardProgress {
  answer: string;
  constructor(args: {
    [key in keyof SpellingClientCardProgress]?: any;
  }) {
    super(args);
    this.answer = args.answer ?? "";
  }
}

export class SpellingGameObject extends GameObject {
  answer: string;
  constructor(args: Card = new Card()) {
    super(args);
    this.answer = args.answer.texts[0] ?? "";
  }

  static fromGameObject(gameObject: GameObject): SpellingGameObject {
    const _quizGameObject = new SpellingGameObject();
    return Object.assign(_quizGameObject, gameObject);
  }
}
import { Card } from "../../models/card";
import { GameObject } from "../../models/game.core";

export class ParaGameObject extends GameObject {
  childGameObjects: GameObject[];
  totalTime?: number;
  constructor(args: Card = new Card()) {
    super(args);
  }

  static fromGameObject(gameObject: GameObject): ParaGameObject {
    const _paraGameObject = new ParaGameObject();
    return Object.assign(_paraGameObject, gameObject);
  }
}
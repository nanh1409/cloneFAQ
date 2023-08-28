import { CARD_HAS_CHILD } from "../../../utils/constraints";
import { Card } from "../../../models/card";
import Skill from "../../../models/skill";
import { ClientCardProgress, GameObject } from "../../../models/game.core";

export class IELTSSpeakingGameObject extends GameObject {
  // Default: True
  useTimeParentSkill: boolean;
  skill?: Skill;
  progress?: ClientCardProgress;
  hasChild?: boolean;
  childGameObjects: Array<IELTSSpeakingGameObject>;
  constructor(args: { card?: Card; skill?: Skill; } = { card: new Card() }) {
    const { card = new Card(), skill } = args;
    super(card);
    this.useTimeParentSkill = card.setting.usingParentSkill ?? true;
    this.skill = skill;
    this.hasChild = card.hasChild === CARD_HAS_CHILD;
    this.childGameObjects = [];
  }

  static fromGameObject(gameObject: GameObject): IELTSSpeakingGameObject {
    const _go = new IELTSSpeakingGameObject();
    return Object.assign(_go, gameObject);
  }
}
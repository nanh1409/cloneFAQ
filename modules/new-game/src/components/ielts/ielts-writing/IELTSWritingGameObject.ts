import { CARD_HAS_CHILD } from "../../../utils/constraints";
import { Card } from "../../../models/card";
import Skill from "../../../models/skill";
import { ClientCardProgress, GameObject } from "../../../models/game.core";

export class IELTSWritingGameObject extends GameObject {
  useTimeParentSkill?: boolean;
  skill?: Skill;
  progress?: ClientCardProgress;
  hasChild?: boolean;
  childGameObjects: Array<IELTSWritingGameObject>;
  constructor(args: { card?: Card; skill?: Skill; } = { card: new Card() }) {
    const { card = new Card(), skill } = args;
    super(card);
    this.useTimeParentSkill = card.setting.usingParentSkill;
    this.skill = skill;
    this.hasChild = card.hasChild === CARD_HAS_CHILD;
    this.childGameObjects = [];
  }

  static fromGameObject(gameObject: GameObject): IELTSWritingGameObject {
    const _go = new IELTSWritingGameObject();
    return Object.assign(_go, gameObject);
  }
}
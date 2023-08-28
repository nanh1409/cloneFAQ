import { Card } from "../../../models/card";
import { ClientCardProgress, GameObject } from "../../../models/game.core";
import Skill from "../../../models/skill";
import { CARD_HAS_CHILD } from "../../../utils/constraints";

export class TOEICWritingGameObject extends GameObject {
    // Default False
    useTimeParentSkill: boolean;
    skill?: Skill;
    progress?: ClientCardProgress;
    hasChild?: boolean;
    childGameObjects: Array<TOEICWritingGameObject>;
    constructor(args: { card?: Card; skill?: Skill; } = { card: new Card() }) {
      const { card = new Card(), skill } = args;
      super(card);
      this.useTimeParentSkill = card.setting.usingParentSkill ?? false;
      this.skill = skill;
      this.hasChild = card.hasChild === CARD_HAS_CHILD;
      this.childGameObjects = [];
    }
  
    static fromGameObject(gameObject: GameObject): TOEICWritingGameObject {
      const _go = new TOEICWritingGameObject();
      return Object.assign(_go, gameObject);
    }
}
import { GameDisplayMode, GameTypes } from "../models/game.core";
import { GameSetting } from "../models/GameSetting"
import {
  EXAM_TYPE_IELTS,
  EXAM_TYPE_TOEIC,
  SKILL_TYPE_SPEAKING,
  SKILL_TYPE_WRITING
} from "./constraints";

export const getTestSetting = (gameSetting: GameSetting = {} as GameSetting) => {
  let usingSkillView = false;
  let showTestUtils = true;
  if (gameSetting.gameType === GameTypes.TEST) {
    if (gameSetting.currentSkill) {
      if (
        (gameSetting.contentType === EXAM_TYPE_IELTS && [SKILL_TYPE_SPEAKING, SKILL_TYPE_WRITING].includes(gameSetting.currentSkill.type))
        || (gameSetting.contentType === EXAM_TYPE_TOEIC && [SKILL_TYPE_SPEAKING, SKILL_TYPE_WRITING].includes(gameSetting.currentSkill.type))
      ) {
        usingSkillView = true;
        showTestUtils = false;
      }
    }
  }
  return {
    usingSkillView,
    showTestUtils
  }
}

export const getDisplayMode = (gameSetting: GameSetting = {} as GameSetting) => {
  if (gameSetting.gameType === GameTypes.TEST
    && gameSetting.contentType === EXAM_TYPE_TOEIC
    && gameSetting.testConfig?.toeicLR?.simulationMode
  ) {
    return GameDisplayMode.DEFAULT;
  }
  return gameSetting.displayMode ?? GameDisplayMode.DEFAULT
}
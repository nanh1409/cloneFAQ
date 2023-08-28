import { EXAM_TYPE_IELTS, EXAM_TYPE_TOEIC } from "../utils/constraints";
import { Card } from "../models/card";
import Skill from "../models/skill";
import { GameDisplayMode, GameFeatureLockType, GameLanguage, GameTypes, MapCardBox, MapCardProgress, QuizExplanationPosition, GameStatus } from "./game.core";

const topicContentTypes = [
  EXAM_TYPE_TOEIC,
  EXAM_TYPE_IELTS
] as const;

export type TopicContentType = typeof topicContentTypes[number];

/** Init Game Setting */
export type GameSetting = {
  // ############# Game Init State
  /** Each game has an unique topicId */
  topicId: string;
  /** User ID (Player) */
  userId: string;
  /** GameTypes: TEST, LESSON, FLASHCARD, PRACTICE */
  gameType: GameTypes;
  /** Init GameStatus */
  gameStatus: GameStatus;
  /** SkillBased Exam Skill */
  currentSkill?: Skill;
  /** Game Duration (Config), in `seconds` */
  duration?: number;
  /** Topic Game, For Lesson Game */
  topicName?: string;
  /** Topic Content , for lesson game */
  topicDescription?: string;
  /** Topic Content Video URL , for lesson game */
  topicVideoUrl?: string;
  /** 
   * Topic Content Type
   * `2`: EXAM_TYPE_IELTS
   * `3`: EXAM_TYPE_TOEIC
   */
  contentType?: number;
  /** In Test Game, if score is greater than or equals `passScore`, `progress` will be `100` */
  passScore?: number;
  /** Barem Score of the test game */
  baremScore?: number;
  /** POST API Endpoint for upload audio, image of game, return url of file. */
  uploadURL?: string;
  // ######## Game Progress Init State
  /** Saved time playing game, in `seconds` */
  playedTime?: number;
  /** Saved MapCardBox */
  boxCard?: MapCardBox;
  /** Saved bookmarked cardIds */
  cardBookmarks?: string[];
  /** Saved CardProgressed For Overwrite */
  cardProgresses?: MapCardProgress;
  // ######## Game Play Setting
  /** skip Default overview */
  skipOverview?: boolean;
  usePracticeOverview?: boolean;
  /** Shuffle questions order */
  shuffleQuestion?: boolean;
  /** Show the result on answer, Game Test is always `false` */
  showResultOnAnswer: boolean;
  /** Show Questions On Reviewing Game. By default, the Game Review Section is not rendered after complete the game if `showResultOnAnswer=true` */
  showQuestionsOnReview?: boolean;
  /** Not ask user to leave on unload */
  disableUnloadEvent?: boolean;
  /** Disable default fixed clock on scroll. */
  disableFixedClock?: boolean;
  /** Single Question per page or One Page, default to Single Question per page */
  displayMode?: GameDisplayMode;
  /** Quit Game Logic hocthongminh.com */
  useQuitGameHook?: boolean;
  // ############ Game Display Settings
  /** Game Background will default to `#fff` */
  defaultBackground?: boolean;
  /** Game Language, supported: "en", "vi" */
  language?: GameLanguage;
  /** Using MathJax for display Math, Equation..., default: `true` */
  mathJax?: boolean;
  /** Game Dev Mode: show all answer, display ads position */
  devMode?: boolean;
  /** Lock Some feature such as explanation, sync speaking game, etc. due to login or upgrade plan required */
  featureLockType?: GameFeatureLockType;
  /** Enable Ads in game */
  enableChildGameAds?: boolean;
  /** Quiz Explanation Position */
  quizExplanationPosition?: QuizExplanationPosition;
  /** Show Explanation by default and disable collapse */
  disableHideExplanation?: boolean;
  /** Hide default Paragraph Question Label */
  hideParaQuestionLabel?: boolean;
  /** 
   * Paragraph Question will be displayed in Top-Down layout by default.
   * Only questions contain CLASS_LAYOUT_LEFT_RIGHT or have `isLayoutLeftRight = true` will be displayed in Left-Right layout
   */
  useParaTopDownScrollDefault?: boolean;
  /**
   * Paragrap Question will be displayed in Left-Right layout by default.
   */
  useParaLeftRightDefault?: boolean;
  /**
   * Paragrap Question default fontSize (default is 16)
   */
  defaultParaLeftRightFontSize?: number;
  testConfig?: {
    toeicLR?: TOEICLRTestConfig;
  }
}

export type TOEICLRTestConfig = {
  /** TOEIC Simulation Test Mode */
  simulationMode?: boolean;
  useDefaultPrepareTime?: boolean;
  allowPause?: boolean;
}
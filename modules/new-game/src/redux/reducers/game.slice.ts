import { createAsyncThunk, createSlice, createSelector, PayloadAction } from "@reduxjs/toolkit";
import _ from "lodash";
// import { apiGetCardsByIds, apiGetCardsByTopicId, apiGetSkillsByExamType } from "../../api/game.api"
import { FillParaGameObject } from "../../components/fillPara/FillParaGameObject";
import { FlashCardGameObject } from "../../components/flashCard/FlashCardGameObject";
import { IELTSSpeakingGameObject } from "../../components/ielts/ielts-speaking/IELTSSpeakingGameObject";
import { IELTSWritingGameObject } from "../../components/ielts/ielts-writing/IELTSWritingGameObject";
import { ParaGameObject } from "../../components/para/ParaGameObject";
import { QuizClientCardProgress, QuizGameObject } from "../../components/quiz/QuizGameObject";
import { SpellingClientCardProgress, SpellingGameObject } from "../../components/spelling/SpellingGameObject";
import { TOEICSpeakingGameObject } from "../../components/toeic/toeic-speaking/TOEICSpeakingGameObject";
import { TOEICWritingGameObject } from "../../components/toeic/toeic-writing/TOEICWritingGameObject";
import { Card, CardGames } from "../../models/card";
import {
  CardStudyOrder,
  CLASS_GAME_FILL_PARAGRAPH,
  ClientCardProgress,
  FlashCardView, GameDisplayMode, GameObject,
  GameObjectStatus, GameStatus, GameTypes,
  MapCardBox,
  MapCardProgress,
  MapExamTypeSkills,
  PracticeView,
  QuestionItem
} from "../../models/game.core";
import { GameSetting } from "../../models/GameSetting";
import Skill from "../../models/skill";
import { CARD_HAS_CHILD, EXAM_TYPE_IELTS, EXAM_TYPE_TOEIC, SKILL_TYPE_LISTENING, SKILL_TYPE_READING, SKILL_TYPE_SPEAKING, SKILL_TYPE_WRITING } from "../../utils/constraints";

export enum ReplayMode {
  NONE = 0,
  CORRECT,
  INCORRECT,
  NEW,
  ALL
}

export const RENDERED_REVIEW_MIN_INDEX = 15;

enum SpecialGame {
  NONE,
  FLASH_CARD,
  IELTS_SPEAKING,
  IELTS_WRITING,
  TOEIC_SPEAKING,
  TOEIC_WRITING
}

export type GameState = {
  gameKey: any;
  gameSetting: GameSetting | null;
  cards: Card[];
  // Flat Array of skills
  skills: Skill[];
  questionItems: QuestionItem[];
  gameObjects: GameObject[];
  currentGameIdx: number;
  currentQuestionIdx: number;
  currentGame: GameObject | null;
  currentQuestion: QuestionItem | null;
  gameType: GameTypes;
  showResultOnAnswer: boolean | null;
  loading: boolean;
  showNext: boolean;
  showReviewNav: boolean;
  currentGameViewIdx: number;
  essayEnd: boolean;
  cardProgresses: MapCardProgress;
  totalQuestions: number;
  totalCorrect: number;
  totalIncorrect: number;
  replayMode: ReplayMode;
  gameStatus: GameStatus;
  flashCardView: FlashCardView;
  questionsPlayNum: number;
  cardStudyOrder: CardStudyOrder;
  duration: number;
  pauseForSubmit: boolean;
  userPlaying: boolean;
  fetchedCardProgresses: boolean;
  openRestartDialog: boolean;
  openSubmitDialog: boolean;
  openQuitGameDialog?: boolean;
  mapExamTypeSkills: MapExamTypeSkills;
  playedTime: number;
  cardBookmarks: string[];
  boxCard: MapCardBox;
  updateBoxCard: MapCardBox | null;
  isCheckShowCollapse: boolean;
  showQuestionsOnReview: boolean;
  disableAutoPlayAudio: boolean;
  rootParaExplanationHeight: number;
  currentCardId: string | null;
  // showPracticeOverview?: boolean;
  totalCardStudy?: number;
  displayMode?: GameDisplayMode;
  isPracticeFlashCard?: boolean;
  studyScoreDataIdReview?: string;
  // enableChildGameAds: boolean;
  // googleAdsConfig: MapGameGoogleAdsConfig;
  // quizExplanationPosition: QuizExplanationPosition;
  // disableHideExplanation: boolean;
  // hideParaQuestionLabel: boolean;
  // useParaTopDownScrollDefault: boolean;
  // useParaLeftRightDefault: boolean;
  // lockType: GameFeatureLockType | null;
  // topicId: string;
  // topicContentType: number;
  // topicPassScore: number;
  // topicBaremScore: number;
  // shuffleQuestion: boolean;
  // uploadURL: string;
  // userId: string;
  // sync: boolean;
  checkFinishGame: boolean;
  checkStartPractice: boolean;
  /** Only 1 audio is allowed in All in Page Test Mode. This id is referenced by GameObjectId */
  currentPlayingAudioId: string;
  specialGame: SpecialGame;
  showSkillTutorial: boolean;
  practiceView: PracticeView;
  isUserInteracted: boolean;
}

const initialState: GameState = {
  gameKey: null,
  gameSetting: null,
  cards: [],
  skills: [],
  questionItems: [],
  gameObjects: [],
  currentGame: null,
  currentGameIdx: -1,
  currentQuestion: null,
  currentQuestionIdx: -1,
  gameType: GameTypes.INIT,
  showResultOnAnswer: null,
  loading: true,
  showNext: false,
  showReviewNav: false,
  currentGameViewIdx: -1,
  essayEnd: false,
  cardProgresses: {},
  totalQuestions: 0,
  totalCorrect: 0,
  totalIncorrect: 0,
  replayMode: ReplayMode.NONE,
  gameStatus: GameStatus.NEW,
  flashCardView: FlashCardView.OVERVIEW,
  questionsPlayNum: 0,
  cardStudyOrder: CardStudyOrder.DEFAULT,
  duration: 0,
  pauseForSubmit: false,
  userPlaying: false,
  fetchedCardProgresses: false,
  openRestartDialog: false,
  openSubmitDialog: false,
  openQuitGameDialog: false,
  mapExamTypeSkills: {},
  playedTime: 0,
  cardBookmarks: [],
  boxCard: {},
  updateBoxCard: null,
  isCheckShowCollapse: false,
  showQuestionsOnReview: false,
  disableAutoPlayAudio: false,
  rootParaExplanationHeight: 0,
  currentCardId: null,
  // showPracticeOverview: false,
  totalCardStudy: 0,
  displayMode: GameDisplayMode.ALL_IN_PAGE,
  isPracticeFlashCard: false,
  studyScoreDataIdReview: '',
  // enableChildGameAds: false,
  // googleAdsConfig: {},
  // quizExplanationPosition: "after-choice",
  // disableHideExplanation: false,
  // hideParaQuestionLabel: false,
  // useParaTopDownScrollDefault: false,
  // useParaLeftRightDefault: true,
  // lockType: null,
  // topicId: "",
  // topicContentType: TOPIC_CONTENT_TYPE_CARD,
  // topicPassScore: 0,
  // topicBaremScore: BAREM_SCORE_DEFAULT,
  // shuffleQuestion: false,
  // uploadURL: "",
  // userId: "testuser",
  // sync: true,
  checkFinishGame: false,
  checkStartPractice: false,
  currentPlayingAudioId: "",
  specialGame: SpecialGame.NONE,
  showSkillTutorial: false,
  practiceView: PracticeView.DEFAULT,
  isUserInteracted: false
}

// TODO: Implement external api
// export const fetchCardsRandomByPercent = createAsyncThunk("game/fetchCardsRandomByPercent", async (args: { topicId: string, questionTotal?: number; level?: number, courseId?: string, userId?: string, priorityLevel?: number[] }) => {
//   const cards = await apiGetCardsByTopicId({ level: args.level, topicId: args.topicId, questionTotal: args.questionTotal, courseId: args.courseId, userId: args.userId, priorityLevel: args.priorityLevel, typeQuery: "card_random_by_percent" });
//   return cards?.filter(item => (item.answer?.texts?.length || item.hasChild === CARD_HAS_CHILD)) ?? [];
// });

export const getNextGameObjectModeShowResultOnAnswer = createAsyncThunk("game/getNextGameObjectModeShowResultOnAnswer", (args: Pick<
  GameState, "gameObjects" | "currentGameIdx" | "replayMode"
>) => {
  const data = onContinue({
    gameObjects: args.gameObjects,
    showResultOnAnswer: true,
    currentIndex: args.currentGameIdx,
    replayMode: args.replayMode
  })
  return data;
});

const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    initGameSetting: (state, action: PayloadAction<{
      gameSetting: GameSetting | null;
      cards: Card[];
    }>) => {
      if (action.payload) {
        const gameSetting = action.payload.gameSetting;
        const cards = action.payload.cards;
        let isSingleGame = false;
        if (gameSetting.gameType === GameTypes.TEST) {
          const isEssaysSkill = gameSetting.currentSkill && [SKILL_TYPE_SPEAKING, SKILL_TYPE_WRITING].includes(gameSetting.currentSkill.type);
          if (
            (gameSetting.contentType === EXAM_TYPE_IELTS && isEssaysSkill) ||
            (gameSetting.contentType === EXAM_TYPE_TOEIC && isEssaysSkill)
          ) {
            isSingleGame = true
          }
        }
        if (gameSetting.gameType === GameTypes.PRACTICE && gameSetting.usePracticeOverview && !gameSetting.skipOverview) {
          state.practiceView = PracticeView.OVERVIEW;
        }

        const _displayMode = isSingleGame ? GameDisplayMode.DEFAULT : gameSetting.displayMode;
        state.gameSetting = {
          ...gameSetting,
          displayMode: _displayMode
        };
        state.cards = cards;
        if (gameSetting) {
          if (gameSetting.gameStatus !== null && gameSetting.gameStatus !== undefined) state.gameStatus = gameSetting.gameStatus;
          state.gameType = gameSetting.gameType;
          state.showResultOnAnswer = gameSetting.showResultOnAnswer;
          state.playedTime = gameSetting.playedTime ?? 0;
          state.showQuestionsOnReview = gameSetting.showQuestionsOnReview;
          state.displayMode = _displayMode;
        }
      }
    },
    setGameKey: (state, action: PayloadAction<any>) => {
      state.gameKey = action.payload;
    },
    setCardsList: (state, action: PayloadAction<Card[]>) => {
      state.cards = action.payload;
    },
    setMapExamTypeSkillsKey: (state, action: PayloadAction<{ examType: number; skills: Skill[] }>) => {
      state.mapExamTypeSkills[action.payload.examType] = action.payload.skills;
      state.skills = [...action.payload.skills, ...(_.flatMap(_.map(action.payload.skills, (e) => e.childSkills ?? [])))];
    },
    setMapCardProgressAsync: (state: GameState, action: PayloadAction<{
      mapCardProgress: MapCardProgress;
      userId: string;
      cards: Card[];
      topicId: string;
    }>) => {
      const { mapCardProgress, userId, cards, topicId } = action.payload;
      const cardIds = recursiveGetCardIds([], cards);
      cardIds.forEach((cardId) => {
        const studyId = `${topicId}_${cardId}`;
        // state.cardProgresses[studyId]
        const newProgress = mapCardProgress[studyId];
        if (newProgress?.userId === userId) {
          state.cardProgresses[studyId] = newProgress;
        } else {
          state.cardProgresses[studyId] = undefined;
        }
      })
      // const mapCardProgress: MapCardProgress = Object.keys(_mapCardProgress).reduce((map, e) => {
      //   if (_mapCardProgress[e].topicId === topicId
      //     && _mapCardProgress[e].userId === userId
      //     && (cardIds && cardIds.length
      //       ? cardIds.includes(_mapCardProgress[e].cardId) : true)) {
      //     map[e] = _mapCardProgress[e]
      //   }
      //   return map;
      // }, {} as MapCardProgress);
      // console.log("mapCardProgress", mapCardProgress, _mapCardProgress, topicId, userId);
      // const oldCardProgressKeys = Object.keys(state.cardProgresses).filter((key) => {
      //   const [_topicId, _cardId] = key.split("_");
      //   return _topicId === topicId && ((!!cardIds && cardIds.length) ? cardIds.includes(_cardId) : true)
      // });
      // const oldCardProgresses = oldCardProgressKeys.reduce((map, e) => {
      //   const oldCardProgress = state.cardProgresses[e];
      //   if (oldCardProgress?.userId === userId) {
      //     // ReMap
      //     if (mapCardProgress[e]) map[e] = oldCardProgress
      //   }
      //   return map;
      // }, {} as MapCardProgress);
      // state.cardProgresses = {
      //   ...state.cardProgresses,
      //   ...oldCardProgresses,
      //   ...mapCardProgress
      // }
    },
    setNewMapCardProgressAsync: (state, action: PayloadAction<{ mapCardProgress: MapCardProgress; userId: string }>) => {
      const { mapCardProgress } = action.payload;
      state.cardProgresses = mapCardProgress;
    },
    setFetchedCardProgress: (state, action: PayloadAction<boolean>) => {
      state.fetchedCardProgresses = action.payload;
    },
    setOpenRestartGameDialog: (state, action: PayloadAction<boolean>) => {
      state.openRestartDialog = action.payload;
    },
    setOpenSubmitGameDialog: (state, action: PayloadAction<boolean>) => {
      state.openSubmitDialog = action.payload;
    },
    setOpenQuitGameDialog: (state, action: PayloadAction<boolean>) => {
      state.openQuitGameDialog = action.payload;
    },
    setGameType: (state, action: PayloadAction<GameTypes>) => {
      state.gameType = action.payload
    },
    setShowResultOnAnswer: (state, action: PayloadAction<boolean | null>) => {
      state.showResultOnAnswer = action.payload
    },
    setTestView: (state, action: PayloadAction<GameStatus>) => {
      state.gameStatus = action.payload;
    },
    setGameStatus: (state, action: PayloadAction<GameStatus>) => {
      state.gameStatus = action.payload;
    },
    setFlashCardView: (state, action: PayloadAction<FlashCardView>) => {
      state.flashCardView = action.payload;
    },
    setQuestionsPlayNum: (state, action: PayloadAction<number>) => {
      state.questionsPlayNum = action.payload;
    },
    setCardStudyOrder: (state, action: PayloadAction<CardStudyOrder>) => {
      state.cardStudyOrder = action.payload;
    },
    setGameDuration: (state, action: PayloadAction<number>) => {
      state.duration = action.payload
    },
    updatePlayedTime: (state, action: PayloadAction<number>) => {
      state.playedTime = action.payload;
    },
    setPauseForSubmit: (state, action: PayloadAction<boolean>) => {
      state.pauseForSubmit = action.payload
    },
    changeQuestionItem: (state: GameState, action: PayloadAction<{
      item: QuestionItem;
      gameViewOnly?: boolean;
      showReviewNav?: boolean;
      force?: boolean;
    }>) => {
      const { item, gameViewOnly = false, showReviewNav, force } = action.payload;
      let isDisabled = false;
      if (state.gameStatus === GameStatus.PLAY) {
        const itemGameId = item.path[0] ?? item.id;
        const currentItemGameId = state.currentQuestion?.path?.[0] ?? state.currentQuestion?.id
        if (state.specialGame === SpecialGame.IELTS_SPEAKING) {
          isDisabled = true;
        } else if (state.specialGame === SpecialGame.IELTS_WRITING) {
          if (itemGameId !== currentItemGameId) {
            isDisabled = true;
          }
        } else if (state.specialGame === SpecialGame.TOEIC_SPEAKING) {
          isDisabled = true;
        } else if (state.specialGame === SpecialGame.TOEIC_WRITING) {
          if (itemGameId !== currentItemGameId) {
            isDisabled = true;
          }
        }
      }
      if (state.gameSetting?.testConfig?.toeicLR?.simulationMode) {
        if (state.gameStatus === GameStatus.REVIEW) {
          isDisabled = false
        } else {
          if (state.gameStatus !== GameStatus.PLAY) isDisabled = true;
          else if (item.skillType === SKILL_TYPE_LISTENING) isDisabled = true;
          else if (item.skillType === SKILL_TYPE_READING) {
            isDisabled = state.currentQuestion?.skillType === SKILL_TYPE_LISTENING;
          }
        }
      }
      if (state.gameSetting?.usePracticeOverview && state.practiceView !== PracticeView.DEFAULT) {
        isDisabled = true;
      }
      if (!force && isDisabled) return;
      const gameObjectIdx = _.findIndex(state.gameObjects, { id: item.path[0] ?? item.id });
      if (gameObjectIdx !== -1) {
        state.currentGame = state.gameObjects[gameObjectIdx];
        state.currentGameViewIdx = gameObjectIdx;
        if (!gameViewOnly) {
          const currentQuestionIdx = item.index - 1;
          state.currentQuestionIdx = currentQuestionIdx;
          state.currentQuestion = state.questionItems[currentQuestionIdx];
          state.currentGameIdx = gameObjectIdx;
        } else {
          if (state.currentGameIdx === gameObjectIdx) {
            const currentQuestionIdx = item.index - 1;
            state.currentQuestionIdx = currentQuestionIdx
            state.currentQuestion = state.questionItems[currentQuestionIdx];
          }
        }
      }
      if (typeof showReviewNav !== "undefined") {
        state.showReviewNav = showReviewNav
      }
    },

    setLoadingGame: (state, action: PayloadAction<boolean>) => {
      if (action.payload) state.userPlaying = false;
      state.loading = action.payload
    },
    resetGameState: (state) => {
      Object.keys(initialState).forEach((stateKey) => {
        if (stateKey !== "cardProgresses") {
          state[stateKey] = initialState[stateKey];
        }
      });
    },
    resetGameStateAfterQuitting: (state) => {
      Object.keys(initialState).forEach((stateKey) => {
        state[stateKey] = initialState[stateKey];
      });
    },
    onStartGame: (state: GameState, action: PayloadAction<{
      cards?: Card[];
      /** Flat Array of skills */
      skills?: Skill[];
      cardProgresses?: MapCardProgress;
      userId?: string;
      topicId?: string;
      replayMode?: ReplayMode;
      boxCard?: { [cardId: string]: number };
      cardBookmarks?: string[];
    }>) => {
      const {
        cards = [],
        skills = [],
        cardProgresses = {},
        userId = '',
        topicId = '',
        replayMode = ReplayMode.NONE,
        boxCard = {},
        cardBookmarks = []
      } = action.payload;
      if (replayMode === ReplayMode.NONE) {
        let specialGame: SpecialGame = SpecialGame.NONE;
        if (state.gameType === GameTypes.FLASH_CARD) specialGame = SpecialGame.FLASH_CARD;
        else if (state.gameType === GameTypes.TEST && !!state.gameSetting.currentSkill) {
          if (state.gameSetting.contentType === EXAM_TYPE_TOEIC) {
            if (state.gameSetting.currentSkill.type === SKILL_TYPE_SPEAKING) specialGame = SpecialGame.TOEIC_SPEAKING;
            else if (state.gameSetting.currentSkill.type === SKILL_TYPE_WRITING) specialGame = SpecialGame.TOEIC_WRITING;
          } else if (state.gameSetting.contentType === EXAM_TYPE_IELTS) {
            if (state.gameSetting.contentType === EXAM_TYPE_IELTS) {
              if (state.gameSetting.currentSkill.type === SKILL_TYPE_SPEAKING) specialGame = SpecialGame.IELTS_SPEAKING;
              else if (state.gameSetting.currentSkill.type === SKILL_TYPE_WRITING) specialGame = SpecialGame.IELTS_WRITING;
            }
          }
        }
        state.specialGame = specialGame;
        const { gameObjects, questionItems } = genGame({
          cards,
          skills,
          cardProgresses,
          topicId,
          userId,
          boxCard,
          cardBookmarks,
          specialGame
        });

        state.gameObjects = gameObjects;
        state.questionItems = questionItems;
        state.totalQuestions = questionItems.length;
        state.totalCorrect = questionItems.filter((item) => item.status === GameObjectStatus.ANSWERED && item.correct).length;
        state.totalIncorrect = questionItems.filter((item) => item.status === GameObjectStatus.ANSWERED && !item.correct).length;
        state.cardBookmarks = cardBookmarks;
        // if (state.gameSetting
        //   && state.gameSetting.gameType === GameTypes.TEST
        //   && state.gameSetting.currentSkill
        //   && state.gameSetting.currentSkill.type === SKILL_TYPE_WRITING
        //   && state.gameSetting.gameStatus === GameStatus.REVIEW) {
        //   state.questionItems = questionItems.map((qI) => {
        //     const parentId = qI.path[0];
        //     if (parentId && cardProgresses[`${topicId}_${parentId}`]) {
        //       qI.setProgress({ correct: true, status: GameObjectStatus.ANSWERED })
        //     }
        //     return qI;
        //   });
        // }

        if (!!gameObjects.length && gameObjects.every((go) => go.status === GameObjectStatus.ANSWERED) && state.showResultOnAnswer) {
          state.gameStatus = GameStatus.REVIEW;
        } else {
          state.replayMode = replayMode;
          if (state.showResultOnAnswer) {
            state.gameStatus = GameStatus.PLAY;
          }
          const isContinueSpecialGame = ([
            SpecialGame.IELTS_SPEAKING,
            SpecialGame.IELTS_WRITING,
            SpecialGame.TOEIC_SPEAKING
          ].includes(specialGame) && state.gameSetting.gameStatus === GameStatus.CONTINUE);
          const isTOEICLRSimulator = state.gameSetting?.testConfig?.toeicLR?.simulationMode;
          const isContinue = state.showResultOnAnswer || isContinueSpecialGame || isTOEICLRSimulator;
          const { nextGameObject, nextIndex } = onContinue({
            gameObjects,
            showResultOnAnswer: isContinue
          });

          if (nextGameObject) {
            state.currentGame = nextGameObject;
            const currentQuestionIdx = _.findIndex(questionItems, (item) =>
              (item?.path[0] ?? item?.id) === nextGameObject.id
              && (isContinueSpecialGame ? item.status === GameObjectStatus.NOT_ANSWER : true)
            );
            state.currentQuestionIdx = currentQuestionIdx;
            state.currentQuestion = questionItems[currentQuestionIdx]
            state.currentGameIdx = nextIndex;
            if (isTOEICLRSimulator) state.showSkillTutorial = true;
          }
        }
      } else {
        state.replayMode = replayMode;
        const { nextGameObject, nextIndex } = onContinue({
          gameObjects: state.gameObjects,
          showResultOnAnswer: state.showResultOnAnswer,
          replayMode
        });
        if (nextGameObject) {
          state.currentGame = nextGameObject;
          const currentQuestionIdx = _.findIndex(state.questionItems, (item) => (item?.path[0] || item?.id) === nextGameObject.id);
          state.currentQuestionIdx = currentQuestionIdx;
          state.currentQuestion = state.questionItems[currentQuestionIdx]
          state.currentGameIdx = nextIndex;
          state.gameStatus = GameStatus.PLAY;
        } else {
          const { gameStatus, practiceView } = getPracticeOverviewGameStatusOnEnd(state);
          state.gameStatus = gameStatus;
          state.practiceView = practiceView;
        }
      }
      if (typeof boxCard !== "undefined") {
        state.boxCard = boxCard;
      }
      state.isUserInteracted = false;
      state.loading = false;
    },
    onAnswer: (state: GameState, action: PayloadAction<{
      questionItem: QuestionItem;
      cardProgress?: ClientCardProgress;
      isSplitPointAnswers?: boolean;
      splitCorrectNum?: number;
    }>) => {
      if (!state.userPlaying) state.userPlaying = true;
      const { questionItem, cardProgress, isSplitPointAnswers, splitCorrectNum } = action.payload;
      //const currentGame: GameObject = currentGameObject ?? GameObject.clone(state.currentGame);
      // const currentGame: GameObject = GameObject.clone(state.currentGame);
      if ((questionItem.path[0] || questionItem.id) === state.currentGame?.id || (state.displayMode === GameDisplayMode.ALL_IN_PAGE)) {
        const oldQuestionItem = state.questionItems[questionItem.index - 1]
        state.questionItems[questionItem.index - 1] = questionItem;
        // if (state.showResultOnAnswer) {
        if (isSplitPointAnswers) {
          const oldSplittedQuestionItems = state.questionItems.filter((item) => item.id === questionItem.id);
          oldSplittedQuestionItems.forEach((item, i) => {
            const _questionItem = QuestionItem.clone(questionItem);
            _questionItem.correct = i <= splitCorrectNum - 1;
            _questionItem.index = item.index
            state.questionItems[item.index - 1] = _questionItem;
          });
          // state.totalCorrect = state.questionItems.filter((item) => item.status === GameObjectStatus.ANSWERED && item.correct).length;
          // state.totalIncorrect = state.questionItems.filter((item) => item.status === GameObjectStatus.ANSWERED && !item.correct).length;
        } else {
          // if (oldQuestionItem.status === GameObjectStatus.NOT_ANSWER) {
          //   if (questionItem.correct) state.totalCorrect += 1;
          //   else state.totalIncorrect += 1;
          // } else if (oldQuestionItem.status === GameObjectStatus.ANSWERED) {
          //   if (oldQuestionItem.correct) {
          //     if (!questionItem.correct) {
          //       state.totalCorrect -= 1;
          //       state.totalIncorrect += 1;
          //     }
          //   } else {
          //     if (questionItem.correct) {
          //       state.totalCorrect += 1;
          //       state.totalIncorrect -= 1;
          //     }
          //   }
          // }
        }
        state.totalCorrect = state.questionItems.filter((item) => item.status === GameObjectStatus.ANSWERED && item.correct).length;
        state.totalIncorrect = state.questionItems.filter((item) => item.status === GameObjectStatus.ANSWERED && !item.correct).length;

        const currentGameItems = state.questionItems.filter((item) => (item.path[0] || item.id) === state.currentGame?.id);
        if (currentGameItems.every((item) => item.status === GameObjectStatus.ANSWERED)) {
          const gameObjectIdx = state.gameObjects.findIndex((go) => go.id === state.currentGame?.id);
          if (gameObjectIdx !== -1) {
            const gameObject = state.gameObjects[gameObjectIdx];
            gameObject.setProgress({
              status: GameObjectStatus.ANSWERED,
              correct: currentGameItems.every((item) => item.correct)
            });
            if (gameObject instanceof FlashCardGameObject) {
              const currentBoxNum = gameObject.boxNum;
              const newBoxNum = questionItem.correct
                ? (currentBoxNum >= 0 ? (currentBoxNum >= 5 ? 5 : currentBoxNum + 1) : 1)
                : (currentBoxNum <= 0 ? (currentBoxNum <= -5 ? -5 : currentBoxNum - 1) : 0);
              gameObject.setBoxNum(newBoxNum);
              if (!!cardProgress) {
                const newBoxCard = {
                  ...state.boxCard,
                  [cardProgress.cardId]: newBoxNum
                }
                state.boxCard = newBoxCard
                state.updateBoxCard = newBoxCard;
              }
            }
            state.gameObjects[gameObjectIdx] = gameObject;
          }
          state.showNext = true;
        } else {
          if (state.currentGame instanceof ParaGameObject) {
            // Para graph
            const currentQuestionIdx = questionItem.index - 1
            state.currentQuestionIdx = currentQuestionIdx;
            state.currentQuestion = state.questionItems[currentQuestionIdx];
          }

        }
        if (!!cardProgress) state.cardProgresses = { ...state.cardProgresses, [cardProgress.id]: cardProgress };
      }
      if (state.displayMode === GameDisplayMode.ALL_IN_PAGE) {
        state.currentQuestion = questionItem;
        state.currentQuestionIdx = questionItem.index - 1;
      }
    },
    // For Special Game Writing with multiple child ONLY
    upsertListQuestionItem: (state, action: PayloadAction<Array<QuestionItem>>) => {
      action.payload.forEach((qI) => {
        const idx = state.questionItems.findIndex((e) => e.id === qI.id);
        if (idx !== -1) state.questionItems[idx] = qI;
      })
      state.totalCorrect = state.questionItems.filter((e) => e.status === GameObjectStatus.ANSWERED && e.correct).length;
      state.totalIncorrect = state.questionItems.filter((e) => e.status === GameObjectStatus.ANSWERED && !e.correct).length;
    },
    upsertListCardProgress: (state, action: PayloadAction<Array<ClientCardProgress>>) => {
      action.payload.forEach((cp) => {
        state.cardProgresses[cp.id] = cp;
      })
    },
    updateCardProgress: (state, action: PayloadAction<ClientCardProgress>) => {
      const cardProgress = action.payload;
      state.cardProgresses[cardProgress.id] = cardProgress;
    },
    getPreviousGameObject: (state) => {
      if (!state.showResultOnAnswer) {
        if (state.currentGameIdx - 1 >= 0) {
          const prevIndex = state.currentGameIdx - 1;
          const prevGameObject = state.gameObjects[prevIndex];

          if (prevGameObject) {
            state.currentGame = prevGameObject;
            state.currentGameIdx = prevIndex;
            const currentQuestionIdx = _.findIndex(state.questionItems, (item) => (item.path[0] ?? item.id) === prevGameObject.id);
            if (currentQuestionIdx !== -1) {
              state.currentQuestionIdx = currentQuestionIdx;
              state.currentQuestion = state.questionItems[currentQuestionIdx];
            }
          }
        }
      }
    },
    getNextGameObject: (state) => {
      const { nextGameObject, nextIndex } = onContinue({
        gameObjects: state.gameObjects,
        showResultOnAnswer: state.showResultOnAnswer,
        currentIndex: state.currentGameIdx,
        replayMode: state.replayMode
      });
      state.currentGame = nextGameObject;
      if (!!nextGameObject) {
        state.currentGameIdx = nextIndex;
        const currentQuestionIdx = _.findIndex(state.questionItems, (item) => (item.path[0] ?? item.id) === nextGameObject.id);
        state.currentQuestionIdx = currentQuestionIdx;
        state.currentQuestion = state.questionItems[currentQuestionIdx];
      } else {
        const { gameStatus, practiceView } = getPracticeOverviewGameStatusOnEnd(state);
        state.gameStatus = gameStatus;
        state.practiceView = practiceView;
      }
    },
    getNextFlashCardGameObject: (state) => {
      const { nextGameObject, nextIndex } = onContinueFlashCard({ gameObjects: state.gameObjects as FlashCardGameObject[], currentIndex: state.currentGameIdx });
      state.currentGameIdx = nextIndex;
      state.currentGameViewIdx = nextIndex;
      if (nextGameObject) {
        state.currentGame = nextGameObject;
      } else {
        // Return Review Flash Card
        state.flashCardView = FlashCardView.END;
      }
    },
    setShowNext: (state, action: PayloadAction<boolean>) => {
      state.showNext = action.payload
    },
    setShowReviewNav: (state, action: PayloadAction<boolean>) => {
      state.showReviewNav = action.payload;
    },
    setIsCheckShowCollapse: (state, action: PayloadAction<boolean>) => {
      state.isCheckShowCollapse = action.payload;
    },
    getGameReviewNav: (state, action: PayloadAction<{ isNext: boolean }>) => {
      const { isNext } = action.payload;
      if (isNext && state.currentGameViewIdx !== state.gameObjects.length - 1
        || (!isNext && state.currentGameViewIdx - 1 !== 0)
      ) {

      }
      const idx = isNext ? state.currentGameViewIdx + 1 : state.currentGameViewIdx - 1;
      state.currentGameViewIdx = idx;
      state.currentGame = state.gameObjects[idx];
      if (idx === state.currentGameIdx) state.showReviewNav = false;
    },
    returnEndGameState: (state: GameState, action: PayloadAction<{
      returnFirstGame: boolean;
      essayEnd: boolean;
    }>) => {
      const { returnFirstGame, essayEnd } = action.payload;
      state.currentGameIdx = returnFirstGame ? 0 : -1;
      state.currentQuestionIdx = returnFirstGame ? 0 : -1;
      state.currentGame = returnFirstGame ? state.gameObjects.at(0) : null;
      state.currentQuestion = returnFirstGame ? state.questionItems.at(0) : null;
      state.essayEnd = essayEnd;
    },
    resetCardProgresses: (state: GameState, action: PayloadAction<{ topicId: string; }>) => {
      state.questionItems.forEach((item) => {
        const key = `${action.payload.topicId}_${item.id}`;
        if (state.cardProgresses[key]) {
          delete state.cardProgresses[key];
        }
      })
    },
    onStartFlashCardGame: (state: GameState) => {
      const gameObjects = [...(state.gameObjects as FlashCardGameObject[])].map((go) => { go.render = true; return go; });
      const questionsNum = state.questionsPlayNum;
      const cardStudyOrder = state.cardStudyOrder;
      const totalQuestions = state.totalQuestions;
      const newGameObjects: FlashCardGameObject[] = [];
      if (cardStudyOrder === CardStudyOrder.NEW) {
        newGameObjects.push(...(_.shuffle(gameObjects.filter((go) => go.status === GameObjectStatus.NOT_ANSWER))));
      } else if (cardStudyOrder === CardStudyOrder.MEMORIZED) {
        newGameObjects.push(...(_.shuffle(gameObjects.filter((go) => go.status === GameObjectStatus.ANSWERED && go.isCorrect))));
      } else if (cardStudyOrder === CardStudyOrder.UNMEMORIZED) {
        newGameObjects.push(...(_.shuffle(gameObjects.filter((go) => go.status === GameObjectStatus.ANSWERED && !go.isCorrect))));
      } else if (cardStudyOrder === CardStudyOrder.MARKED) {
        newGameObjects.push(...(_.shuffle(gameObjects.filter((go) => go.bookmark))));
      } else {
        newGameObjects.push(...(_.sampleSize(gameObjects, questionsNum)))
      }

      if (newGameObjects.length < totalQuestions) {
        const unRenderedGameObjects = gameObjects
          .filter((go) => !newGameObjects.find(({ id }) => id === go.id))
          .map((go) => { go.render = false; return go; });
        newGameObjects.push(...unRenderedGameObjects);
      }

      state.gameObjects = newGameObjects;
      const { nextGameObject, nextIndex } = onContinueFlashCard({ gameObjects: newGameObjects });
      state.currentGameIdx = nextIndex;
      state.currentGameViewIdx = nextIndex;
      if (nextGameObject) {
        state.currentGame = nextGameObject;
      } else {
        // Return Review Flash Card
        state.flashCardView = FlashCardView.END;
      }
    },
    // onSubmitFillPara: (state: GameState, action: PayloadAction<{
    //   gameObject: FillParaGameObject;
    //   arrCardProgress: SpellingClientCardProgress[];
    // }>) => {
    //   const { gameObject, arrCardProgress } = action.payload;
    //   const childGameObjects = gameObject.childGameObjects;
    //   childGameObjects.forEach((go) => {
    //     const questionItem = state.questionItems.find((item) => item.id === go.id);
    //     go.setProgress({ correct: !!questionItem?.correct, status: GameObjectStatus.ANSWERED });
    //   });
    //   const gameQuestions = state.questionItems.filter((item) => item.path.includes(gameObject.id));
    //   gameQuestions.forEach((item) => {
    //     item.setProgress({ correct: item.correct, status: GameObjectStatus.ANSWERED });
    //   });
    //   gameObject.setProgress({ correct: gameQuestions.every((item) => item.status === GameObjectStatus.ANSWERED && item.correct), status: GameObjectStatus.ANSWERED });
    //   state.totalCorrect = state.questionItems.filter((item) => item.status === GameObjectStatus.ANSWERED && item.correct).length;
    //   state.totalIncorrect = state.questionItems.filter((item) => item.status === GameObjectStatus.ANSWERED && !item.correct).length;
    //   arrCardProgress.forEach((cardProgress) => {
    //     // const oldCardProgress = state.cardProgresses[cardProgress.id];
    //     // const newCardProgress = !!oldCardProgress
    //     //   ? SpellingClientCardProgress.clone(oldCardProgress as SpellingClientCardProgress)
    //     //   : cardProgress;
    //     // Object.assign(newCardProgress, oldCardProgress || {});
    //     state.cardProgresses[cardProgress.id] = cardProgress;
    //   });

    //   if (gameObject.id !== state.currentGame?.id) {
    //     const rootGameItems = state.questionItems.filter((item) => (item.path[0] || item.id) === state.currentGame?.id);
    //     if (rootGameItems.every((item) => item.status === GameObjectStatus.ANSWERED)) {
    //       const gameObjectIdx = state.gameObjects.findIndex((go) => go.id === state.currentGame?.id);
    //       if (gameObjectIdx !== -1) {
    //         const gameObject = state.gameObjects[gameObjectIdx];
    //         gameObject.setProgress({
    //           status: GameObjectStatus.ANSWERED,
    //           correct: rootGameItems.every((item) => item.correct)
    //         });
    //         state.gameObjects[gameObjectIdx] = gameObject;
    //       }
    //       state.showNext = true;
    //     }
    //   } else {
    //     state.showNext = true;
    //   }
    // },
    setUpdateBoxCard: (state, action: PayloadAction<MapCardBox | null>) => {
      state.updateBoxCard = action.payload;
    },
    setshowQuestionsOnReview: (state, action: PayloadAction<boolean>) => {
      state.showQuestionsOnReview = action.payload;
    },
    setDisableAutoPlayAudio: (state, action: PayloadAction<boolean>) => {
      state.disableAutoPlayAudio = action.payload;
    },
    setRootParaExplanationHeight: (state, action: PayloadAction<number>) => {
      state.rootParaExplanationHeight = action.payload;
    },
    setCheckFinishGame: (state, action: PayloadAction<boolean>) => {
      state.checkFinishGame = action.payload;
    },
    setCheckStartPractice: (state, action: PayloadAction<boolean>) => {
      state.checkStartPractice = action.payload;
    },
    setCurrentCardId: (state, action: PayloadAction<string>) => {
      state.currentCardId = action.payload;
    },
    // setShowPracticeOverview: (state, action: PayloadAction<boolean>) => {
    //   state.showPracticeOverview = action.payload;
    // },
    setTotalCardStudy: (state, action: PayloadAction<number>) => {
      state.totalCardStudy = action.payload;
    },
    setDisplayMode: (state, action: PayloadAction<number>) => {
      state.displayMode = action.payload;
    },
    setIsPracticeFlashCard: (state, action: PayloadAction<boolean>) => {
      state.isPracticeFlashCard = action.payload;
    },
    clearCardProgresses: (state) => {
      state.cardProgresses = {};
    },
    // TODO: implement outside of module
    setStudyScoreDataIdReview: (state, action: PayloadAction<string>) => {
      state.studyScoreDataIdReview = action.payload;
    },
    setCurrentPlayingAudioId: (state, action: PayloadAction<string>) => {
      state.currentPlayingAudioId = action.payload;
    },
    setShowSkillTutorial: (state, action: PayloadAction<boolean>) => {
      state.showSkillTutorial = action.payload;
    },
    setPracticeView: (state, action: PayloadAction<PracticeView>) => {
      state.practiceView = action.payload;
    },
    updateGameSetting: (state, action: PayloadAction<Partial<GameSetting>>) => {
      if (state.gameSetting) {
        Object.keys(action.payload).forEach((key) => {
          if (action.payload.hasOwnProperty(key)) state.gameSetting[key] = action.payload[key];
        })
      }
    },
    setUserInteracted: (state, action: PayloadAction<boolean>) => {
      state.isUserInteracted = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(getNextGameObjectModeShowResultOnAnswer.fulfilled, (state, action) => {
      const { nextGameObject, nextIndex } = action.payload;
      state.currentGame = nextGameObject;
      if (!!nextGameObject) {
        state.currentGameIdx = nextIndex;
        const currentQuestionIdx = _.findIndex(state.questionItems, (item) => (item.path[0] ?? item.id) === nextGameObject.id);
        state.currentQuestionIdx = currentQuestionIdx;
        state.currentQuestion = state.questionItems[currentQuestionIdx];
      } else {
        const { gameStatus, practiceView } = getPracticeOverviewGameStatusOnEnd(state);
        state.gameStatus = gameStatus;
        state.practiceView = practiceView;
        if (state.replayMode !== ReplayMode.NONE) state.replayMode = ReplayMode.NONE;
      }
    })
  }
});

export const {
  initGameSetting,
  setGameKey,
  setCardsList,
  setMapExamTypeSkillsKey,
  setGameType,
  setTestView,
  setGameStatus,
  setFlashCardView,
  setQuestionsPlayNum,
  setCardStudyOrder,
  setGameDuration,
  updatePlayedTime,
  setPauseForSubmit,
  setShowResultOnAnswer,
  changeQuestionItem,
  setLoadingGame,
  resetGameState,
  resetGameStateAfterQuitting,
  onStartGame,
  onAnswer,
  upsertListQuestionItem,
  upsertListCardProgress,
  updateCardProgress,
  // onSubmitFillPara,
  getPreviousGameObject,
  getNextGameObject,
  getNextFlashCardGameObject,
  setShowNext,
  setShowReviewNav,
  getGameReviewNav,
  returnEndGameState,
  resetCardProgresses,
  setFetchedCardProgress,
  setMapCardProgressAsync,
  setNewMapCardProgressAsync,
  setOpenRestartGameDialog,
  setOpenSubmitGameDialog,
  setOpenQuitGameDialog,
  setIsCheckShowCollapse,
  onStartFlashCardGame,
  setUpdateBoxCard,
  setshowQuestionsOnReview,
  setDisableAutoPlayAudio,
  setRootParaExplanationHeight,
  setCheckFinishGame,
  setCheckStartPractice,
  setCurrentCardId,
  // setShowPracticeOverview,
  setTotalCardStudy,
  setDisplayMode,
  setIsPracticeFlashCard,
  clearCardProgresses,
  setStudyScoreDataIdReview,
  setCurrentPlayingAudioId,
  setShowSkillTutorial,
  setPracticeView,
  updateGameSetting,
  setUserInteracted
  // setEnableChildGameAds,
} = gameSlice.actions;

// Logic
export function sortCards(cards: Card[]) {
  const sortedCards = [...cards].sort((a, b) => a.orderIndex - b.orderIndex).map((card) => {
    const _card = { ...card };
    if (card.hasChild === CARD_HAS_CHILD) {
      _card.childCards = sortCards(card.childCards ?? []);
    }
    return _card;
  });
  return sortedCards
}

type SpecialGameObject =
  IELTSSpeakingGameObject |
  IELTSWritingGameObject |
  TOEICSpeakingGameObject |
  TOEICWritingGameObject;

function genGame(args: {
  cards: Card[];
  skills?: Skill[];
  userId: string;
  topicId: string;
  cardProgresses: MapCardProgress;
  boxCard?: { [cardId: string]: number };
  cardBookmarks?: string[];
  specialGame?: SpecialGame;
}) {
  const {
    cards,
    skills = [],
    userId,
    topicId,
    cardProgresses,
    boxCard = {},
    cardBookmarks = [],
    specialGame = SpecialGame.NONE
  } = args;
  const questionItems: QuestionItem[] = [];
  const gameObjects: GameObject[] = [];

  const genGameFromCard = (args: {
    card: Card;
    path: string[];
    depth?: number;
    parentSkillType?: number;
  }) => {
    const { card, path, depth = 0, parentSkillType } = args;
    let gameObject: GameObject;
    const _questionItems: QuestionItem[] = [];
    const cardType = card.type > 0 ? card.type : parentSkillType;
    const skill = skills.length ? _.find(skills, (e) => e.value === cardType) : undefined;

    if (depth > 2) return null;

    if (specialGame === SpecialGame.FLASH_CARD) {
      const boxNum = boxCard[card._id];
      const bookmark = cardBookmarks.includes(card._id);
      const _card = Object.assign({}, card, { boxNum, bookmark, render: true });
      gameObject = new FlashCardGameObject(_card);
      const _cardProgress = cardProgresses[`${topicId}_${card._id}`];
      const cardProgress = _cardProgress?.userId === userId ? _cardProgress : undefined;
      const questionItem = new QuestionItem({
        id: card._id,
        correct: cardProgress?.correct ?? false,
        status: !!cardProgress && cardProgress.correct !== undefined ? GameObjectStatus.ANSWERED : GameObjectStatus.NOT_ANSWER,
        path
      });
      questionItems.push(questionItem);
      _questionItems.push(questionItem);
    } else if ([
      SpecialGame.IELTS_SPEAKING,
      SpecialGame.IELTS_WRITING,
      SpecialGame.TOEIC_SPEAKING,
      SpecialGame.TOEIC_WRITING
    ].includes(specialGame)) {
      const genSpecialSkillGame = <R extends SpecialGameObject>(args: {
        card: Card;
        skill?: Skill;
        cardProgress?: ClientCardProgress;
        constructorFunc: (args: { card?: Card; skill?: Skill }) => R;
      }): R => {
        const {
          card,
          skill,
          cardProgress,
          constructorFunc,
        } = args;
        const gameObject = constructorFunc({ card, skill });
        gameObject.progress = cardProgress;
        if (card.hasChild === CARD_HAS_CHILD) {
          const childGameObjects: R[] = [];
          const childQuestionItems: QuestionItem[] = [];
          (card.childCards ?? []).map((childCard) => {
            const {
              gameObject: childGameObject,
              questionItems: _childQuestionItems
            } = genGameFromCard({
              card: childCard,
              path: [...path, card._id],
              depth: depth + 1,
              parentSkillType: !depth ? card.type : parentSkillType
            });
            if (!!childGameObject) childGameObjects.push(childGameObject as R);
            childQuestionItems.push(..._childQuestionItems);
          });
          (gameObject as R).childGameObjects = childGameObjects;
        } else {
          const questionItem = new QuestionItem({
            id: card._id,
            correct: cardProgress?.correct ?? false,
            status: !!cardProgress && cardProgress.correct !== undefined && cardProgress.correct !== null ? GameObjectStatus.ANSWERED : GameObjectStatus.NOT_ANSWER,
            path,
            skillValue: card.type > 0 ? card.type : parentSkillType
          });
          questionItems.push(questionItem);
          _questionItems.push(questionItem);
        }
        return gameObject;
      }
      const _cardProgress = cardProgresses[`${topicId}_${card._id}`];
      const cardProgress = _cardProgress?.userId === userId ? _cardProgress : undefined;
      const _gameObject = genSpecialSkillGame({
        card, skill, cardProgress,
        constructorFunc: (args) => {
          if (specialGame === SpecialGame.IELTS_SPEAKING) return new IELTSSpeakingGameObject(args);
          else if (specialGame === SpecialGame.IELTS_WRITING) return new IELTSWritingGameObject(args);
          else if (specialGame === SpecialGame.TOEIC_SPEAKING) return new TOEICSpeakingGameObject(args);
          else if (specialGame === SpecialGame.TOEIC_WRITING) return new TOEICWritingGameObject(args);
          return null;
        }
      });
      if (_gameObject) gameObject = _gameObject;
    } else {
      if (card.hasChild === CARD_HAS_CHILD) {
        // GEN PARA Object
        const childGameObjects: GameObject[] = [];
        const childQuestionItems: QuestionItem[] = [];
        card.childCards?.map((childCard) => {
          const {
            gameObject: childGameObject,
            questionItems: _childQuestionItems
          } = genGameFromCard({
            card: childCard,
            path: [...path, card._id],
            depth: depth + 1,
            parentSkillType: !depth ? card.type : parentSkillType
          });
          if (!!childGameObject) childGameObjects.push(childGameObject);
          childQuestionItems.push(..._childQuestionItems);
        });
        if (card.question.text.includes(CLASS_GAME_FILL_PARAGRAPH) || card.setting.isGapFilling) {
          gameObject = new FillParaGameObject(card);
          (gameObject as FillParaGameObject).childGameObjects = (childGameObjects as SpellingGameObject[]).sort((a, b) => a.index - b.index);
          // if (childQuestionItems.some((item) => item.status !== GameObjectStatus.ANSWERED)) {
          //   childQuestionItems.forEach((item) => {
          //     item.status = GameObjectStatus.NOT_ANSWER;
          //   });
          // }
        } else {
          gameObject = new ParaGameObject(card);
          (gameObject as ParaGameObject).childGameObjects = childGameObjects;
          const _cardProgress = cardProgresses[`${topicId}_${card._id}`];
          const cardProgress = _cardProgress?.userId === userId ? _cardProgress : undefined;
          if (!!cardProgress) (gameObject as ParaGameObject).totalTime = cardProgress.answerOptional?.totalTime ?? 0;
        }
      } else {
        const _cardProgress = cardProgresses[`${topicId}_${card._id}`];
        const cardProgress = _cardProgress?.userId === userId ? _cardProgress : undefined;

        const answersNum = card.setting.splitPointAnswers && card.answer.texts.length > 1
          ? card.answer.texts.length
          : 1;
        // Palette Items
        const __questionItems = _.range(answersNum).map((_, qI) => {
          let status = GameObjectStatus.NOT_ANSWER;
          if (cardProgress) {
            if (cardProgress.skip) status = GameObjectStatus.SKIP;
            else {
              status = cardProgress.correct !== undefined && cardProgress.correct !== null ? GameObjectStatus.ANSWERED : GameObjectStatus.NOT_ANSWER
            }
          }
          return new QuestionItem({
            id: card._id,
            correct: answersNum > 1
              ? (!!cardProgress ? qI <= (cardProgress as QuizClientCardProgress).correctNum - 1 : false)
              : (cardProgress?.correct ?? false),
            status,
            path,
            skillValue: card.type > 0 ? card.type : parentSkillType,
            skillType: skill?.type
          })
        });
        _questionItems.push(...__questionItems);

        // GameObject
        const gameType = card.games?.length ? _.sample(card.games) : null;

        if (_.isNil(gameType) || ![
          CardGames.quiz,
          CardGames.spelling
        ].includes(gameType)) {
          if (card.answer.choices.length) {
            gameObject = new QuizGameObject(card);
            _questionItems.forEach((item) => {
              if (!!cardProgress) {
                item.setSelectedChoices((cardProgress as QuizClientCardProgress).selectedChoices);
              }
            });
          } else {
            gameObject = new SpellingGameObject(card);
            _questionItems.forEach((item) => {
              if (!!cardProgress) {
                item.setAnswerText((cardProgress as SpellingClientCardProgress).answer);
              }
            });
          }
        } else if (gameType === CardGames.quiz) {
          gameObject = new QuizGameObject(card);
          _questionItems.forEach((item) => {
            if (!!cardProgress) {
              item.setSelectedChoices((cardProgress as QuizClientCardProgress).selectedChoices);
            }
          });
        } else if (gameType === CardGames.spelling) {
          gameObject = new SpellingGameObject(card);
          _questionItems.forEach((item) => {
            if (!!cardProgress) {
              item.setAnswerText((cardProgress as SpellingClientCardProgress).answer);
            }
          });
        } else if (gameType === CardGames.matching) {

        }
        questionItems.push(..._questionItems);
      }
    }
    if (gameObject) gameObject.skill = skill;
    if (!depth) {
      if (gameObject) {
        const gameQuestions = questionItems.filter((item) => (item?.path[0] || item.id) === gameObject?.id);
        const isAnswered = gameQuestions.every((item) => item.status === GameObjectStatus.ANSWERED);
        const isSkipped = gameQuestions.some((item) => item.status === GameObjectStatus.SKIP);
        if (isAnswered) {
          gameObject.setProgress({
            status: GameObjectStatus.ANSWERED,
            correct: gameQuestions.every((item) => item.correct)
          });
        } else if (isSkipped) {
          gameObject.status = GameObjectStatus.SKIP;
          gameObject.isCorrect = gameQuestions.every((item) => item.correct)
        }
        gameObjects.push(gameObject);
      }
    }
    return {
      gameObject,
      questionItems: _questionItems
    };
  }

  cards.map((card) => {
    genGameFromCard({ card, path: [] });
  });

  return {
    gameObjects,
    questionItems: questionItems.map((e, i) => { e.index = i + 1; return e; })
  }
}

function onContinue(args: {
  gameObjects: GameObject[];
  showResultOnAnswer: boolean;
  currentIndex?: number;
  replayMode?: ReplayMode;
}) {
  const {
    gameObjects,
    showResultOnAnswer,
    currentIndex = -1,
    replayMode = ReplayMode.NONE
  } = args;
  let nextGameObject: GameObject;
  let nextIndex = -1;
  if (showResultOnAnswer) {
    switch (replayMode) {
      case ReplayMode.NONE:
        nextIndex = _.findIndex(gameObjects, (go, index) => {
          return index > currentIndex && go.status !== GameObjectStatus.ANSWERED
        });
        break;
      case ReplayMode.CORRECT:
        nextIndex = _.findIndex(gameObjects, (go, index) => {
          return index > currentIndex && go.status === GameObjectStatus.ANSWERED && go.isCorrect
        });
        break;
      case ReplayMode.INCORRECT:
        nextIndex = _.findIndex(gameObjects, (go, index) => {
          return index > currentIndex && go.status === GameObjectStatus.ANSWERED && !go.isCorrect
        });
        break;
      case ReplayMode.ALL:
        nextIndex = _.findIndex(gameObjects, (go, index) => {
          return index > currentIndex
        });
        break;
      case ReplayMode.NEW:
        nextIndex = _.findIndex(gameObjects, (go, index) => {
          return index > currentIndex && go.status !== GameObjectStatus.ANSWERED
        });
        break;
      default:
        break;
    }
    if (nextIndex !== -1) nextGameObject = gameObjects[nextIndex];
  } else {
    if (currentIndex + 1 < gameObjects.length) {
      nextGameObject = gameObjects[currentIndex + 1];
      nextIndex = currentIndex + 1;
    }
  }
  return {
    nextGameObject: nextGameObject ?? null,
    nextIndex
  }
}

function onContinueFlashCard(args: {
  gameObjects: FlashCardGameObject[];
  currentIndex?: number;
}) {
  const {
    gameObjects,
    currentIndex = -1
  } = args;
  let nextGameObject: FlashCardGameObject;
  const nextIndex = gameObjects.findIndex((go, i) => go.render && i > currentIndex);
  if (nextIndex !== -1) nextGameObject = gameObjects[nextIndex];
  return { nextGameObject: nextGameObject ?? null, nextIndex }
}

function recursiveGetCardIds(acc: string[], inp: Card[]) {
  inp.forEach((c) => {
    acc.push(c._id);
    if (c.hasChild === CARD_HAS_CHILD) {
      recursiveGetCardIds(acc, c.childCards ?? []);
    }
  });
  return acc;
}

function getPracticeOverviewGameStatusOnEnd(state: GameState) {
  let gameStatus = GameStatus.REVIEW;
  let practiceView = PracticeView.DEFAULT;
  if (state.gameType === GameTypes.PRACTICE && state.gameSetting?.usePracticeOverview) {
    if (state.showResultOnAnswer) {
      const totalAnswered = state.questionItems.filter((qI) => qI.status === GameObjectStatus.ANSWERED).length;
      if (totalAnswered < state.totalQuestions) {
        gameStatus = GameStatus.PLAY;
        practiceView = PracticeView.OVERVIEW;
      } else {
        gameStatus = GameStatus.REVIEW;
      }
    } else {
      // TODO
    }
  } else {
    gameStatus = GameStatus.REVIEW;
  }
  return { gameStatus, practiceView }
}

// const gameSliceReducer = typeof window === "undefined"
//   ? gameSlice.reducer
//   : persistReducer({
//     key: "game-v2",
//     storage: gameLocalStore,
//     whitelist: ["cardProgresses"],
//     timeout: null
//   }, gameSlice.reducer);

const gameSliceReducer = gameSlice.reducer

export default gameSliceReducer;
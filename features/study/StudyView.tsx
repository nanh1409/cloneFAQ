import ArrowBack from "@mui/icons-material/ArrowBack";
import ChevronRight from "@mui/icons-material/ChevronRight";
import { Box, Button, Container, Drawer, Typography, useMediaQuery, useTheme } from "@mui/material";
import { unwrapResult } from "@reduxjs/toolkit";
import classNames from "classnames";
import _ from "lodash";
import dynamic from "next/dynamic";
import { useSnackbar } from "notistack";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "../../app/hooks";
import { ROUTER_GET_PRO, ROUTER_LOGIN, ROUTER_STUDY } from "../../app/router";
import CustomTOEICOverview from "../../components/CustomTOEICOverview";
import FBComments from "../../components/FBComments";
import SkillOverview from "../../components/skill-custom-overview/SkillOverview";
import useAppConfig from "../../hooks/useAppConfig";
import WordListView from "../../modules/new-game/src/components/flashCard/WordListView/WordListView";
import GameView, { GameViewRefType } from "../../modules/new-game/src/components/GameView";
import LoadingGameIcon from "../../modules/new-game/src/components/LoadingGameIcon";
import { FlashCardView, GameDisplayMode, GameFeatureLockType, GameStatus, GameTypes } from "../../modules/new-game/src/models/game.core";
import { GameSetting } from "../../modules/new-game/src/models/GameSetting";
import { BAREM_SCORE_DEFAULT, EXAM_SCORE_FINISH, EXAM_SCORE_PAUSE, EXAM_SCORE_PLAY, EXAM_SCORE_WAITING, EXAM_TYPE_IELTS, EXAM_TYPE_TOEIC, SKILL_TYPE_LISTENING, SKILL_TYPE_READING, SKILL_TYPE_SPEAKING, SKILL_TYPE_WRITING, TOPIC_CONTENT_TYPE_FLASH_CARD, TOPIC_TYPE_EXERCISE, TOPIC_TYPE_LESSON, TOPIC_TYPE_TEST } from "../../modules/share/constraint";
import { Card } from "../../modules/share/model/card";
import Topic from "../../modules/share/model/topic";
import { apiHost } from "../../utils/fetcher";
import { openUrl } from "../../utils/system";
import ThirdPartyAds from "../ads/third-party-ads";
import FeedbackCardMenu from "../feedbacks/FeedbackCardMenu";
import FeedBackDialog from "../feedbacks/FeedbackDialog";
import useUserPaymentInfo from "../get-pro/useUserPaymentInfo";
import { setLastCardProgress } from "../study-plan/studyPlan.slice";
import CurrentTopicList from "./CurrentTopicList";
import { sendStartLearningEvent } from "./hooks/useStudyStatsCookie";
import useSyncStudyData, { fetchMapCardProgress } from "./hooks/useSyncStudyData";
import { getAnalyticsAccount, handleCollectPracticeHistory } from "./hooks/useTopicHistory";
import AllPracticesIcon from "./icons/AllPracticesIcon";
import LevelIcon from "./icons/LevelIcon";
import NavPauseGameIcon from "./icons/NavPauseGameIcon";
import NavRestartIcon from "./icons/NavRestartIcon";
import NavSubmitGameIcon from "./icons/NavSubmitGameIcon";
import QuestionPaletteIcon from "./icons/QuestionPaletteIcon";
import QuestionPalette from "./QuestionPalette/QuestionPalette";
import useQuestionPaletteConfig from "./QuestionPalette/useQuestionPaletteConfig";
import IELTSOverview from "./skill-based-exam/ielts";
import TOEICSWOverview from "./skill-based-exam/toeic";
import "./studyView.scss";
import SubTopicList from "./SubTopicList";
import TheoryPanel from "./TheoryPanel";
import { ClientTopicProgress, UpdateAppPracticeDataArgs } from "./topic.model";
import {
  createAppPracticeData,
  createSkillGame,
  fetchCards,
  fetchCardsByIds,
  fetchCurrentTopic,
  fetchSkillsByExamType,
  fetchTopicProgresses,
  initCardOrderPractice,
  initClientTopicProgress,
  MapCurrentProgress,
  requestSyncBoxCard,
  resetCardStudyData,
  resetOnChangeCurrentTopic,
  setCardsList,
  setDataSimulationMode,
  setFetchedCard, setInitGame,
  setMapCardProgressInit,
  setMapCurrentProgress,
  setSkillBasedExam,
  setSortedCard,
  setStudyScoreDataId,
  TopicItem,
  updateAppPracticeData,
  updateTopicBoxCard,
  updateTopicCardBookmarks,
  updateTopicProgress
} from "./topic.slice";
import { getRelaProgress, LocalGameTimeUtils, sortCards } from "./topic.utils";
import CommentSection from "../../components/comment-section";

const AdsSelector = dynamic(() => import("../ads/AdsSelector"), { ssr: false });
const GoogleAdsense = dynamic(() => import("../ads/google-adsense"), { ssr: false });

enum StudyNavItemType {
  NONE = 'none',
  PRACTICES = 'practices',
  LEVELS = 'levels',
  QUESTIONS = 'questions',
  GAME = 'game',
  BACK_SKILL_BASED_GAME = 'back_skill_based_game'
}

export type StudyPage = "default" | "custom-test" | "test" | "flash-card";

const StudyView = (props: {
  levelListLabel?: string;
  practiceListLabel?: string;
  /** Show SubList only */
  singleList?: boolean;
  onClickSubTopic?: (topic: Topic) => void;
  gameTitle?: string;
  tabletNavCol?: number;
  cardIds?: string[];
  hideAllList?: boolean;
  hideTabletGameControl?: boolean;
  hideSubList?: boolean;
  addFBComment?: boolean;
  type?: StudyPage;
  simulationMode?: boolean;
}) => {
  const {
    levelListLabel = 'Topics',
    practiceListLabel = 'Practices',
    singleList,
    onClickSubTopic,
    gameTitle,
    tabletNavCol: _tabletNavCol = 4,
    cardIds,
    hideAllList,
    hideTabletGameControl,
    hideSubList,
    addFBComment,
    type,
    simulationMode,
  } = props;
  const hasGtag = typeof gtag !== "undefined";
  const appConfig = useAppConfig();
  const openTabletMenu = useSelector((state) => state.studyLayoutState.openTabletMenu);
  const { rootTopic, subTopic, currentTopic, loading, hasSub, fetchedTopicProgresses, list, topicProgresses, studyScoreDataId, studyScoreId } = useSelector((state) => state.topicState);
  const { userId, user } = useSelector((state) => state.authState);
  const mapCurrentProgress = useSelector((state) => state.topicState.mapCurrentProgress);
  const cards = useSelector((state) => state.topicState.cards);
  const mapExamTypeSkills = useSelector((state) => state.topicState.mapExamTypeSkills);
  const fetchedCard = useSelector((state) => state.topicState.fetchedCard);
  const sortedCard = useSelector((state) => state.topicState.sortedCard);
  const isSkillBasedExam = useSelector((state) => state.topicState.isSkillBasedExam);
  const fetchedSkillBasedProgress = useSelector((state) => state.topicState.fetchedSkillBasedProgress);
  const currentSkillConfig = useSelector((state) => state.topicState.currentSkillConfig);
  const totalSkills = useSelector((state) => state.topicState.totalSkills);
  const mapSkillStudyScoreData = useSelector((state) => state.topicState.mapSkillStudyScoreData);
  const mapCardProgresses = useSelector((state) => state.topicState.mapCardProgresses);
  const gameType = useSelector((state) => state.gameState.gameType);
  const gameStatus = useSelector((state) => state.gameState.gameStatus);
  const showQuestionsOnReview = useSelector((state) => state.gameState.showQuestionsOnReview);
  const flashCardView = useSelector((state) => state.gameState.flashCardView);
  const showResultOnAnswer = useSelector((state) => state.gameState.showResultOnAnswer);
  const rootParaExplanationHeight = useSelector((state) => state.gameState.rootParaExplanationHeight);
  const forceHideSubTopicTheory = useSelector((state) => state.studyLayoutState.forceHideSubTopicTheory);
  const studyPlan = useSelector((state) => state.studyPlanState.currentStudyPlan);

  const [tabletItemHovering, setTabletItemHovering] = useState<StudyNavItemType>(StudyNavItemType.NONE);
  const [tabletItemActive, setTabletItemActive] = useState<StudyNavItemType>(StudyNavItemType.NONE);
  // Game
  const [gameSetting, setGameSetting] = useState<GameSetting | null>(null);
  const [isCreateGame, setCreateGame] = useState<boolean | null>(null);
  // const [mapCardProgress, setMapCardprogress] = useState<MapCardProgress | null | "unfetched">("unfetched");
  const gameViewRef = useRef<GameViewRefType>();

  const dispatch = useDispatch();

  const theme = useTheme();
  const isSmallDesktop = useMediaQuery(theme.breakpoints.between("lg", "xl"));
  const isTabletUI = useMediaQuery(appConfig.appName === "ielts" ? "(max-width: 1920px)" : theme.breakpoints.down("lg"));
  const isTablet = appConfig.appName === "ielts" ? useMediaQuery("(max-width: 1920px)") : useMediaQuery(theme.breakpoints.between('sm', 'lg'));
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const { enqueueSnackbar } = useSnackbar();
  const { isValidTopicAccess, paymentLoading, isProAcc } = useUserPaymentInfo();

  const {
    handleOnAnswer,
    handleSubmitListAnswer,
    handleUpdateGameProgress,
    handleClickPlayTest,
    handleOnUpdateCardBookmarks,
    onRestartGame,
    onSubmitGame
  } = useSyncStudyData();
  const analyticsAccount = getAnalyticsAccount();

  const gameDisplayMode = useMemo(() => {
    if (currentTopic?.type === TOPIC_TYPE_TEST) {
      if (
        // Toeic RL
        (currentTopic?.topicExercise?.contentType === EXAM_TYPE_TOEIC && !isSkillBasedExam)
        // IELTS 4 Skills
        || (currentTopic?.topicExercise?.contentType === EXAM_TYPE_IELTS
          && isSkillBasedExam
          && [SKILL_TYPE_LISTENING, SKILL_TYPE_READING].includes(currentSkillConfig?.type)
        )
      ) {
        return GameDisplayMode.ALL_IN_PAGE;
      }
    }
    return GameDisplayMode.DEFAULT;
  }, [currentTopic?._id, isSkillBasedExam, currentSkillConfig?.type]);

  const { disableStat, handleBackSkillBasedGame, isSubmitDisabled } = useQuestionPaletteConfig();

  const displayRightSideAds = useMemo(() =>
    (gameType === GameTypes.TEST
      && (gameStatus === GameStatus.PLAY || gameStatus === GameStatus.REVIEW)
      && gameDisplayMode === GameDisplayMode.ALL_IN_PAGE
    ) || (showResultOnAnswer && gameStatus === GameStatus.REVIEW && showQuestionsOnReview)
    , [gameType, gameStatus, gameDisplayMode, showResultOnAnswer, showQuestionsOnReview]);

  const tabletNavCol = useMemo(() => {
    let col = _tabletNavCol;
    if (isSkillBasedExam) {
      if (!!currentSkillConfig) {
        col = gameStatus === GameStatus.PLAY ? 5 : 3;
        if (type === "default") col += 1;
        if (isSubmitDisabled) col -= 1;
      } else {
        col = 1;
        if (type === "default") col = 2
      }
    }
    return col;
  }, [_tabletNavCol, isSkillBasedExam, !!currentSkillConfig, gameStatus, type]);

  const subTopicListPlacement = useMemo(() => {
    let placement: "bot" | "left" = "bot";
    if (gameDisplayMode === GameDisplayMode.ALL_IN_PAGE
      || (showResultOnAnswer && gameStatus === GameStatus.REVIEW && showQuestionsOnReview)
      || (gameType === GameTypes.FLASH_CARD && flashCardView === FlashCardView.OVERVIEW)
    ) {
      placement = "left";
    }
    return placement;
  }, [gameDisplayMode, showResultOnAnswer, gameStatus, showQuestionsOnReview, gameType, flashCardView]);

  const isTOEICSW = useMemo(() => {
    return currentTopic?.type === TOPIC_TYPE_TEST
      && currentTopic?.topicExercise?.contentType === EXAM_TYPE_TOEIC
      && isSkillBasedExam
      && [SKILL_TYPE_SPEAKING, SKILL_TYPE_WRITING].includes(currentSkillConfig?.type)
  }, [currentTopic?._id, isSkillBasedExam, currentSkillConfig?._id]);

  const isTOEICLR = useMemo(() => {
    return currentTopic?.type === TOPIC_TYPE_TEST
      && currentTopic?.topicExercise?.contentType === EXAM_TYPE_TOEIC
      && !isSkillBasedExam
  }, [currentTopic?._id, isSkillBasedExam])

  useEffect(() => {
    return () => {
      resetState();
    }
  }, []);

  useEffect(() => {
    if (!!currentTopic?._id) {
      resetState();
      setTimeout(() => {
        if (currentTopic.type === TOPIC_TYPE_LESSON) {
          dispatch(fetchCurrentTopic({ topicId: currentTopic._id }))
            .then(unwrapResult)
            .then(() => {
              // setMapCardprogress(null);
              dispatch(setMapCardProgressInit(null));
              dispatch(setFetchedCard(true));
              dispatch(setSkillBasedExam(false));
            })
        } else if (currentTopic.type === TOPIC_TYPE_TEST) {
          if (!!currentTopic.topicExercise.topicSettingId) {
            dispatch(setSkillBasedExam(true));
          } else {
            dispatch(setSkillBasedExam(false));
          }
        } else {
          dispatch(setSkillBasedExam(false));
        }
      }, 100);
    }
  }, [currentTopic?._id]);

  useEffect(() => {
    if (isTOEICLR)
      dispatch(setDataSimulationMode({ topicId: currentTopic._id, userId, simulationMode }));
  }, [currentTopic._id, simulationMode]);

  useEffect(() => {
    const examType = currentTopic?.topicExercise?.contentType;
    if (examType === EXAM_TYPE_TOEIC || examType === EXAM_TYPE_IELTS) {
      if (!mapExamTypeSkills[examType]?.fetched) {
        dispatch(fetchSkillsByExamType({ examType }));
      }
    }
  }, [currentTopic?.topicExercise?.contentType, mapExamTypeSkills]);

  useEffect(() => {
    if (isSkillBasedExam !== null) {
      if (!isSkillBasedExam) {
        if (!!currentTopic?._id && currentTopic?.type !== TOPIC_TYPE_LESSON && !fetchedCard) {
          if (typeof cardIds !== "undefined") {
            dispatch(fetchCardsByIds(cardIds));
          } else {
            dispatch(fetchCards({ topicId: currentTopic._id }));
          }
        }
      }
    }
  }, [currentTopic?._id, fetchedCard, isSkillBasedExam]);

  useEffect(() => {
    if (!list.length) return;
    if (!!currentTopic?._id && !fetchedTopicProgresses) {
      if (!!user) {
        dispatch(fetchTopicProgresses({
          topicIds: list.map((e) => e._id),
          userId,
          currentTopicId: currentTopic._id,
          currentTopicType: currentTopic.type,
          isSkillBasedExam: !!currentTopic.topicExercise?.topicSettingId
        }))
      } else {
        dispatch(initClientTopicProgress({ userId }));
      }
    }
  }, [currentTopic?._id, fetchedTopicProgresses, list.length]);

  useEffect(() => {
    if (fetchedTopicProgresses && !mapCurrentProgress) {
      const items: TopicItem[] = [];
      if (subTopic) items.push(subTopic);
      if (currentTopic) items.push(currentTopic);
      if (hasSub && rootTopic) items.push(rootTopic as TopicItem);
      const mapCurrentProgress = items.reduce((map, item) => {
        const _list = list.filter((e) => e.parentId === item.parentId);
        // let _list = sameParentList;
        // // .filter((e) => e.type !== TOPIC_TYPE_TEST);
        // if (sameParentList.some((e) => e.type !== TOPIC_TYPE_LESSON)) _list = _list.filter((e) => e.type !== TOPIC_TYPE_LESSON);
        map[item._id] = {
          parentId: item.parentId,
          relaProgress: getRelaProgress({ list: _list, topicProgresses, userId, item }),
          totalParts: _list.length,
          currentProgress: topicProgresses[item._id]
        }
        return map;
      }, {} as MapCurrentProgress);
      dispatch(setMapCurrentProgress(mapCurrentProgress));
      if (currentTopic.type === TOPIC_TYPE_LESSON) {
        dispatch(updateTopicProgress(new ClientTopicProgress({ topicId: currentTopic._id, userId, progress: 100 })));
      }
      const progressId = `${currentTopic._id}${currentSkillConfig ? `_${currentSkillConfig._id}` : ""}`;
      let topicProgress = topicProgresses[progressId];
      topicProgress = topicProgress?.userId === userId ? topicProgress : undefined;
    }
  }, [mapCurrentProgress, fetchedTopicProgresses]);

  useEffect(() => {
    if (isSkillBasedExam === false && fetchedCard && !!mapCurrentProgress) {
      initGame();
    }
  }, [!!mapCurrentProgress, fetchedCard, isSkillBasedExam]);

  useEffect(() => {
    if (sortedCard && mapCardProgresses === "unfetched" && !isSkillBasedExam && isCreateGame !== null) {
      if (!!user) {
        if (!fetchedTopicProgresses) return;
        if (isCreateGame) {
          // setMapCardprogress({});
          dispatch(setMapCardProgressInit({}));
        } else {
          if (studyScoreDataId) {
            fetchMapCardProgress({
              studyScoreDataId,
              userId,
              flashCardGame: currentTopic?.type === TOPIC_TYPE_EXERCISE && currentTopic?.topicExercise?.contentType === TOPIC_CONTENT_TYPE_FLASH_CARD,
              useSkipStatus: simulationMode,
              topicId: currentTopic._id
            }).then((mapCardProgress) => {
              // setMapCardprogress(mapCardProgress);
              dispatch(setMapCardProgressInit(mapCardProgress));
            });
          } else {
            dispatch(setMapCardProgressInit(null));
          }
        }
      } else {
        setTimeout(() => {
          dispatch(setMapCardProgressInit(null));
          // setMapCardprogress(null);
        }, 100);
      }
    }
  }, [isSkillBasedExam, mapCardProgresses, sortedCard, studyScoreDataId, isCreateGame, fetchedTopicProgresses]);

  useEffect(() => {
    if (isSkillBasedExam && fetchedCard && !!currentSkillConfig) {
      initGame();
    }
  }, [isSkillBasedExam, currentSkillConfig?._id, fetchedCard]);

  useEffect(() => {
    const unsetGame = () => {
      if (gameSetting) setGameSetting(null);
      return;
    }
    if (loading) return unsetGame();
    if (paymentLoading) return unsetGame();
    if (!currentTopic) return unsetGame();
    if (currentTopic.type !== TOPIC_TYPE_LESSON) {
      if (isSkillBasedExam === null) return unsetGame();
      if (!isSkillBasedExam && !fetchedTopicProgresses) {
        return unsetGame();
      } else if (isSkillBasedExam && (!currentSkillConfig || !fetchedSkillBasedProgress)) {
        return unsetGame();
      }
    }
    if (mapCardProgresses === "unfetched") return unsetGame();
    let gameType = GameTypes.INIT;
    let showResultOnAnswer = true;
    let playedTime = 0;
    let duration = (currentTopic.topicExercise?.duration ?? 0) * 60;
    let displayMode = GameDisplayMode.DEFAULT;
    let gameStatus: GameStatus | null = null;

    const progressId = `${currentTopic._id}${currentSkillConfig ? `_${currentSkillConfig._id}` : ""}`;
    let topicProgress = topicProgresses[progressId];
    topicProgress = topicProgress?.userId === userId ? topicProgress : undefined;
    let lockType: GameFeatureLockType = null;
    if (currentTopic.type === TOPIC_TYPE_EXERCISE) {
      if (currentTopic.topicExercise?.contentType === TOPIC_CONTENT_TYPE_FLASH_CARD) {
        gameType = GameTypes.FLASH_CARD;
      } else {
        // Review?: gameStatus = GameStatus.REVIEW;
        gameType = GameTypes.PRACTICE;
      }
    } else if (currentTopic.type === TOPIC_TYPE_TEST) {
      gameType = GameTypes.TEST;
      showResultOnAnswer = false;
      if (isSkillBasedExam && currentSkillConfig) {
        duration = currentSkillConfig.timeStudy || 0;
        if (currentSkillConfig.type === SKILL_TYPE_SPEAKING && !user) {
          lockType = "login";
        }
      }
      gameStatus = GameStatus.NEW;
      if (topicProgress) {
        playedTime = topicProgress.totalTime || 0;
        if (topicProgress.status === EXAM_SCORE_PLAY || topicProgress.status === EXAM_SCORE_PAUSE) {
          gameStatus = GameStatus.CONTINUE;
        } else if (topicProgress.status === EXAM_SCORE_FINISH) {
          gameStatus = GameStatus.REVIEW;
        }
      }
      if (isSkillBasedExam) {
        if (gameStatus === GameStatus.REVIEW) {
          if (currentSkillConfig.skillTestView === GameStatus.PLAY) {
            gameStatus = GameStatus.PLAY;
          } else {
            gameStatus = currentSkillConfig.skillTestView;
          }
        }
      }
      if (
        // TOEIC RL
        (currentTopic.topicExercise?.contentType === EXAM_TYPE_TOEIC
          && ![SKILL_TYPE_SPEAKING, SKILL_TYPE_WRITING].includes(currentSkillConfig?.type)
        ) || (currentTopic.topicExercise?.contentType === EXAM_TYPE_IELTS
          && isSkillBasedExam
          && [SKILL_TYPE_LISTENING, SKILL_TYPE_READING].includes(currentSkillConfig?.type)
        )
      ) {
        displayMode = GameDisplayMode.ALL_IN_PAGE;
      }
    } else if (currentTopic.type === TOPIC_TYPE_LESSON) {
      gameType = GameTypes.LESSON;
    }
    if (!isValidTopicAccess(currentTopic)) {
      lockType = "upgrade-plan";
    }
    if (gameType !== GameTypes.INIT) {
      let boxCard = topicProgress?.boxCard ? { ...topicProgress.boxCard } : topicProgress?.boxCard;

      if (gameType === GameTypes.FLASH_CARD && !!mapCardProgresses && !!boxCard) {
        let syncBoxCard = false;
        Object.values(mapCardProgresses).forEach(({ cardId, correct }) => {
          const box = correct ? 1 : 0;
          if (_.has(boxCard, cardId)) {
            const boxFromBoxCard = boxCard[cardId];
            if (box !== boxFromBoxCard) {
              syncBoxCard = true;
              if (correct) {
                boxCard[cardId] = boxFromBoxCard > 0 ? boxFromBoxCard : box;
              } else {
                boxCard[cardId] = boxFromBoxCard <= 0 ? boxFromBoxCard : box;
              }
            }
          } else {
            boxCard[cardId] = box;
            syncBoxCard = true;
          }
        });

        if (syncBoxCard) {
          if (!!user) {
            dispatch(requestSyncBoxCard({ topicId: currentTopic._id, userId, boxCard }));
          } else {
            dispatch(updateTopicBoxCard({ topicId: currentTopic._id, boxCard }));
          }
        }
      }
      const gameSetting: GameSetting = {
        // Init Config
        topicId: currentTopic._id,
        userId,
        gameType,
        gameStatus,
        currentSkill: currentSkillConfig,
        duration,
        topicName: currentTopic.name,
        topicDescription: currentTopic.description,
        topicVideoUrl: currentTopic.videoUrl,
        contentType: currentTopic.topicExercise?.contentType,
        passScore: currentTopic.topicExercise?.pass ?? 0,
        baremScore: currentTopic.topicExercise?.baremScore ?? BAREM_SCORE_DEFAULT,
        uploadURL: !!user ? `${apiHost}/api/upload-file?baseFolder=${appConfig.appName}/practice-audio&disableAttachment=true` : "",
        // Progress Init State
        playedTime,
        boxCard,
        cardBookmarks: topicProgress?.cardBookmarks,
        cardProgresses: mapCardProgresses || undefined,
        // GamePlay Setting
        skipOverview: isSkillBasedExam,
        usePracticeOverview: true,
        shuffleQuestion: currentTopic.type === TOPIC_TYPE_EXERCISE,
        showResultOnAnswer,
        showQuestionsOnReview: ["toeic", "ielts"].includes(appConfig.appName),
        disableUnloadEvent: true,
        disableFixedClock: true,
        displayMode,
        // Game Display Setting
        defaultBackground: !(isSkillBasedExam && currentTopic.topicExercise?.contentType === EXAM_TYPE_TOEIC),
        language: "en",
        mathJax: appConfig.mathJax,
        devMode: appConfig.testMode,
        featureLockType: lockType,
        enableChildGameAds: appConfig.enableChildGameAds && !isProAcc,
        quizExplanationPosition: ["ielts"].includes(appConfig.appName) ? "below" : "after-choice",
        disableHideExplanation: false,
        hideParaQuestionLabel: true,
        useParaTopDownScrollDefault: false,
        useParaLeftRightDefault: !["ielts"].includes(appConfig.appName),
        testConfig: {
          toeicLR: {
            simulationMode: simulationMode,
            useDefaultPrepareTime: false,
            allowPause: true
          }
        }
      }
      setGameSetting(gameSetting);
    }
  }, [
    loading,
    paymentLoading,
    currentTopic?._id,
    fetchedTopicProgresses,
    isSkillBasedExam,
    fetchedSkillBasedProgress,
    currentSkillConfig?._id,
    mapCardProgresses,
    simulationMode
  ]);

  useEffect(() => {
    dispatch(setInitGame(mapCardProgresses === "unfetched"));
  }, [mapCardProgresses]);

  const resetState = () => {
    dispatch(resetOnChangeCurrentTopic());
    setCreateGame(null);
    setGameSetting(null);
    // setMapCardprogress("unfetched");
    dispatch(setMapCardProgressInit("unfetched"));
  }

  const initGame = () => {
    if (!currentTopic || (isSkillBasedExam && !currentSkillConfig)) return;
    if (currentTopic.type === TOPIC_TYPE_LESSON) {
      dispatch(setSortedCard(true));
      return;
    }
    const progressId = `${currentTopic?._id}${currentSkillConfig ? `_${currentSkillConfig._id}` : ""}`;
    const _savedTopicProgress = topicProgresses[progressId];
    let topicProgress = _savedTopicProgress?.userId === userId ? ClientTopicProgress.clone(_savedTopicProgress) : undefined;
    let isCreate = false;
    let isUpdateCardOrder = false;
    let gameStatus: GameStatus = GameStatus.NEW;
    let isPaused = false;
    if (!topicProgress && currentTopic.type !== TOPIC_TYPE_TEST) {
      topicProgress = new ClientTopicProgress({ topicId: currentTopic._id, skillId: currentSkillConfig?._id, userId, status: EXAM_SCORE_PLAY });
      isCreate = true;
    }
    if (currentTopic.type === TOPIC_TYPE_EXERCISE && currentTopic.topicExercise?.contentType === TOPIC_CONTENT_TYPE_FLASH_CARD) {
      dispatch(initCardOrderPractice(topicProgress));
    } else {
      let _cards: Card[] = [];
      if (currentTopic.type === TOPIC_TYPE_TEST) {
        _cards = sortCards(cards);
        if (!!topicProgress) {
          if (topicProgress.status === EXAM_SCORE_PLAY || topicProgress.status === EXAM_SCORE_PAUSE) gameStatus = GameStatus.CONTINUE;
          else if (topicProgress.status === EXAM_SCORE_FINISH) gameStatus = GameStatus.REVIEW;
          if (topicProgress.status === EXAM_SCORE_PAUSE) isPaused = true;
        }
        if (isSkillBasedExam) {
          if (!topicProgress) topicProgress = new ClientTopicProgress({
            topicId: currentTopic._id, skillId: currentSkillConfig._id, userId, status: EXAM_SCORE_WAITING
          });
          if (gameStatus === GameStatus.REVIEW && currentSkillConfig.skillTestView === GameStatus.REVIEW) {
            topicProgress.setStatus(EXAM_SCORE_FINISH);
          } else if (gameStatus === GameStatus.NEW || (gameStatus === GameStatus.REVIEW && currentSkillConfig.skillTestView === GameStatus.PLAY)) {
            topicProgress.setStatus(EXAM_SCORE_WAITING);
          } else {
            topicProgress.setStatus(EXAM_SCORE_PLAY);
          }
          if (gameStatus !== GameStatus.CONTINUE) {
            topicProgress.increaseStudyTime();
            topicProgress.setTotalTime(0);
          }
          if (gameStatus === GameStatus.REVIEW && currentSkillConfig.skillTestView === GameStatus.PLAY) {
            // replay
            topicProgress.setStudyData({ correctNum: 0, incorrectNum: 0, score: 0, progress: 0, totalTime: 0 });
          }
          if (currentSkillConfig.skillTestView === GameStatus.CONTINUE) {
            const localTime = LocalGameTimeUtils.get({ topicId: currentTopic._id, skillId: currentSkillConfig._id, userId });
            if (localTime !== null) {
              topicProgress.setTotalTime(localTime);
            }
          }
          topicProgress.setUserId(userId);
          dispatch(updateTopicProgress(topicProgress));
        } else {
          if (gameStatus === GameStatus.CONTINUE) {
            const localTime = LocalGameTimeUtils.get({ topicId: currentTopic._id, skillId: currentSkillConfig?._id, userId });
            if (localTime !== null) {
              topicProgress.setTotalTime(localTime);
              dispatch(updateTopicProgress(topicProgress));
            }
          }
        }
      } else {
        if (!topicProgress.cardOrder) {
          console.log('New');
          _cards = _.shuffle(cards);
          isUpdateCardOrder = true;
          topicProgress.setCardOrder(_cards.map((e) => e._id));
          dispatch(initCardOrderPractice(topicProgress));
        } else {
          console.log('Continue');
          _cards = _.sortBy(cards, (e) => _.indexOf(topicProgress.cardOrder, e._id));
        }
      }
      dispatch(setCardsList(_cards));
    }
    if (!!user) {
      if (!isSkillBasedExam) {
        // console.log("xxzxc", isUpdateCardOrder, !!studyScoreDataId)
        if (isCreate) {
          dispatch(createAppPracticeData({
            cardOrder: topicProgress.cardOrder, studyTime: topicProgress.studyTime, topicId: currentTopic._id, userId,
            courseId: currentTopic.courseId, parentId: currentTopic.parentId
          }));
        } else if (isUpdateCardOrder && !!studyScoreDataId) {
          dispatch(updateAppPracticeData({ cardOrder: topicProgress.cardOrder, studyScoreId, studyScoreDataId }));
        }
      } else {
        // INIT SKILL BASED ...
        const studyScoreData = mapSkillStudyScoreData[currentSkillConfig._id];
        if (studyScoreData) dispatch(setStudyScoreDataId(studyScoreData._id));
        if (gameStatus === GameStatus.REVIEW || gameStatus === GameStatus.CONTINUE) {
          const completedGames = Object.values(mapSkillStudyScoreData).filter((ssd) => ssd.status === EXAM_SCORE_FINISH).length;
          const rootProgress = Math.round((completedGames > 0 ? completedGames - 1 : 0) * 100 / (totalSkills || 1))
          if (gameStatus === GameStatus.REVIEW && currentSkillConfig.skillTestView === GameStatus.PLAY) {
            const updateAppPracticeDataArgs: UpdateAppPracticeDataArgs = {
              studyScoreDataId: studyScoreData._id,
              studyScoreId: studyScoreData.studyScoreId,
              status: EXAM_SCORE_PLAY,
              progress: 0, totalCorrect: 0, totalIncorrect: 0,
              totalQuestions: topicProgress?.totalCardNum ?? 0,
              studyTime: topicProgress.studyTime,
              totalTime: 0,
              score: 0,
              isSkillBasedExam,
              rootProgress
            }
            dispatch(updateAppPracticeData(updateAppPracticeDataArgs));
            dispatch(resetCardStudyData({ studyScoreDataId: studyScoreData._id }));
          } else if (gameStatus === GameStatus.CONTINUE && isPaused) {
            const updateAppPracticeDataArgs: UpdateAppPracticeDataArgs = {
              studyScoreDataId: studyScoreData._id,
              studyScoreId: studyScoreData.studyScoreId,
              status: EXAM_SCORE_PLAY,
              isSkillBasedExam
            }
            dispatch(updateAppPracticeData(updateAppPracticeDataArgs));
          }
          if ((gameStatus === GameStatus.REVIEW && currentSkillConfig.skillTestView === GameStatus.REVIEW)
            || (gameStatus === GameStatus.CONTINUE && isPaused)) {
            fetchMapCardProgress({
              topicId: currentTopic._id,
              studyScoreDataId: studyScoreData._id,
              userId,
              flashCardGame: false,
              useSkipStatus: simulationMode
            })
              .then((mapCardProgress) => {
                // setMapCardprogress(mapCardProgress);
                dispatch(setMapCardProgressInit(mapCardProgress));
              })
          } else if (gameStatus === GameStatus.REVIEW && currentSkillConfig.skillTestView === GameStatus.PLAY) {
            // setMapCardprogress({});
            dispatch(setMapCardProgressInit({}));
          } else {
            setTimeout(() => {
              // setMapCardprogress(null);
              dispatch(setMapCardProgressInit(null));
            }, 100);
          }
        } else if (gameStatus === GameStatus.NEW) {
          // New Game
          dispatch(createSkillGame({
            studyTime: (topicProgress?.studyTime || 1) + 1,
            courseId: currentTopic.courseId, topicId: currentTopic._id, skillId: currentSkillConfig._id, userId,
            studyScoreId
          }))
            .then(unwrapResult)
            .finally(() => {
              // setMapCardprogress({});
              dispatch(setMapCardProgressInit({}));
            });
        } else {
          setTimeout(() => {
            // setMapCardprogress(null);
            dispatch(setMapCardProgressInit(null));
          }, 100);
        }
      }
    } else {
      setTimeout(() => {
        if (isSkillBasedExam && (gameStatus === GameStatus.NEW || (gameStatus === GameStatus.REVIEW && currentSkillConfig.skillTestView === GameStatus.PLAY))) {
          dispatch(setMapCardProgressInit({}));
        } else {
          // setMapCardprogress(null);
          dispatch(setMapCardProgressInit(null));
        }
      }, 100);
    }
    setCreateGame(isCreate);
    dispatch(setSortedCard(true));
  }

  const renderStudyNavMenuContent = () => {
    switch (tabletItemActive) {
      case StudyNavItemType.PRACTICES:
        return <Box sx={{ pt: "30px", pl: "10px", background: "#fff" }}>
          <SubTopicList
            clickItemCallback={() => { setTabletItemActive(StudyNavItemType.NONE); }}
            list={singleList ? list : undefined}
            onClickTopic={onClickSubTopic}
          />
        </Box>;
      case StudyNavItemType.LEVELS:
        return <Box sx={{ pt: "30px", pl: "10px", pr: "10px", background: "#F2F3F7" }}><CurrentTopicList clickItemCallback={() => { setTabletItemActive(StudyNavItemType.NONE); }} /></Box>
      case StudyNavItemType.QUESTIONS:
        return <Box sx={{ pt: "60px", pl: "10px", pr: "10px", background: "#F2F3F7" }}>
          <QuestionPalette baseComponent={gameViewRef.current?.QuestionPaletteComponent} />
        </Box>;
      default:
        return <></>;
    }
  }

  const renderNextTestButton = () => {
    if (type !== "test" || !currentTopic) return <></>;
    const nextTopic = list.find((_, i) => i > currentTopic.orderIndex);
    if (!nextTopic) return <></>;
    return <Button
      className="game-button game-button-play"
      variant="outlined"
      onClick={() => {
        if (hasGtag) {
          gtag("event", "study", {
            event_category: "nav_next_test",
            event_label: currentTopic._id
          })
        }
        const nextTestUrl = `/${ROUTER_STUDY}/test/${nextTopic.slug}-${nextTopic._id}`;
        openUrl(nextTestUrl);
      }}
      endIcon={<ChevronRight />}
    >
      NEXT TEST
    </Button>
  }

  const renderMainGameView = () => {
    if (loading) return <></>;
    if (isSkillBasedExam === null) return <></>;
    if (!isSkillBasedExam || (!!currentSkillConfig && !!fetchedSkillBasedProgress)) return <>
      {!loading
        && currentTopic
        && fetchedCard
        && sortedCard
        && (mapCardProgresses !== "unfetched")
        && !!gameSetting
        ? <GameView
          ref={gameViewRef}
          gameSetting={gameSetting}
          cards={cards}
          skills={mapExamTypeSkills[currentTopic.topicExercise?.contentType]?.data}
          onAnswer={(args, disableSync) => {
            if (studyPlan?._id && currentTopic?._id) {
              dispatch(setLastCardProgress(args))
            }
            if (!disableSync) handleOnAnswer(args, gameSetting.gameType === GameTypes.FLASH_CARD);
          }}
          onSubmitListAnswer={handleSubmitListAnswer}
          onUpdateGameProgress={handleUpdateGameProgress}
          onUpdateTopicBoxCard={(args) => {
            dispatch(updateTopicBoxCard({ topicId: args.topicId, boxCard: args.boxCard || {} }));
          }}
          onUpdateCardBookmarks={(args) => {
            const { topicId, cardId, bookmark } = args;
            dispatch(updateTopicCardBookmarks({ topicId, cardBookmark: cardId, bookmark }));
            if (studyScoreDataId) handleOnUpdateCardBookmarks({ ...args, updateCardData: true });
          }}
          onStartTestGame={(args) => {
            sendStartLearningEvent({ userId });
            handleClickPlayTest({
              ...args,
              simulationMode
            });
          }}
          onRestartGame={(args) => onRestartGame(args)}
          onSubmitGame={(args) => {
            onSubmitGame(args);
          }}
          onFinishShowResultOnAnswerGame={(args) => {
            handleCollectPracticeHistory({ type: "done", topic: currentTopic, account: analyticsAccount, data: args })
          }}
          onReplayAnsweredQuestions={(args) => {
            handleCollectPracticeHistory({ type: "restart", topic: currentTopic, account: analyticsAccount, data: args })
          }}
          unlockFeatureAction={() => {
            if (gameSetting.featureLockType === "login") {
              const { pathname, search, hash } = window.location;
              const redirectURI = `${pathname}${search}${hash}`;
              const href = `/${ROUTER_LOGIN}/?redirect_uri=${encodeURIComponent(redirectURI)}`;
              openUrl(href);
            } else if (gameSetting.featureLockType === "upgrade-plan") {
              const href = `/${ROUTER_GET_PRO}`;
              openUrl(href);
            }
          }}
          onTestTimeChange={(timeLeft) => {
            LocalGameTimeUtils.set({
              topicId: currentTopic._id,
              skillId: currentSkillConfig?._id,
              second: (gameSetting.duration ?? 0) - timeLeft,
              userId
            })
          }}
          ExplanationAdsComponent={<GoogleAdsense name="The_Leaderboard" height={60} style={{ margin: "8px 0", }} noResponsive enableCheckUpgrade />}
          ReviewGameAdsComponent={<GoogleAdsense name="The_Leaderboard" height={90} noResponsive enableCheckUpgrade />}
          renderSkillOverview={(props) => <SkillOverview {...props} />}
          QuestionPaletteComponentProps={{
            chunkSize: isMobile ? 7 : 8,
            clickItemCallback: () => {
              setTabletItemActive((prev) => {
                if (prev !== StudyNavItemType.NONE) return StudyNavItemType.NONE;
                return prev;
              })
            },
            classes: {
              root: "question-palette-root",
              footer: classNames("question-palette-footer-custom", isTablet || isMobile ? "hidden" : ""),
              gameTitle: "question-palette-game-title",
              questionListRoot: classNames(
                "questions-list-custom",
                isProAcc ? "pro" : ""
              ),
              questionItem: classNames(
                "question-palette-item-custom",
                isTablet ? "tablet" : "",
                isMobile ? "mobile" : ""
              ),
              questionStatProgress: classNames("question-stat-progress", isTablet || isMobile || disableStat ? "hidden" : ""),
            },
            onPauseCallback: () => {
              if (isSkillBasedExam) handleBackSkillBasedGame();
            },
            renderCustomNavForSkillBasedGame: () => {
              return <Button
                startIcon={<ArrowBack />}
                className="button-restart-game"
                onClick={handleBackSkillBasedGame}
              >
                Back
              </Button>
            },
            forceShowFunctions: isSkillBasedExam && !!currentSkillConfig,
          }}
          renderTOEICOverview={(props) => <CustomTOEICOverview
            {...props}
            userAvatar={user?.avatar}
            userName={user?.name ?? "Anonymous"}
            examTimes={topicProgresses[currentTopic._id]?.userId === userId
              ? topicProgresses[currentTopic._id]?.studyTime
              : undefined}
            testDate={topicProgresses[currentTopic._id]?.userId === userId
              ? topicProgresses[currentTopic._id]?.lastUpdate
              : undefined
            }
          />}
          AdditionalTestReviewNavComponent={renderNextTestButton()}
          renderAdditionalGameObjectMenu={(props) => <>
            <FeedbackCardMenu {...props} />
          </>}
          getCDNUrl={(url: string) => {
            if(!process.env.NEXT_PUBLIC_CDN_BUCKET) return url
            if(!process.env.NEXT_PUBLIC_CDN_DOMAIN) return url

            const CDNBucket = process.env.NEXT_PUBLIC_CDN_BUCKET.split(",")
            const GCS_BASE_URL = "https://storage.googleapis.com";

            if(!url.startsWith(GCS_BASE_URL)) { 
              return url
            }
            const path = url.substring(GCS_BASE_URL.length + 1);
            const bucketIdx = path.indexOf("/");

            if(bucketIdx === -1) return url
            
            const bucketName = path.substring(0, bucketIdx);
            if(!CDNBucket.includes(bucketName)) return url

            return `https://${bucketName}.${process.env.NEXT_PUBLIC_CDN_DOMAIN}${path.substring(bucketIdx)}`
          }}
        />
        : <LoadingGameIcon />
      }
    </>;
    switch (currentTopic.topicExercise?.contentType) {
      case EXAM_TYPE_IELTS:
        return <IELTSOverview />;
      case EXAM_TYPE_TOEIC:
        return <TOEICSWOverview />;
      default:
        return <></>;
    }
  }

  return <>
    <div id="main-study-view" className={classNames("main-study-view", isTabletUI ? "tablet" : "")}>
      <Container maxWidth="xl_game" classes={{ root: "main-study-view-container" }} sx={
        appConfig.appName === "ielts" && isTabletUI ? {
          marginRight: "auto !important",
          marginLeft: "auto !important"
        } : {}
      }>
        <div className={classNames("main-study-layout", isTabletUI ? "tablet" : "")}>
          <div className={classNames(
            "study-layout-item study-layout-left",
            isSmallDesktop ? "small-desktop" : "",
            isTabletUI ? "tablet" : ""
          )}>
            <div className={classNames(
              "study-layout-left-wrap",
              gameType === GameTypes.PRACTICE && gameStatus === GameStatus.REVIEW && showQuestionsOnReview && (!hideAllList || !hideSubList) ? "expand" : ""
            )}>
              <Typography component="h2" className="root-topic-name">
                {gameTitle || `${rootTopic?.name}${subTopic && hasSub ? `: ${subTopic?.name}` : ''}`}
              </Typography>
              <QuestionPalette baseComponent={gameViewRef.current?.QuestionPaletteComponent} />
              {/* {!(gameType === GameTypes.TEST && gameStatus === GameStatus.REVIEW && gameDisplayMode === GameDisplayMode.ALL_IN_PAGE)
                && <> */}
              <AdsSelector
                googleAds={<GoogleAdsense name="ListTopicsAds" height={250} style={{ marginBottom: 20 }} enableCheckUpgrade />}
                thirdPartyAds={appConfig.appName === "toeic" && <ThirdPartyAds name="getpro-toeic" type="300x250" style={{ marginBottom: 20 }} storageKey="study_view_list_topics" enableCheckUpgradeCached />}
              />
              {/* </>} */}
              {!hideAllList && <>
                <CurrentTopicList />
                {!hideSubList && subTopicListPlacement === "left" && <div className="sub-list-container">
                  <SubTopicList
                    list={singleList ? list : undefined}
                    onClickTopic={onClickSubTopic}
                  />
                </div>}
              </>}

              {((gameType === GameTypes.TEST && gameStatus === GameStatus.REVIEW) || (gameStatus === GameStatus.REVIEW && showQuestionsOnReview)) && <div className="review-banner-ads">
                <GoogleAdsense name="ReviewBannerAds" enableCheckUpgrade />
              </div>}
            </div>
          </div>

          <div className={classNames("study-layout-item study-layout-mid", isTabletUI ? "tablet" : "", isSmallDesktop ? 'small-desktop' : '')}>
            {<>
              <AdsSelector
                googleAds={<GoogleAdsense name="TopGameAds" style={{ marginBottom: 20 }} enableCheckUpgrade noResponsive={isTabletUI} />}
              // thirdPartyAds={appConfig.appName === "toeic" && <ThirdPartyAds name="getpro-toeic" type="728x90" style={{ marginBottom: 20, textAlign: "center" }} storageKey="study_view_top_game_ads" enableCheckUpgradeCached />}
              />
            </>}
            {!!subTopic?.description
              && !forceHideSubTopicTheory
              && <TheoryPanel topic={subTopic} />}

            {isTabletUI
              && !disableStat
              && gameType !== GameTypes.LESSON
              && (!isSkillBasedExam || !!currentSkillConfig)
              && (<>
                {/* {((gameType === GameTypes.TEST && gameStatus !== GameStatus.PLAY) || (showResultOnAnswer && gameStatus === GameStatus.REVIEW)) && <GoogleAdsense name="GameAds" />} */}
                {showResultOnAnswer
                  ? <div className="tablet-question-stats">{gameViewRef.current?.QuestionStatComponent}</div>
                  : <div className="tablet-question-progress">{gameViewRef.current?.QuestionProgressComponent}</div>}
              </>)}

            {/* {isTOEICLR && gameStatus !== GameStatus.PLAY && <div className="toeic-lr-simulator-check">
              Mode: <Select value={`${simulationMode}`} onChange={(e) => {
                const mode = !!JSON.parse(e.target.value);
                setSimulationMode(mode);
                dispatch(setDataSimulationMode({ topicId: currentTopic._id, userId, simulationMode: mode }))
              }}
                size="small"
                disabled={isDisabledSelectSimulationMode}
              >
                <MenuItem value="false">Default</MenuItem>
                <MenuItem value="true">Simulation</MenuItem>
              </Select>
            </div>} */}
            <div id="game-view-container" className={classNames(
              "game-view-container-main",
              isTOEICSW ? "toeic-sw" : ""
            )}>
              {renderMainGameView()}
            </div>
            {!displayRightSideAds && !((gameType === GameTypes.TEST && gameStatus === GameStatus.REVIEW) || (gameStatus === GameStatus.REVIEW && showQuestionsOnReview))
              && <GoogleAdsense name="GameAds" style={{ marginTop: rootParaExplanationHeight + 50 }} noResponsive enableCheckUpgrade />}
            {gameType === GameTypes.FLASH_CARD
              && flashCardView === FlashCardView.OVERVIEW
              && <WordListView />
            }
            {!isTabletUI && !hideAllList && !hideSubList && subTopicListPlacement === "bot" && <div className="sub-topic-list-container-bot" style={{ marginTop: rootParaExplanationHeight + 50 }}>
              <SubTopicList
                list={singleList ? list : undefined}
                onClickTopic={onClickSubTopic}
                gridView
              />
            </div>}
            {!appConfig.disableComment && <CommentSection />}
            {/* <FBComments key={currentTopic?._id} href={window?.location?.href} hidden={isTabletUI || !addFBComment || !(gameType === GameTypes.LESSON || gameType === GameTypes.FLASH_CARD || gameStatus !== GameStatus.PLAY)} /> */}
          </div>
        </div>
      </Container>
      {!isTabletUI && <div className="main-study-view-side">
        {displayRightSideAds && <GoogleAdsense className="study-side-ads" name="Wide_Skyscraper" height={600} enableCheckUpgrade />}
      </div>}
    </div>

    {isTabletUI && <>
      <div id="tablet-study-view-nav" className={openTabletMenu ? "tablet-nav-open" : ""}>
        <div className="tablet-study-main-nav" style={{ gridTemplateColumns: `repeat(${tabletNavCol}, 1fr)` }}>
          {!hideAllList && !hideSubList && <div className="study-nav-item all-practices-item"
            onMouseEnter={() => setTabletItemHovering(StudyNavItemType.PRACTICES)}
            onMouseLeave={() => setTabletItemHovering(StudyNavItemType.NONE)}
            onClick={() => {
              if (tabletItemActive === StudyNavItemType.PRACTICES) setTabletItemActive(StudyNavItemType.NONE);
              else setTabletItemActive(StudyNavItemType.PRACTICES);
            }}
          >
            <AllPracticesIcon fill={(tabletItemHovering === StudyNavItemType.PRACTICES || tabletItemActive === StudyNavItemType.PRACTICES) ? "#007AFF" : undefined} />
            <div className={classNames("study-nav-item-label", tabletItemActive === StudyNavItemType.PRACTICES ? "active" : "")}>All {practiceListLabel}</div>
          </div>}

          {!hideAllList && !singleList && <div className="study-nav-item all-levels-item"
            onMouseEnter={() => setTabletItemHovering(StudyNavItemType.LEVELS)}
            onMouseLeave={() => setTabletItemHovering(StudyNavItemType.NONE)}
            onClick={() => {
              if (tabletItemActive === StudyNavItemType.LEVELS) setTabletItemActive(StudyNavItemType.NONE);
              else setTabletItemActive(StudyNavItemType.LEVELS);
            }}
          >
            <LevelIcon fill={(tabletItemHovering === StudyNavItemType.LEVELS || tabletItemActive === StudyNavItemType.LEVELS) ? "#007AFF" : undefined} />
            <div className={classNames("study-nav-item-label", tabletItemActive === StudyNavItemType.LEVELS ? "active" : "")}>{levelListLabel}</div>
          </div>}

          {gameType !== GameTypes.FLASH_CARD
            && !(isSkillBasedExam && !currentSkillConfig)
            && <div className="study-nav-item all-questions-item"
              onMouseEnter={() => setTabletItemHovering(StudyNavItemType.QUESTIONS)}
              onMouseLeave={() => setTabletItemHovering(StudyNavItemType.NONE)}
              onClick={() => {
                if (tabletItemActive === StudyNavItemType.QUESTIONS) setTabletItemActive(StudyNavItemType.NONE);
                else setTabletItemActive(StudyNavItemType.QUESTIONS);
              }}
            >
              <QuestionPaletteIcon fill={(tabletItemHovering === StudyNavItemType.QUESTIONS || tabletItemActive === StudyNavItemType.QUESTIONS) ? "#007AFF" : undefined} />
              <div className={classNames("study-nav-item-label", tabletItemActive === StudyNavItemType.QUESTIONS ? "active" : "")}>Question Palette</div>
            </div>}

          {!hideTabletGameControl && <>
            {isSkillBasedExam
              && !!currentSkillConfig
              && <div className="study-nav-item game-item">
                <Button
                  startIcon={<ArrowBack fontSize="small" />}
                  className="study-nav-item-button back-item"
                  onClick={handleBackSkillBasedGame}
                >
                  Back
                </Button>
              </div>
            }

            {!(isSkillBasedExam && !currentSkillConfig) && gameType === GameTypes.TEST && gameStatus === GameStatus.PLAY && <div className="study-nav-item pause-item"
              onClick={() => {
                if (gameViewRef.current) gameViewRef.current.pauseGame();
                if (isSkillBasedExam) handleBackSkillBasedGame();
              }}
            >
              <Button
                startIcon={<NavPauseGameIcon fill="black" />}
                className="study-nav-item-button pause-item"
              >
                Pause
              </Button>
            </div>}

            {!(isSkillBasedExam && !currentSkillConfig) && <div className="study-nav-item game-item"
              onMouseEnter={() => setTabletItemHovering(StudyNavItemType.GAME)}
              onMouseLeave={() => setTabletItemHovering(StudyNavItemType.NONE)}
              onClick={() => {
                if (gameType === GameTypes.TEST) {
                  if (gameStatus === GameStatus.PLAY) {
                    // handleOpenSubmitDialog();
                    if (gameViewRef.current) gameViewRef.current.showSubmitDialog();
                  }
                } else if (gameType === GameTypes.FLASH_CARD) {
                  // if ([FlashCardView.GAME, FlashCardView.CARD].includes(flashCardView)) {
                  //   dispatch(gameSlice.setFlashCardView(FlashCardView.OVERVIEW))
                  // }
                  if (gameViewRef.current) gameViewRef.current.returnOverviewFlashCard();
                } else {
                  if (mapCardProgresses !== "unfetched") {
                    // handleOpenRestartDialog();
                    if (gameViewRef.current) gameViewRef.current.showRestartDialog();
                  }
                }
              }}
            >
              {gameType === GameTypes.TEST
                ? (gameStatus === GameStatus.PLAY && !isSubmitDisabled
                  ? <>
                    <Button
                      startIcon={<NavSubmitGameIcon fill="#FFFFFF" />}
                      className="study-nav-item-button submit-item"
                    >
                      Submit
                    </Button>
                  </>
                  : <></>)
                : (gameType === GameTypes.FLASH_CARD
                  ? ([FlashCardView.CARD, FlashCardView.GAME].includes(flashCardView) && <>
                    <Button
                      startIcon={<NavSubmitGameIcon fill="#fff" />}
                      className="study-nav-item-button submit-item"
                    >
                      End
                    </Button>
                  </>)
                  : <>
                    <Button
                      startIcon={<NavRestartIcon fill="#007aff" />}
                      className="study-nav-item-button restart-item"
                    >
                      Restart
                    </Button>
                  </>)
              }
            </div>}
          </>}
        </div>
      </div>
      <Drawer
        anchor="bottom"
        open={tabletItemActive !== StudyNavItemType.NONE}
        onClose={() => setTabletItemActive(StudyNavItemType.NONE)}
        PaperProps={{
          id: "tablet-study-menu-item-content"
        }}
      >
        {renderStudyNavMenuContent()}
      </Drawer>
    </>}

    <FeedBackDialog courseId={currentTopic?.courseId} userId={userId} />
  </>
}

export default StudyView;
import { Button, Divider, useMediaQuery, useTheme } from "@mui/material";
import classNames from "classnames";
import React, { forwardRef, ReactElement, ReactNode, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { scroller } from "react-scroll";
import { GameContextProvider } from "../context/GameContext";
import { OnAnswerFunction, OnFinishShowResultOnAnswerGame, OnReplayAnsweredQuestions, OnRestartGameFunction, OnStartTestGameFunction, OnSubmitGameFunction, OnSubmitListAnswer, OnUpdateCardBookmarksFunction, OnUpdateGameProgessArgs, OnUpdateGameProgressFunction, OnUpdateTopicBoxCardFunction } from "../context/gameContextTypes";
import { useGameSelector } from "../hooks";
import useQuitGame from "../hooks/useQuitGame";
import useRestartGame from "../hooks/useRestartGame";
import useSubmitGame from "../hooks/useSubmitGame";
import { Card } from "../models/card";
import { FlashCardView, GameDisplayMode, GameStatus, GameTypes, PracticeView } from "../models/game.core";
import { GameSetting } from "../models/GameSetting";
import Skill from "../models/skill";
import { initGameSetting, onStartGame, RENDERED_REVIEW_MIN_INDEX, resetGameState, setDisableAutoPlayAudio, setFetchedCardProgress, setFlashCardView, setMapCardProgressAsync, setMapExamTypeSkillsKey } from "../redux/reducers/game.slice";
import { EXAM_TYPE_IELTS, EXAM_TYPE_TOEIC, SKILL_TYPE_LISTENING, SKILL_TYPE_READING, SKILL_TYPE_SPEAKING, SKILL_TYPE_WRITING } from "../utils/constraints";
import { getDisplayMode, getTestSetting } from "../utils/game.utils";
import { flatMap, isFunction, range, sampleSize } from "../utils/_lodash";
import DelayRender from "./DelayRender";
import EssayEndView from "./EssayEndView";
import FlashCardEndView from "./flashCard/FlashCardEndView";
import { FlashCardGameObject } from "./flashCard/FlashCardGameObject";
import FlashCardNextGameButton from "./flashCard/FlashCardNextGameButton";
import FlashCardOverview from "./flashCard/FlashCardOverview";
import FlashCardPlayGameView from "./flashCard/FlashCardPlayGameView";
import FlashCardPracticeView from "./flashCard/FlashCardPracticeView";
import GameLessonView from "./GameLessonView";
import GameNavButtons from "./GameNavButtons";
import { AdditionalGameObjectMenuProps } from "./GameObjectMenu";
import GameObjectView from "./GameObjectView";
import "./gameView.scss";
import IELTSSpeakingGameView from "./ielts/ielts-speaking";
import { IELTSSpeakingGameObject } from "./ielts/ielts-speaking/IELTSSpeakingGameObject";
import IELTSWritingGameView from "./ielts/ielts-writing";
import { IELTSWritingGameObject } from "./ielts/ielts-writing/IELTSWritingGameObject";
import LoadingGameIcon from "./LoadingGameIcon";
import { ParaGameObject } from "./para/ParaGameObject";
import PracticeOverview from "./PracticeOverview";
import QuestionPalette, { QuestionPaletteProps } from "./QuestionPalette";
import QuestionProgress, { QuestionProgressProps } from "./QuestionProgress";
import QuestionStat, { QuestionStatProps } from "./QuestionStat";
import SkillTutorial from "./skill-tutorial";
import SkillStats, { RenderSkillOverviewFunction } from "./SkillStats";
import TestClock, { TestClockRef } from "./test-clock";
import TestOverview from "./TestOverview";
import { TOEICSpeakingGameObject } from "./toeic/toeic-speaking/TOEICSpeakingGameObject";
import TOEICSpeakingGameView from "./toeic/toeic-speaking/TOEICSpeakingGameView";
import { TOEICWritingGameObject } from "./toeic/toeic-writing/TOEICWritingGameObject";
import TOEICWritingGameView from "./toeic/toeic-writing/TOEICWritingGameView";
import { TOEICOverviewDataProps } from "./toeic/TOEICOverview";

export const GAME_CONTAINER_ID = "main-game-view";
export const GAME_PANEL_ID = "main-game-scroll-panel";
export const GAME_REVIEW_SECTION_ID = "main-game-review-section";
export type GameViewRefType = {
  QuestionPaletteComponent: ReactElement<QuestionPaletteProps>;
  QuestionStatComponent: ReactElement<QuestionStatProps>;
  QuestionProgressComponent: ReactElement<QuestionProgressProps>;
  /** Restart `showResultOnAnswer` game */
  showRestartDialog: () => void;
  /** Pause Game */
  pauseGame: () => void;
  /** SubmitGame */
  showSubmitDialog: () => void;
  returnOverviewFlashCard: () => void;
}
export type GameViewProps = {
  gameSetting: GameSetting;
  cards: Array<Card>;
  skills?: Skill[];
  /**
   * Called when answering a question
   */
  onAnswer?: OnAnswerFunction;
  /**
   * Called when update list of answer (submit Writing Game...)
   */
  onSubmitListAnswer?: OnSubmitListAnswer;
  /**
   * Called when the game progress changes
   */
  onUpdateGameProgress?: OnUpdateGameProgressFunction;
  /**
   * Called only update topic boxcard
   */
  onUpdateTopicBoxCard?: OnUpdateTopicBoxCardFunction;
  /**
   * Called only update card bookmarks array
   */
  onUpdateCardBookmarks?: OnUpdateCardBookmarksFunction;
  /**
   * Called when start test game from overview screen or dynamically call.
   * In SkipOverview Mode, this function is automatically called
   */
  onStartTestGame?: OnStartTestGameFunction;
  /**
   * Called on restarting `showResultOnAnswer` game.
   */
  onRestartGame?: OnRestartGameFunction;
  /**
   * Called on submitting game
   */
  onSubmitGame?: OnSubmitGameFunction
  /** Called when finish `Show Result On Answer` Game with no unmount the component */
  onFinishShowResultOnAnswerGame?: OnFinishShowResultOnAnswerGame;
  /** Called when click on continue box in `Show Result On Answer` Game, with no unmount the game component */
  onReplayAnsweredQuestions?: OnReplayAnsweredQuestions;
  /** Action to unlock game feature (login, link to upgrade plan, etc.) */
  unlockFeatureAction?: () => void;
  onTestTimeChange?: (timeLeft: number) => void;
  /** Ads Component that shown below the Quiz explanation, only in Pragraph Game */
  ExplanationAdsComponent?: ReactElement;
  /** Ads Component that show randomly in review section, about 10 percent of the questions */
  ReviewGameAdsComponent?: ReactElement;
  /** Custom render function for Skill Stats Chart (TOEIC Test LR) */
  renderSkillOverview?: RenderSkillOverviewFunction;
  QuestionPaletteComponentProps?: Omit<QuestionPaletteProps, "onSubmitGame" | "onRestartGame">;
  QuestionStatComponentProps?: QuestionStatProps;
  QuestionProgressComponentProps?: QuestionProgressProps;
  renderTOEICOverview?: (props: TOEICOverviewDataProps) => JSX.Element;
  AdditionalTestReviewNavComponent?: ReactNode;
  renderAdditionalGameObjectMenu?: (props: AdditionalGameObjectMenuProps) => JSX.Element;
  getCDNUrl?: (url: string) => string 
}

const GameView = forwardRef<GameViewRefType, GameViewProps>((props, ref) => {
  const {
    gameSetting,
    cards,
    skills,
    onAnswer = () => { },
    onSubmitListAnswer = () => { },
    onUpdateGameProgress = () => { },
    onUpdateTopicBoxCard = () => { },
    onUpdateCardBookmarks = () => { },
    onStartTestGame = () => { },
    onRestartGame = () => { },
    onSubmitGame = () => { },
    onFinishShowResultOnAnswerGame = () => { },
    onReplayAnsweredQuestions = () => { },
    unlockFeatureAction = () => { },
    onTestTimeChange = (_) => { },
    ExplanationAdsComponent = <></>,
    ReviewGameAdsComponent = <></>,
    renderSkillOverview,
    QuestionPaletteComponentProps,
    QuestionStatComponentProps,
    QuestionProgressComponentProps,
    renderTOEICOverview,
    AdditionalTestReviewNavComponent,
    renderAdditionalGameObjectMenu,
    getCDNUrl = (url: string) => url
  } = props;
  const _gameSetting = useGameSelector((state) => state.gameState.gameSetting);
  const fetchedCardProgresses = useGameSelector((state) => state.gameState.fetchedCardProgresses);
  const gameObjects = useGameSelector((state) => state.gameState.gameObjects);
  const currentGame = useGameSelector((state) => state.gameState.currentGame);
  const currentGameIdx = useGameSelector((state) => state.gameState.currentGameIdx);
  const loading = useGameSelector((state) => state.gameState.loading);
  const gameStatus = useGameSelector((state) => state.gameState.gameStatus);
  const flashCardView = useGameSelector((state) => state.gameState.flashCardView);
  const cardProgresses = useGameSelector((state) => state.gameState.cardProgresses);
  const userPlaying = useGameSelector((state) => state.gameState.userPlaying);
  const questionItems = useGameSelector((state) => state.gameState.questionItems);
  const totalQuestions = useGameSelector((state) => state.gameState.totalQuestions);
  const totalCorrect = useGameSelector((state) => state.gameState.totalCorrect);
  const totalIncorrect = useGameSelector((state) => state.gameState.totalIncorrect);
  const boxCard = useGameSelector((state) => state.gameState.boxCard);
  const gameKey = useGameSelector((state) => state.gameState.gameKey);
  const practiceView = useGameSelector((state) => state.gameState.practiceView);
  const gameDuration = useGameSelector((state) => state.gameState.duration);
  const essayEnd = useGameSelector((state) => state.gameState.essayEnd);
  const showQuestionsOnReview = useGameSelector((state) => state.gameState.showQuestionsOnReview);
  const showSkillTutorial = useGameSelector((state) => state.gameState.showSkillTutorial);
  const [currentSkillIndex, setCurrentSkillIndex] = useState(0);

  const gameViewRef = useRef<HTMLDivElement | null>(null);
  const toeicTestType = useMemo(() => {
    if (!gameSetting) return false;
    if (gameSetting.gameType === GameTypes.TEST
      && gameSetting.contentType === EXAM_TYPE_TOEIC) {
      if (!gameSetting.currentSkill) {
        return "lr";
      } else if ([SKILL_TYPE_SPEAKING, SKILL_TYPE_WRITING].includes(gameSetting.currentSkill.type)) {
        return "sw";
      }
      return false;
    }
    return false;
  }, [...(gameSetting ? [gameSetting.gameType, gameSetting.currentSkill, gameSetting.contentType] : [])])

  const skillsForStat = useMemo(() => {
    const _skillsForStat: Skill[] = [];
    if (toeicTestType) {
      (skills ?? []).forEach((skill) => {
        if (toeicTestType === "lr") {
          // TOEIC LR
          if ([SKILL_TYPE_LISTENING, SKILL_TYPE_READING].includes(skill.type)) {
            _skillsForStat.push(...(skill?.childSkills ?? []));
          }
        } else {
          // TOEIC SW
        }
      });
    }
    return _skillsForStat;
  }, [skills, toeicTestType]);

  // useEffect(() => {
  //   setCurrentSkillValue((prev) => {
  //     if (!prev) return skillsForStat.at(0)?.value;
  //     return prev;
  //   })
  // }, [skillsForStat.length]);

  const showReviewSection = useMemo(() => {
    return ((gameSetting?.gameType === GameTypes.TEST && gameStatus === GameStatus.REVIEW)
      || (gameSetting?.gameType === GameTypes.PRACTICE && (showQuestionsOnReview && gameStatus === GameStatus.REVIEW)));
  }, [gameSetting?.gameType, gameStatus, showQuestionsOnReview]);

  const {
    testSetting,
    displayMode: _displayMode
  } = useMemo(() => {
    const testSetting = getTestSetting(gameSetting);
    let displayMode = gameSetting.displayMode;
    if (testSetting.usingSkillView) displayMode = GameDisplayMode.DEFAULT;
    else displayMode = getDisplayMode(gameSetting);
    return {
      testSetting,
      displayMode
    }
  }, []);
  // const testSetting = useMemo(() => {
  //   let usingSkillView = false;
  //   let showTestUtils = true;
  //   if (gameSetting?.gameType === GameTypes.TEST) {
  //     if (gameSetting?.currentSkill) {
  //       if (
  //         (gameSetting?.contentType === EXAM_TYPE_IELTS && [SKILL_TYPE_SPEAKING, SKILL_TYPE_WRITING].includes(gameSetting?.currentSkill?.type))
  //         || (gameSetting?.contentType === EXAM_TYPE_TOEIC && [SKILL_TYPE_SPEAKING, SKILL_TYPE_WRITING].includes(gameSetting?.currentSkill?.type))
  //       ) {
  //         usingSkillView = true;
  //         showTestUtils = false;
  //       }
  //     }
  //   }
  //   return {
  //     usingSkillView,
  //     showTestUtils
  //   }
  // }, [gameSetting?.contentType, gameSetting?.gameType, gameSetting?.currentSkill, gameStatus]);

  // const _displayMode = useMemo(() => {
  //   return getDisplayMode(gameSetting);
  //   // if (gameSetting.gameType === GameTypes.TEST
  //   //   && gameSetting.contentType === EXAM_TYPE_TOEIC
  //   //   && !testSetting.usingSkillView
  //   //   && gameSetting.testConfig?.toeicLR?.simulationMode
  //   // ) {
  //   //   return GameDisplayMode.DEFAULT;
  //   // }
  //   // return testSetting.usingSkillView ? GameDisplayMode.DEFAULT : gameSetting.displayMode
  // }, [gameSetting]);
  const reviewAdsPositions = useMemo(() => {
    const gameNum = gameObjects.length;
    const numberOfAds = Math.round(gameNum / 10);
    const pos = gameNum < 50 ? sampleSize(range(0, gameNum), numberOfAds) : range(0, gameNum, 10);
    return pos.length < 1 ? [0] : pos;
  }, [gameObjects.length]);

  const theme = useTheme();
  const isTabletUI = useMediaQuery(theme.breakpoints.down('lg'));

  const dispatch = useDispatch();

  const { handleSubmitGame, handleSubmitGameOnBackground, handleOpenSubmitDialog, handlePauseGame } = useSubmitGame({ onSubmitGame });
  const { handleOpenRestartDialog } = useRestartGame({ onRestartGame });
  const { handleQuitGame } = useQuitGame();

  useImperativeHandle(ref, () => ({
    QuestionPaletteComponent: <QuestionPalette
      {...QuestionPaletteComponentProps}
      onRestartGame={onRestartGame}
      onSubmitGame={onSubmitGame}
    />,
    QuestionStatComponent: <QuestionStat {...QuestionStatComponentProps} />,
    QuestionProgressComponent: <QuestionProgress {...QuestionProgressComponentProps} />,
    showRestartDialog: handleOpenRestartDialog,
    pauseGame: () => {
      handlePauseGame();
      if (isFunction(QuestionPaletteComponentProps?.onPauseCallback)) QuestionPaletteComponentProps?.onPauseCallback();
    },
    showSubmitDialog: handleOpenSubmitDialog,
    returnOverviewFlashCard: () => {
      if ([FlashCardView.GAME, FlashCardView.CARD].includes(flashCardView)) {
        dispatch(setFlashCardView(FlashCardView.OVERVIEW))
      }
    }
  }));

  useEffect(() => {
    if (!gameSetting) {
      console.log("No GameSetting")
      return;
    }
    dispatch(initGameSetting({
      gameSetting,
      cards
    }));
    if (typeof gameSetting.contentType !== "undefined" && !!skills) dispatch(setMapExamTypeSkillsKey({ examType: gameSetting.contentType, skills }));
    if (gameSetting.cardProgresses) {
      dispatch(setMapCardProgressAsync({
        mapCardProgress: gameSetting.cardProgresses,
        userId: gameSetting.userId,
        cards,
        topicId: gameSetting.topicId
      }));
      dispatch(setFetchedCardProgress(true));
    } else {
      dispatch(setFetchedCardProgress(true));
    }
    return () => {
      dispatch(resetGameState());
    }
  }, [gameSetting]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e = e || window.event;
      if (e) {
        if (gameSetting?.gameType === GameTypes.TEST && gameStatus === GameStatus.PLAY) {
          //submit 
          handleSubmitGameOnBackground({ isPause: true });
        }
        e.returnValue = 'Sure?';
      }
    };
    // const handleUnload = () => {
    //   if (gameType === GameTypes.TEST && gameStatus === GameStatus.PLAY) {
    //     //submit 
    //     handleSubmitGame({ isPause: true });
    //   }
    // };
    if (!gameSetting.disableUnloadEvent) {
      window.addEventListener("beforeunload", handleBeforeUnload);
      //window.addEventListener("unload", handleUnload);
    }
    return () => {
      if (!gameSetting.disableUnloadEvent) {
        window.removeEventListener("beforeunload", handleBeforeUnload);
        //window.removeEventListener("unload", handleUnload);
      }
    }
  }, [gameSetting?.gameType, gameStatus, handleSubmitGameOnBackground]);

  useEffect(() => {
    dispatch(setDisableAutoPlayAudio(showReviewSection || _displayMode === GameDisplayMode.ALL_IN_PAGE));
  }, [showReviewSection, _displayMode])

  useEffect(() => {
    const testClockScroll = (_: Event) => {
      const testClockElement = document.getElementsByClassName('test-clock-panel')[0] as HTMLElement;
      if (!testClockElement)
        return;
      const mainGameViewElement = document.getElementsByClassName('study-layout-mid')[0] as HTMLElement;
      if (window.scrollY > 130) {
        testClockElement.style.position = 'fixed';
        testClockElement.style.width = `${mainGameViewElement.offsetWidth.toString()}px`;
        testClockElement.style.top = '5.5%';
        testClockElement.style.borderRadius = '0px 0px 15px 15px';
        testClockElement.style.paddingTop = '14px';
      } else {
        testClockElement.style.position = 'unset';
        testClockElement.style.borderRadius = '15px';
        testClockElement.style.top = mainGameViewElement ? `${mainGameViewElement.offsetTop}px` : 'auto';
      }
    }
    if (typeof window !== "undefined") {
      if (!gameSetting.disableFixedClock) {
        window.addEventListener("scroll", testClockScroll);
      }
    }
    return () => {
      if (typeof window !== "undefined") {
        if (!gameSetting.disableFixedClock) {
          window.removeEventListener("scroll", testClockScroll);
        }
      }
    }
  }, []);

  useEffect(() => {
    if (loading && !!_gameSetting && fetchedCardProgresses) {
      dispatch(onStartGame({
        cards,
        skills: !!skills ? [...skills, ...(flatMap(skills.map((e) => e.childSkills ?? [])))] : undefined,
        cardProgresses,
        topicId: gameSetting.topicId,
        userId: gameSetting.userId,
        boxCard: gameSetting.boxCard,
        cardBookmarks: gameSetting.cardBookmarks
      }));
    }
  }, [loading, !!_gameSetting, fetchedCardProgresses]);

  useEffect(() => {
    if (!loading) {
      if (gameSetting.showResultOnAnswer || (
        gameSetting?.gameType === GameTypes.FLASH_CARD && flashCardView !== FlashCardView.OVERVIEW
      )) {
        if (userPlaying) {
          const args: OnUpdateGameProgessArgs = {
            totalQuestions,
            totalCorrect,
            totalIncorrect,
            boxCard
          };
          onUpdateGameProgress(args);
        }
      }
    }
  }, [totalQuestions, totalCorrect, totalIncorrect, loading, userPlaying, boxCard]);

  useEffect(() => {
    if (gameSetting?.displayMode === GameDisplayMode.ALL_IN_PAGE) return;
    if (!loading && !!currentGame?.id) {
      if (window.innerHeight < 768) {
        try {
          scroller.scrollTo(GAME_CONTAINER_ID, {
            smooth: true, duration: 800, offset: -10
          });
        } catch (_) { }
      }
    }
  }, [loading, currentGame?.id, gameSetting?.displayMode]);

  const renderGameObjectView = () => {
    if (loading || !gameSetting) return <LoadingGameIcon />;
    if (gameSetting.gameType === GameTypes.LESSON) {
      return <GameLessonView
        name={gameSetting.topicName}
        description={gameSetting.topicDescription ?? ''}
        videoUrl={gameSetting.topicVideoUrl}
      />;
    }
    if (gameSetting.gameType === GameTypes.FLASH_CARD) {
      if (flashCardView === FlashCardView.OVERVIEW) {
        return gameSetting.skipOverview ? <></> : <FlashCardOverview />;
      } else if (flashCardView === FlashCardView.CARD) {
        return <FlashCardPracticeView gameObject={currentGame as FlashCardGameObject} isFirstCard={!currentGameIdx} />;
      } else if (flashCardView === FlashCardView.GAME) {
        return <FlashCardPlayGameView />
      } else if (flashCardView === FlashCardView.END) {
        return <FlashCardEndView />
      }
      return <></>;
    }
    if (!gameObjects.length) return <>{gameSetting.language === "vi" ? "Không có dữ liệu" : "No Data"}</>;
    if (gameSetting.gameType === GameTypes.TEST && gameStatus !== GameStatus.PLAY) {
      return <TestOverview AdditionalReviewNavComponent={AdditionalTestReviewNavComponent} />
    }
    if (gameSetting.gameType === GameTypes.PRACTICE) {
      if (gameStatus === GameStatus.REVIEW) {
        return gameSetting.skipOverview ? <></> : <PracticeOverview review />;
      }
      if (!gameSetting.skipOverview && practiceView === PracticeView.OVERVIEW) {
        return <PracticeOverview />
      }
    }
    if (_displayMode === GameDisplayMode.ALL_IN_PAGE) {
      return <>
        {gameObjects
          .filter((go) => {
            if (toeicTestType === "lr"
              && _displayMode === GameDisplayMode.ALL_IN_PAGE
              && !gameSetting.testConfig?.toeicLR?.simulationMode) {
              return go.skill?.value === skillsForStat[currentSkillIndex]?.value;
            }
            return true;
          })
          .map((go, index) => {
            let questionLabel = "";
            if (gameSetting.hideParaQuestionLabel) {
              const gameQuestions = questionItems.filter((item) => (item.path[0] || item.id) === go.id);
              questionLabel = gameQuestions.length === 1 ? `${gameQuestions[0]?.index}` : `${gameQuestions[0]?.index}-${gameQuestions[gameQuestions.length - 1]?.index}`;
            }
            const isGameParaWithContent = go instanceof ParaGameObject;
            return <DelayRender delay={Math.floor(index / RENDERED_REVIEW_MIN_INDEX) * 500} key={go.id} placeholder={<LoadingGameIcon />}>
              {reviewAdsPositions.includes(index) && ReviewGameAdsComponent}
              <div className={classNames("game-object-view-aio", isGameParaWithContent ? "game-para-aio-with-content" : "")}>
                {gameSetting.hideParaQuestionLabel && <div className="game-object-view-aio-question-index">{gameSetting.language === "vi" ? "Câu" : "Question"} {questionLabel}:</div>}
                <GameObjectView gameObject={go} isRoot id={`game-obj-${go.id}`} />
              </div>
            </DelayRender>
          })}
      </>
    } else {
      if (showSkillTutorial) {
        return <SkillTutorial />
      }
      if (currentGame) {
        return <GameObjectView gameObject={currentGame} isRoot />
      }
    }
    return <></>;
  }

  const onClickSkillNavItem = (skillValue: number, index: number) => {
    setCurrentSkillIndex(index);
    // const idx = skillsForStat.findIndex(())
    // const item = questionItems.find((q) => q.skillValue === skillValue);
    // if (!!item) {
    //   scroller.scrollTo(`game-obj-${item.path[0] || item.id}`, { smooth: true, offset: -150, duration: 400 });
    // }
  }

  const renderGameReview = () => {
    if (gameSetting.gameType === GameTypes.TEST
      && gameSetting.contentType === EXAM_TYPE_IELTS
      && !!gameSetting.currentSkill
      && [SKILL_TYPE_SPEAKING, SKILL_TYPE_WRITING].includes(gameSetting.currentSkill.type)) {
      return <div id={GAME_REVIEW_SECTION_ID} className="main-game-review-section-test ielts-essay-test">
        {currentGame
          ? currentGame instanceof IELTSSpeakingGameObject
            ? <IELTSSpeakingGameView gameObject={currentGame} />
            : (currentGame instanceof IELTSWritingGameObject && <IELTSWritingGameView gameObject={currentGame} />)
          : (essayEnd
            ? <EssayEndView />
            : <></>)}
      </div>;
    }

    if (gameSetting.gameType === GameTypes.TEST
      && gameSetting.contentType === EXAM_TYPE_TOEIC
      && !!gameSetting.currentSkill
      && [SKILL_TYPE_SPEAKING, SKILL_TYPE_WRITING].includes(gameSetting.currentSkill.type)) {
      return <div id={GAME_REVIEW_SECTION_ID} className="main-game-review-section-test toeic-essay-test">
        {currentGame
          ? currentGame instanceof TOEICSpeakingGameObject
            ? <TOEICSpeakingGameView gameObject={currentGame} />
            : (currentGame instanceof TOEICWritingGameObject && <TOEICWritingGameView gameObject={currentGame} />)
          : (essayEnd
            ? <EssayEndView />
            : <></>
          )
        }
      </div>
    }

    return <>
      {!!skillsForStat.length
        && gameSetting?.gameType === GameTypes.TEST
        && (typeof renderSkillOverview !== "undefined"
          ? <>{renderSkillOverview({ questionItems, skills: skillsForStat })}</>
          : <div id="skill-stats-panel">
            <SkillStats skills={skillsForStat} questionItems={questionItems} />
          </div>)}
      <div id={GAME_REVIEW_SECTION_ID} className={gameSetting?.gameType === GameTypes.TEST ? 'main-game-review-section-test' : ''}>
        {gameObjects.map((go, index) => {
          let questionLabel = "";
          if (gameSetting.hideParaQuestionLabel) {
            const gameQuestions = questionItems.filter((item) => (item.path[0] || item.id) === go.id);
            questionLabel = gameQuestions.length === 1 ? `${gameQuestions[0]?.index}` : `${gameQuestions[0]?.index}-${gameQuestions[gameQuestions.length - 1]?.index}`;
          }
          return <DelayRender key={go.id} delay={Math.floor(index / RENDERED_REVIEW_MIN_INDEX) * 500} placeholder={<LoadingGameIcon />}>
            <div id={`review-${go.id}`}>
              {reviewAdsPositions.includes(index) && ReviewGameAdsComponent}
              {gameSetting.hideParaQuestionLabel && <div className="question-index-title">{gameSetting.language === "vi" ? "Câu" : "Question"} {questionLabel}: </div>}
              <GameObjectView gameObject={go} isRoot />
              {/* {adsPosition === index && <GoogleAdsense name="ReviewGameAds" />} */}
              {index !== gameObjects.length - 1 && <Divider />}
            </div>
          </DelayRender>
        })}
      </div>
    </>
  }

  return (<GameContextProvider
    onAnswer={onAnswer}
    onSubmitListAnswer={onSubmitListAnswer}
    onUpdateProgress={onUpdateGameProgress}
    onUpdateTopicBoxCard={onUpdateTopicBoxCard}
    onUpdateCardBookmarks={onUpdateCardBookmarks}
    onStartTestGame={onStartTestGame}
    onRestartGame={onRestartGame}
    onSubmitGame={onSubmitGame}
    onFinishShowResultOnAnswerGame={onFinishShowResultOnAnswerGame}
    onReplayAnsweredQuestions={onReplayAnsweredQuestions}
    unlockFeatureAction={unlockFeatureAction}
    playedTime={gameSetting?.playedTime ?? 0}
    ExplanationAdsComponent={ExplanationAdsComponent}
    renderTOEICOverview={renderTOEICOverview}
    renderAdditionalGameObjectMenu={renderAdditionalGameObjectMenu}
    getCDNUrl={getCDNUrl}
  >
    {gameSetting && <>
      <div
        id={GAME_CONTAINER_ID}
        ref={gameViewRef}
        className={classNames(
          (currentGame instanceof FlashCardGameObject && !gameSetting.skipOverview) ? "flash-card" : "",
          (gameSetting.defaultBackground
            && !(gameSetting.gameType === GameTypes.PRACTICE && (practiceView === PracticeView.OVERVIEW || (gameSetting.usePracticeOverview && gameStatus === GameStatus.REVIEW))))
            && !(gameSetting.gameType === GameTypes.FLASH_CARD && [FlashCardView.OVERVIEW, FlashCardView.END].includes(flashCardView))
            ? "default-bgr" : "",
          isTabletUI ? "tablet" : "",
          _displayMode === GameDisplayMode.ALL_IN_PAGE
            && !((gameSetting.showResultOnAnswer && gameStatus === GameStatus.REVIEW) || (gameSetting?.gameType === GameTypes.TEST && gameStatus !== GameStatus.PLAY))
            ? "game-mode-aio" : "",
          gameSetting.skipOverview && gameStatus === GameStatus.REVIEW ? "hidden" : ""
        )}
      >
        {gameSetting.gameType === GameTypes.TEST && testSetting.showTestUtils && <div className="game-test-utils">
          {!testSetting.usingSkillView && <TestClock
            classes={{
              root: "test-clock-panel",
              icon: "test-clock-icon"
            }}
            total={gameDuration}
            stop={gameStatus !== GameStatus.PLAY}
            id={gameKey}
            onChange={(timeLeft) => {
              onTestTimeChange(timeLeft)
            }}
            onEnd={() => {
              handleSubmitGame();
              if (gameSetting.useQuitGameHook) {
                handleQuitGame(true);
              }
            }}
            defaultTotal={gameSetting.duration || 0}
            updatePlayedTime
            gameSettingDuration={gameSetting.duration || 0}
          />
          }
          {gameSetting.gameType === GameTypes.TEST && gameStatus === GameStatus.PLAY && <>
            {gameSetting.contentType === EXAM_TYPE_TOEIC
              && _displayMode === GameDisplayMode.ALL_IN_PAGE
              && <div className={classNames("game-toeic-rl-skills-nav", isTabletUI ? "tablet" : "")}>
                {skillsForStat.map((skill, idx) => <div key={skill._id}
                  className={`game-toeic-rl-skills-nav-item${currentSkillIndex === idx ? " current" : ""}`}
                  onClick={() => onClickSkillNavItem(skill.value, idx)}>{skill.name}</div>)}
              </div>}
          </>}
        </div>}
        <div id={GAME_PANEL_ID} className={classNames(
          "main-game-object",
          gameSetting.gameType !== GameTypes.FLASH_CARD
            && !!currentGame
            && currentGame instanceof ParaGameObject ? "para-root-container" : ""
        )}>
          {renderGameObjectView()}
        </div>
        {!testSetting.usingSkillView && (!isTabletUI && _displayMode !== GameDisplayMode.ALL_IN_PAGE) && <div className="main-game-object-buttons">
          <GameNavButtons />
        </div>}
        {toeicTestType === "lr" && _displayMode === GameDisplayMode.ALL_IN_PAGE && gameStatus === GameStatus.PLAY && <>
          <div className="toeic-test-lr-part-nav">
            {!!currentSkillIndex && <Button
              className="toeic-test-lr-part-nav-btn btn-left" variant="contained" onClick={() => {
                setCurrentSkillIndex((idx) => idx - 1)
              }}>
              Previous Part
            </Button>}

            {currentSkillIndex < skillsForStat.length - 1 && <Button
              className="toeic-test-lr-part-nav-btn btn-right" variant="contained" onClick={() => {
                setCurrentSkillIndex((idx) => idx + 1)
              }}>
              Next Part
            </Button>}
          </div>
        </>}
      </div>

      {showReviewSection
        && renderGameReview()}

      {!testSetting.usingSkillView && isTabletUI && <div className="main-game-tablet-buttons-wrap">
        <div id="main-game-tablet-buttons">
          {_displayMode !== GameDisplayMode.ALL_IN_PAGE && <GameNavButtons />}
          {gameSetting.gameType === GameTypes.FLASH_CARD && flashCardView === FlashCardView.GAME && <FlashCardNextGameButton className="footer-tablet-right" />}
        </div>
      </div>}
    </>}
  </GameContextProvider>)
});

export default GameView;
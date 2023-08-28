import { Box, Button, useMediaQuery, useTheme } from "@mui/material";
import classNames from "classnames";
import React, { PropsWithoutRef, ReactNode, useEffect, useMemo } from "react";
import { useDispatch } from "react-redux";
import { useGameSelector } from "../hooks";
import useCheckTOEICLRSimulator from "../hooks/useCheckTOEICLRSimulator";
import useGameContext from "../hooks/useGameContext";
import { GameStatus } from "../models/game.core";
import { changeQuestionItem, onStartGame, resetCardProgresses, setGameDuration, setGameKey, setTestView } from "../redux/reducers/game.slice";
import { EXAM_TYPE_TOEIC } from "../utils/constraints";
import ContinueBox from "./ContinueBox";
import { GAME_REVIEW_SECTION_ID } from "./GameView";
import PracticeDoneImg from "./icons/practice-images/PracticeDoneImg";
import PracticeInProgressImg from "./icons/practice-images/PracticeInProgressImg";
import "./testOverview.scss";
import TOEICOverview from "./toeic/TOEICOverview";

const TestOverview = (props: PropsWithoutRef<{
  AdditionalReviewNavComponent?: ReactNode;
}>) => {
  const {
    AdditionalReviewNavComponent = <></>
  } = props;
  const { onStartTestGame, testClockRef } = useGameContext();
  const skipOverview = useGameSelector((state) => state.gameState.gameSetting?.skipOverview);
  const gameStatus = useGameSelector((state) => state.gameState.gameStatus);
  const cards = useGameSelector((state) => state.gameState.cards);
  const skills = useGameSelector((state) => state.gameState.skills);
  const topicId = useGameSelector((state) => state.gameState.gameSetting?.topicId);
  const topicContentType = useGameSelector((state) => state.gameState.gameSetting?.contentType);
  const gameSettingDuration = useGameSelector((state) => state.gameState.gameSetting?.duration ?? 0);
  const topicPassScore = useGameSelector((state) => state.gameState.gameSetting?.passScore);
  const userId = useGameSelector((state) => state.gameState.gameSetting?.userId);
  const totalCorrect = useGameSelector((state) => state.gameState.totalCorrect);
  const totalIncorrect = useGameSelector((state) => state.gameState.totalIncorrect);
  const totalQuestions = useGameSelector((state) => state.gameState.totalQuestions);
  // const mapExamTypeSkills = useGameSelector((state) => state.gameState.mapExamTypeSkills);
  // const hideSubList = useGameSelector((state) => state.studyLayoutState.hideSubList);
  // const studyScoreId = useGameSelector((state) => state.topicState.studyScoreId);
  // const studyScoreDataId = useGameSelector((state) => state.topicState.studyScoreDataId);
  // const studyScoreData = useGameSelector((state) => state.topicState.studyScore?.studyScoreData);
  const {
    isTOEICLRSimulator,
    nextQuestion,
    allowPause
  } = useCheckTOEICLRSimulator();
  const dispatch = useDispatch();
  const passed = useMemo(() => {
    const correctRate = totalCorrect / (totalQuestions || 1);
    const score = correctRate * 10;
    return score >= topicPassScore;
  }, [totalCorrect, totalQuestions, topicPassScore]);

  const isRenderDefaultOverview = useMemo(() => ![
    EXAM_TYPE_TOEIC
  ].includes(topicContentType), [topicContentType]);

  const theme = useTheme();
  const isMobileUI = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    // if (!!topic) {
    let duration = gameSettingDuration;
    if (gameStatus === GameStatus.CONTINUE
      || gameStatus === GameStatus.REVIEW
    ) {
      if (!(gameStatus === GameStatus.CONTINUE && isTOEICLRSimulator && !allowPause)) {
        if (testClockRef.current) {
          duration -= (testClockRef.current.playedTime ?? 0)
        }
        // duration -= (playedTime ?? 0);
      }
    }
    //duration -= (topicProgresses[topic._id]?.totalTime ?? 0);
    dispatch(setGameDuration(duration));
    // }
  }, [gameStatus, gameSettingDuration, isTOEICLRSimulator, testClockRef.current?.playedTime]);

  // useEffect(() => {
  //   const examType = topic?.topicExercise?.contentType;
  //   if (examType === EXAM_TYPE_TOEIC) {
  //     if (!mapExamTypeSkills[examType]?.fetched) {
  //       dispatch(fetchSkillsByExamType({ examType }));
  //     }
  //   }
  // }, [topic?.topicExercise?.contentType, mapExamTypeSkills]);

  useEffect(() => {
    // Skip Default Overview
    if (skipOverview) {
      switch (gameStatus) {
        case GameStatus.NEW:
          handleClickPlay();
          break;
        case GameStatus.CONTINUE:
          handleClickPlay({ continueMode: true });
          break;
        default:
          break;
      }
    }
  }, [skipOverview, gameStatus]);

  const handleClickPlay = (args: { replay?: boolean; continueMode?: boolean; } = {}) => {
    const { replay = false, continueMode = false } = args;
    // External API
    onStartTestGame({ continueMode, replay, totalQuestions });
    if (!continueMode) {
      dispatch(setGameDuration(gameSettingDuration));
    } else {
      if (isTOEICLRSimulator && nextQuestion) {
        dispatch(changeQuestionItem({ item: nextQuestion, force: true }))
      }
    }
    // const _savedTopicProgress = topicProgresses[topic._id];
    // let topicProgress = _savedTopicProgress?.userId === userId ? ClientTopicProgress.clone(_savedTopicProgress) : undefined;
    // // let topicProgress = _savedTopicProgress ? ClientTopicProgress.clone(_savedTopicProgress) : undefined;
    // if (!topicProgress) topicProgress = new ClientTopicProgress({
    //   topicId: topic._id, userId
    // });
    // // let duration = (topic.topicExercise?.duration ?? 0) * 60;
    // topicProgress.setStatus(EXAM_SCORE_PLAY);
    // if (!continueMode) {
    //   topicProgress.increaseStudyTime();
    //   topicProgress.setTotalTime(0);
    // } else {
    //   // duration -= topicProgress.totalTime;
    // }
    // dispatch(setGameDuration(duration));
    if (replay) {
      dispatch(resetCardProgresses({ topicId }));
      // topicProgress.setStudyData({ correctNum: 0, incorrectNum: 0, score: 0, progress: 0, totalTime: 0 });
      dispatch(onStartGame({
        cards, cardProgresses: {}, userId, topicId, skills
      }));
    }
    // topicProgress.setUserId(userId);
    // dispatch(updateTopicProgress(topicProgress));
    // if (!!user) {
    //   if (replay) {
    //     const updateAppPracticeDataArgs: UpdateAppPracticeDataArgs = {
    //       studyScoreDataId,
    //       studyScoreId,
    //       status: EXAM_SCORE_PLAY,
    //       progress: 0, totalCorrect: 0, totalIncorrect: 0,
    //       totalQuestions,
    //       studyTime: topicProgress.studyTime,
    //       totalTime: 0,
    //       score: 0
    //     }
    //     dispatch(updateAppPracticeData(updateAppPracticeDataArgs));
    //     dispatch(resetCardStudyData({ studyScoreDataId }));
    //     dispatch(setGameDuration(topicDuration * 60));
    //   } else if (!continueMode && !replay) {
    //     // New Game
    //     dispatch(createAppPracticeData({
    //       topicId: topic._id,
    //       userId,
    //       courseId: topic.courseId,
    //       parentId: topic.parentId,
    //       gameType: GAME_TYPE_TEST
    //     }));
    //   }
    // }
    dispatch(setGameKey(Date.now()));
    dispatch(setTestView(GameStatus.PLAY));
  }

  const handleClickReview = () => {
    const reviewSection = document.getElementById(GAME_REVIEW_SECTION_ID);
    if (reviewSection) {
      reviewSection.scrollIntoView({ behavior: "smooth" });
    }
  }

  const renderTestReviewPanel = () => {
    switch (topicContentType) {
      case EXAM_TYPE_TOEIC:
        return <Box mt="10px"><TOEICOverview /></Box>;
      default:
        return <div className="test-game-image">
          {passed ? <PracticeDoneImg /> : <PracticeInProgressImg />}
          {/* <img className="test-game-image-img" src={passed ? "/images/practice-done.svg" : "/images/practice-in-progress.svg"} alt={passed ? 'passed' : 'failed'} /> */}
        </div>;
    }
  }

  return <div id="test-overview" className={classNames("test-overview", skipOverview ? 'hide-test-overview' : '')}>
    {(gameStatus === GameStatus.NEW || (gameStatus === GameStatus.CONTINUE && isTOEICLRSimulator && !allowPause)) && <>
      <div className="test-game-image">
        <PracticeInProgressImg />
        {/* <img className="test-game-image-img" src="/images/practice-in-progress.svg" alt="start" /> */}
      </div>
      <div className="game-buttons single-button">
        <Button
          className="game-button game-button-play"
          onClick={() => handleClickPlay({ replay: gameStatus === GameStatus.CONTINUE && isTOEICLRSimulator && !allowPause })}
        >Take test</Button>
      </div>
    </>}
    {gameStatus === GameStatus.CONTINUE && !(isTOEICLRSimulator && !allowPause) && <>
      <div className="test-game-image">
        <PracticeInProgressImg />
        {/* <img className="test-game-image-img" src="/images/practice-in-progress.svg" alt="continue" /> */}
      </div>
      <div className="game-buttons single-button">
        <Button className="game-button game-button-play" onClick={() => handleClickPlay({ continueMode: true })}>CONTINUE</Button>
      </div>
    </>}
    {gameStatus === GameStatus.REVIEW && <>
      <div className="test-game-done-title">
        {passed ? "Congratulations" : "Not enough to pass"}
      </div>
      {renderTestReviewPanel()}
      <div className={classNames("game-buttons", isMobileUI ? "mobile" : "")}>
        <Button className="game-button game-button-play" onClick={() => handleClickPlay({ replay: true })}>TRY AGAIN</Button>
        <Button className="game-button game-button-review" onClick={handleClickReview}>REVIEW</Button>
        {AdditionalReviewNavComponent}
      </div>

      {isRenderDefaultOverview && <div className={classNames("box-buttons", isMobileUI ? "mobile" : "")}>
        <ContinueBox
          value={totalQuestions}
          label="Total"
          color="#FFC93F"
          disabled
        />

        <ContinueBox
          value={totalIncorrect}
          label="Incorrect"
          color="#FF5252"
          disabled
        />

        <ContinueBox
          value={totalCorrect}
          label="Correct"
          color="#82BC24"
          disabled
        />
      </div>}
    </>
    }
  </div >
}

export default TestOverview;
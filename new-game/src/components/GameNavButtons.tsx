import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { Button } from "@mui/material";
import { styled } from "@mui/styles";
import { unwrapResult } from "@reduxjs/toolkit";
import classNames from "classnames";
import React, { useMemo } from "react";
import { useDispatch } from "react-redux";
import { EXAM_TYPE_IELTS, SKILL_TYPE_SPEAKING, SKILL_TYPE_WRITING } from "../utils/constraints";
import { useGameSelector } from "../hooks";
import useGameContext from "../hooks/useGameContext";
import { GameObject, GameStatus, GameTypes } from "../models/game.core";
import { getGameReviewNav, getNextGameObject, getNextGameObjectModeShowResultOnAnswer, getPreviousGameObject, setShowNext, setShowReviewNav, setShowSkillTutorial } from "../redux/reducers/game.slice";
import useCheckTOEICLRSimulator from "../hooks/useCheckTOEICLRSimulator";

const IconPrev = styled(ArrowBackIosIcon)({ height: "12px", width: "auto" });
const IconNext = styled(ArrowForwardIosIcon)({ height: "12px", width: "auto" });

const GameNavButtons = () => {
  const showResultOnAnswer = useGameSelector((state) => state.gameState.showResultOnAnswer);
  const gameType = useGameSelector((state) => state.gameState.gameSetting?.gameType);
  const showNext = useGameSelector((state) => state.gameState.showNext);
  const showReviewNav = useGameSelector((state) => state.gameState.showReviewNav);
  const gameStatus = useGameSelector((state) => state.gameState.gameStatus);
  const currentGameIdx = useGameSelector((state) => state.gameState.currentGameIdx);
  const currentGame = useGameSelector((state) => state.gameState.currentGame);
  const gameObjects = useGameSelector((state) => state.gameState.gameObjects);
  const topicContentType = useGameSelector((state) => state.gameState.gameSetting?.contentType);
  const currentSkill = useGameSelector((state) => state.gameState.gameSetting?.currentSkill);
  const replayMode = useGameSelector((state) => state.gameState.replayMode);
  const totalCorrect = useGameSelector((state) => state.gameState.totalCorrect);
  const totalIncorrect = useGameSelector((state) => state.gameState.totalIncorrect);
  const totalQuestions = useGameSelector((state) => state.gameState.totalQuestions);
  const devMode = useGameSelector((state) => state.gameState.gameSetting?.devMode);
  const showSkillTutorial = useGameSelector((state) => state.gameState.showSkillTutorial);
  const totalGames = useMemo(() => gameObjects.length, [gameObjects.length])
  const currentViewGameIdx = useMemo(() => gameObjects.findIndex((go) => go.id === currentGame?.id), [currentGame?.id]);
  const { onFinishShowResultOnAnswerGame } = useGameContext();
  const {
    isPlayingSimulatorListening,
    isPlayingSimulatorReading,
    isFirstPartGame,
    isFirstReadingGame,
    isLastPartGame,
    onNextGameListening
  } = useCheckTOEICLRSimulator();

  const dispatch = useDispatch();

  const handleOnFinishShowResultOnAnswerGame = () => {
    onFinishShowResultOnAnswerGame({ totalCorrect, totalIncorrect, totalQuestions });
    dispatch(setShowReviewNav(false))
  }

  if (gameType !== GameTypes.FLASH_CARD) {
    if (showResultOnAnswer) {
      if (gameStatus !== GameStatus.PLAY) return <></>
      return showNext
        ? <>
          <Button className="main-game-object-button main-game-object-continue-button single-node" onClick={() => {
            dispatch(setShowNext(false));
            // dispatch(getNextGameObject());
            if(showReviewNav) {
              dispatch(setShowReviewNav(false))
            }
            dispatch(getNextGameObjectModeShowResultOnAnswer({
              gameObjects, currentGameIdx, replayMode
            }))
              // @ts-ignore
              .then(unwrapResult)
              .then((data: { nextGameObject: GameObject | null, nextIndex: number; }) => {
                if (!data.nextGameObject) {
                  handleOnFinishShowResultOnAnswerGame();
                }
              })
          }} endIcon={<IconNext />}>
            Next
          </Button>
        </>
        : (showReviewNav && currentViewGameIdx !== currentGameIdx
          ? <>
            {currentViewGameIdx !== 0 && <Button
              className="main-game-review-nav main-game-review-nav-prev"
              onClick={() => {
                dispatch(getGameReviewNav({ isNext: false }));
              }}
            >
              <IconPrev />
            </Button>}

            {currentViewGameIdx !== totalGames - 1 && <Button
              className="main-game-review-nav main-game-review-nav-next"
              onClick={() => {
                dispatch(getGameReviewNav({ isNext: true }));
              }}
            >
              <IconNext />
            </Button>}
          </>
          : <></>);
    } else {
      if (gameStatus === GameStatus.PLAY) {
        if (topicContentType === EXAM_TYPE_IELTS && !!currentSkill && [SKILL_TYPE_SPEAKING, SKILL_TYPE_WRITING].includes(currentSkill.type)) {
          return <></>;
        }
        if (isPlayingSimulatorListening) {
          if (showSkillTutorial) return <></>;
          if (devMode) return <Button
            className="main-game-object-button main-game-object-continue-button"
            onClick={() => onNextGameListening()}>
            Skip
          </Button>
          return <></>
        }
        if (showSkillTutorial) return <></>;
        return <>
          {(isPlayingSimulatorReading ? !isFirstReadingGame : currentGameIdx !== 0) && <Button
            className="main-game-object-button main-game-object-prev-button"
            onClick={() => {
              dispatch(getPreviousGameObject());
            }}
            startIcon={<IconPrev />}
          >
            Previous
          </Button>}

          {currentGameIdx !== totalGames - 1 && <Button
            className={classNames(
              "main-game-object-button main-game-object-continue-button",
              currentGameIdx === 0 ? "single-node" : "",
              // isPlayingSimulatorReading && isLastPartGame && "last-part-toeic-lr-simulator"
            )}
            onClick={() => {
              dispatch(getNextGameObject());
              if (isPlayingSimulatorReading && isLastPartGame) {
                dispatch(setShowSkillTutorial(true));
              }
            }}
            endIcon={<IconNext />}
          >
            Next
            {/* {isPlayingSimulatorReading && isLastPartGame ? "Next Part" : "Next"} */}
          </Button>}
        </>
      }
      return <></>;
    }
  }
  return <></>
}

export default GameNavButtons;
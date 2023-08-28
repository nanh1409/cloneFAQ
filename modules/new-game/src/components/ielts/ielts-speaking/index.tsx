import { Box, Button } from "@mui/material";
import _ from "lodash";
import { PropsWithoutRef, useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { useGameSelector } from "../../../hooks";
import useGameContext from "../../../hooks/useGameContext";
import useSubmitGame from "../../../hooks/useSubmitGame";
import { ClientCardProgress, GameObject, GameObjectStatus, GameStatus, QuestionItem } from "../../../models/game.core";
import { changeQuestionItem, getNextGameObject, getPreviousGameObject, onAnswer, updateCardProgress } from "../../../redux/reducers/game.slice";
import Countdown from "../../Countdown";
import GameAudioPlayer from "../../GameAudioPlayer";
import ClockIcon from "../../icons/ClockIcon";
import LoadingGameIcon from "../../LoadingGameIcon";
import QuestionView from "../../QuestionView";
import IELTSTutorialView from "../tutorial";
import ChildIELTSSpeakingGameView from "./ChildIELTSSpeakingGameView";
import { IELTSSpeakingGameObject } from "./IELTSSpeakingGameObject";
import "./style.scss";

enum IELTSSpeakingView {
  NONE,
  MIC_CHECK,
  PLAY,
  OVERVIEW_PART
}

const IELTSSpeakingGameView = (props: PropsWithoutRef<{
  gameObject: IELTSSpeakingGameObject;
}>) => {
  const {
    gameObject
  } = props;
  const { onAnswer: ctxOnAnswer, unlockFeatureAction } = useGameContext();
  const dispatch = useDispatch();
  const gameStatus = useGameSelector((state) => state.gameState.gameStatus);
  const gameSetting = useGameSelector((state) => state.gameState.gameSetting);
  const questionItems = useGameSelector((state) => state.gameState.questionItems);
  const gameObjects = useGameSelector((state) => state.gameState.gameObjects);
  const currentGameIdx = useGameSelector((state) => state.gameState.currentGameIdx);
  const currentQuestion = useGameSelector((state) => state.gameState.currentQuestion);
  const topicId = useGameSelector((state) => state.gameState.gameSetting?.topicId);
  const userId = useGameSelector((state) => state.gameState.gameSetting?.userId);
  const cardProgresses = useGameSelector((state) => state.gameState.cardProgresses);
  const lockType = useGameSelector((state) => state.gameState.gameSetting?.featureLockType);

  const [view, setView] = useState<IELTSSpeakingView>(IELTSSpeakingView.NONE);
  const [showTutorial, setShowTutorial] = useState(true);
  const [childGameObject, setChildGameObject] = useState<IELTSSpeakingGameObject>(null);
  const [childGameObjectIdx, setChildGameObjectIdx] = useState(-1);
  const [pauseCountdown, setPauseCountdown] = useState(false);
  const [gameDuration, setGameDuration] = useState(0);
  const [forceEnd, setForceEnd] = useState(false);
  const [totalTime, setTotalTime] = useState(0);

  const isFirstPart = useMemo(() => currentGameIdx === 0, [currentGameIdx]);
  const isLastPart = useMemo(() => currentGameIdx === gameObjects.length - 1, [gameObjects.length, currentGameIdx]);

  const { handleSubmitGame } = useSubmitGame();

  useEffect(() => {
    setView(IELTSSpeakingView.NONE);
    setShowTutorial(true);
    setChildGameObject(null);
    setChildGameObjectIdx(-1);
    setForceEnd(false);
  }, [gameObject.id]);

  useEffect(() => {
    if (!!currentQuestion) {
      if (gameStatus === GameStatus.REVIEW || gameSetting?.gameStatus === GameStatus.CONTINUE) {
        const currentChildGameObjectIndex = gameObject.childGameObjects.findIndex((go) => go.id === currentQuestion.id);
        if (currentChildGameObjectIndex !== -1 && currentChildGameObjectIndex !== childGameObjectIdx) {
          setChildGameObjectIdx(currentChildGameObjectIndex);
          setChildGameObject(gameObject.childGameObjects[currentChildGameObjectIndex]);
          if (gameSetting?.gameStatus === GameStatus.CONTINUE) {
            const playedGames = gameObject.childGameObjects.filter((_, i) => i < currentChildGameObjectIndex);
            const playedTime = _.sumBy(playedGames, ({ progress }) => (progress?.answerOptional?.totalTime ?? 0));
            setGameDuration((prev) => {
              return Math.round(prev - playedTime)
            })
          }
        }
      }
    }
  }, [currentQuestion?.id, gameStatus, gameSetting?.gameStatus, childGameObjectIdx])

  useEffect(() => {
    if (view === IELTSSpeakingView.NONE) {
      // if (gameObject.useTimeParentSkill) {
      if (gameStatus !== GameStatus.REVIEW) {
        const skill = gameObject.skill;
        if (skill) setGameDuration(skill.timeStudy);
      } else {
        const parentProgress = cardProgresses[`${topicId}_${gameObject.id}`];
        setGameDuration(parentProgress?.answerOptional?.totalTime || 0);
        setShowTutorial(false);
      }
      // }
      const { nextGameObject, nextGameObjectIdx } = onNextGameObject();

      if (nextGameObject) {
        setChildGameObject(nextGameObject);
        setChildGameObjectIdx(nextGameObjectIdx);
        if (gameStatus !== GameStatus.REVIEW) {
          // if (!gameObject.useTimeParentSkill) {
          // handleSetChangeSkill(nextGameObject);
          // }
        } else {
          // if (!gameObject.useTimeParentSkill) {
          // }
        }
      }
      setView(IELTSSpeakingView.PLAY);
    } else if (view === IELTSSpeakingView.PLAY) {
      if (gameStatus === GameStatus.REVIEW) setShowTutorial(false);
    }
  }, [gameObject.id, gameStatus, view]);

  // const handleSetChangeSkill = (gameObject: IELTSSpeakingGameObject) => {
  //   const skill = gameObject.skill;
  //   if (skill) setGameDuration(skill.timeStudy);
  // }

  const onPrevGameObject = () => {
    let prevGameObject: IELTSSpeakingGameObject = null;
    const prevGameObjectIdx = childGameObjectIdx - 1;
    if (prevGameObjectIdx !== -1) prevGameObject = gameObject.childGameObjects[prevGameObjectIdx] || null;
    return {
      prevGameObjectIdx, prevGameObject
    }
  }

  const onNextGameObject = () => {
    let nextGameObject: IELTSSpeakingGameObject = null;
    let nextGameObjectIdx = -1;
    if (gameStatus !== GameStatus.REVIEW) {
      nextGameObjectIdx = gameObject.childGameObjects.findIndex((go, index) => index > childGameObjectIdx);
      setPauseCountdown(true);
    } else {
      nextGameObjectIdx = gameObject.childGameObjects.findIndex((go, index) => index > childGameObjectIdx);
    }
    if (nextGameObjectIdx !== -1) nextGameObject = gameObject.childGameObjects[nextGameObjectIdx] || null;
    return {
      nextGameObjectIdx, nextGameObject
    }
  }

  const onPrev = () => {
    const { prevGameObject, prevGameObjectIdx } = onPrevGameObject();
    if (prevGameObject) {
      setChildGameObject(prevGameObject);
      setChildGameObjectIdx(prevGameObjectIdx);
      const questionItem = questionItems.find((qI) => qI.id === prevGameObject.id);
      if (questionItem) dispatch(changeQuestionItem({ item: questionItem }));
    } else {
      dispatch(getPreviousGameObject());
    }
  }

  const onAnswerGameObject = (args: {
    _gameObject: GameObject;
    file?: string;
    totalTime?: number;
    isParent?: boolean;
  }) => {
    const {
      _gameObject, file = "", totalTime: _totalTime,
      isParent
    } = args;
    if (gameStatus !== GameStatus.REVIEW) {
      const cardProgress = new ClientCardProgress(ClientCardProgress.getUserCardProgress({
        topicId, userId, cardId: _gameObject.id, cardProgresses
      }));
      cardProgress.correct = true;
      cardProgress.answerOptional = {
        ...(cardProgress.answerOptional || {}),
        file: file ? [file] : [],
        totalTime: _totalTime
      }

      if (!isParent) {
        const questionItem = questionItems.find((qI) => qI.id === _gameObject.id);
        if (questionItem) {
          const newQuestionItem = QuestionItem.clone(questionItem);
          newQuestionItem.setProgress({ correct: true, status: GameObjectStatus.ANSWERED });

          dispatch(onAnswer({ questionItem: newQuestionItem }));
        }
      }

      dispatch(updateCardProgress(cardProgress));
      ctxOnAnswer(cardProgress);
    }
    // NEXT
    if (!isParent) {
      const { nextGameObject, nextGameObjectIdx } = onNextGameObject();
      if (nextGameObject) {
        setChildGameObjectIdx(nextGameObjectIdx);
        setChildGameObject(nextGameObject);
        const questionItem = questionItems.find((qI) => qI.id === nextGameObject.id);
        if (questionItem) dispatch(changeQuestionItem({ item: questionItem, force: true }));
        // if (!gameObject.useTimeParentSkill) {
        //   if (gameStatus !== GameStatus.REVIEW) {
        //     handleSetChangeSkill(nextGameObject);
        //   } else {
        //     const cardProgress = cardProgresses[`${topicId}_${nextGameObject.id}`];
        //     setGameDuration(cardProgress?.answerOptional?.totalTime || 0);
        //   }
        // }
      } else {
        if (gameStatus !== GameStatus.REVIEW) {
          // Answer Last Game Directly
          onAnswerGameObject({ _gameObject: gameObject, totalTime, isParent: true });
          setView(IELTSSpeakingView.OVERVIEW_PART);
        } else {
          dispatch(getNextGameObject());
        }
      }
    }
  }

  const renderIETLSSpeakingView = () => {
    if (view === IELTSSpeakingView.NONE) {
      return <LoadingGameIcon />;
    }
    if (view === IELTSSpeakingView.OVERVIEW_PART) {
      return <div className="game-ielts-speaking-overview">
        <b><i>OVERVIEW:</i></b>
        {gameStatus !== GameStatus.REVIEW && lockType === "login" && <div className="game-ielts-speaking-lockview">
          Please <span style={{ color: "#007aff", cursor: "pointer", textDecoration: "underline" }} onClick={unlockFeatureAction}>login</span> to save your answers!
        </div>}
        <QuestionView question={gameObject.question} className="game-ielts-speaking-overview-qtext" />
        {gameObject.childGameObjects.map((go, i) => {
          const cardProgress = cardProgresses[`${topicId}_${go.id}`];
          const file = cardProgress?.answerOptional?.file?.at(0) ?? "";
          return <>
            <Box display="flex" alignItems="baseline" columnGap="10px" ml="8px">
              {i + 1}.
              <QuestionView question={go.question} className="game-ielts-speaking-overview-qtext" />
            </Box>
            {file
              ? <GameAudioPlayer src={file} />
              : <b>Unanswered</b>
            }
          </>
        })}

        <div className="game-ielts-speaking-overview-nextpart">
          <Button variant="contained" onClick={() => {
            if (!isLastPart) {
              dispatch(getNextGameObject());
            } else {
              handleSubmitGame();
            }
          }}>
            {isLastPart ? "End" : "Next Part"}
          </Button>
        </div>
      </div>;
    }
    if (childGameObject) {
      // const questionItem = questionItems.find((qI) => qI.id === childGameObject.id);
      // const skill = skills.find((skill) => skill.value === questionItem?.skillValue);
      const skill = gameObject.skill;
      if (showTutorial) {
        return <IELTSTutorialView
          tutorial={skill?.tutorial}
          onSkip={() => setShowTutorial(false)}
        />
      }
      const isFirstQuestion = childGameObjectIdx === 0;
      const isLastQuestion = childGameObjectIdx === gameObject.childGameObjects.length - 1;
      return <>
        {skill && gameDuration > 0 && <Box display="flex" justifyContent="center" alignItems="center" columnGap="10px">
          <ClockIcon />
          <Countdown
            id={gameObject.id}
            total={gameDuration}
            stop={gameStatus !== GameStatus.PLAY || pauseCountdown}
            onChange={(timeLeft) => {
              const totalTime = skill.timeStudy - timeLeft;
              setTotalTime(totalTime);
            }}
            onEnd={() => {
              setForceEnd(true);
            }}
          />
        </Box>}
        <QuestionView question={gameObject.question} />
        <Box display="flex" columnGap="12px" alignItems="baseline" sx={{ "& .game-object-ielts-speaking-view": { flex: 1 } }}>
          {childGameObjectIdx + 1}.
          <ChildIELTSSpeakingGameView
            gameObject={childGameObject}
            showResult={gameStatus === GameStatus.REVIEW}
            isFirst={isFirstQuestion}
            isLast={isLastQuestion}
            isFirstPart={isFirstPart}
            isLastPart={isLastPart}
            onPrev={onPrev}
            onNext={({ file, timeMs }) => {
              onAnswerGameObject({
                _gameObject: childGameObject,
                file,
                totalTime: timeMs / 1000
              });
            }}
            onSavingFile={() => {
              setPauseCountdown(true);
            }}
            onSavedFile={() => {
              setPauseCountdown(false);
            }}
            timePrepare={skill?.timePrepare ?? 0}
            onEndPrepare={() => {
              setPauseCountdown(false);
            }}
            forceEnd={forceEnd}
          />
        </Box>
      </>
    }
    return <></>;
  }

  return <>{renderIETLSSpeakingView()}</>;
}

export default IELTSSpeakingGameView;
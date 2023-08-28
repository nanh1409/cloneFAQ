import { Button, Divider } from "@mui/material";
import { PropsWithoutRef, useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { useGameSelector } from "../../../hooks";
import useGameContext from "../../../hooks/useGameContext";
import useSubmitGame from "../../../hooks/useSubmitGame";
import { ClientCardProgress, GameObject, GameObjectStatus, GameStatus, QuestionItem } from "../../../models/game.core";
import { changeQuestionItem, getNextGameObject, getPreviousGameObject, onAnswer } from "../../../redux/reducers/game.slice";
import LoadingGameIcon from "../../LoadingGameIcon";
import QuestionView from "../../QuestionView";
import ChildTOEICSpeakingGameView from "./ChildTOEICSpeakingGameView";
import "./style.scss";
import { TOEICSpeakingGameObject } from "./TOEICSpeakingGameObject";

enum TOEICSpeakingView {
  NONE,
  PLAY
}

const TOEICSpeakingGameView = (props: PropsWithoutRef<{
  gameObject: TOEICSpeakingGameObject;
}>) => {
  const {
    gameObject
  } = props;
  const { onAnswer: ctxOnAnswer, unlockFeatureAction } = useGameContext();
  const dispatch = useDispatch();
  const currentGameIdx = useGameSelector((state) => state.gameState.currentGameIdx);
  const currentQuestion = useGameSelector((state) => state.gameState.currentQuestion);
  const gameObjects = useGameSelector((state) => state.gameState.gameObjects);
  const gameStatus = useGameSelector((state) => state.gameState.gameStatus);
  const questionItems = useGameSelector((state) => state.gameState.questionItems);
  const topicId = useGameSelector((state) => state.gameState.gameSetting?.topicId);
  const userId = useGameSelector((state) => state.gameState.gameSetting?.userId);
  const initGameStatus = useGameSelector((state) => state.gameState.gameSetting?.gameStatus);
  const cardProgresses = useGameSelector((state) => state.gameState.cardProgresses);
  const lockType = useGameSelector((state) => state.gameState.gameSetting?.featureLockType);


  const [view, setView] = useState<TOEICSpeakingView>(TOEICSpeakingView.NONE);
  const [childGameObject, setChildGameObject] = useState<TOEICSpeakingGameObject>(null);
  const [childGameObjectIdx, setChildGameObjectIdx] = useState(-1);
  const [readDirections, setReadDirections] = useState(gameStatus === GameStatus.REVIEW);

  const directions = useMemo(() => gameObject.question, [gameObject.question]);
  const childGameObjects = useMemo(() => gameObject.childGameObjects, [gameObject.id]);
  const isFirstPart = useMemo(() => currentGameIdx === 0, [currentGameIdx]);
  const isLastPart = useMemo(() => currentGameIdx === gameObjects.length - 1, [gameObjects.length, currentGameIdx]);

  const { handleSubmitGame } = useSubmitGame();

  useEffect(() => {
    return () => {
      setView(TOEICSpeakingView.NONE);
      setChildGameObject(null);
      setChildGameObjectIdx(-1);
      setReadDirections(false);
    }
  }, [gameObject.id]);

  useEffect(() => {
    if (!!currentQuestion && (gameStatus === GameStatus.REVIEW || initGameStatus === GameStatus.CONTINUE)) {
      const currentChildGameObjectIndex = childGameObjects.findIndex((go) => go.id === currentQuestion.id);
      if (currentChildGameObjectIndex !== -1 && currentChildGameObjectIndex !== childGameObjectIdx) {
        setChildGameObjectIdx(currentChildGameObjectIndex);
        setChildGameObject(childGameObjects[currentChildGameObjectIndex]);
      }
    }
  }, [currentQuestion?.id, gameStatus, childGameObjectIdx, initGameStatus]);

  useEffect(() => {
    if (view === TOEICSpeakingView.NONE) {
      const { nextGameObject, nextGameObjectIdx } = onNextGameObject();
      if (nextGameObject) {
        setChildGameObject(nextGameObject);
        setChildGameObjectIdx(nextGameObjectIdx);
      }
      setView(TOEICSpeakingView.PLAY);
    }
  }, [gameObject.id, view]);

  const onPrevGameObject = () => {
    let prevGameObject: TOEICSpeakingGameObject = null;
    const prevGameObjectIdx = childGameObjectIdx - 1;
    if (prevGameObjectIdx !== -1) prevGameObject = childGameObjects[prevGameObjectIdx] || null;
    return {
      prevGameObjectIdx, prevGameObject
    }
  }

  const onNextGameObject = () => {
    let nextGameObject: TOEICSpeakingGameObject = null;
    let nextGameObjectIdx = -1;
    if (gameStatus !== GameStatus.REVIEW) {
      nextGameObjectIdx = childGameObjects.findIndex((go, index) => index > childGameObjectIdx);
    } else {
      nextGameObjectIdx = childGameObjects.findIndex((go, index) => index > childGameObjectIdx);
    }
    if (nextGameObjectIdx !== -1) nextGameObject = childGameObjects[nextGameObjectIdx] || null;
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

          dispatch(onAnswer({ questionItem: newQuestionItem, cardProgress }));
        }
      }
      // dispatch(updateCardProgress(cardProgress));
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
      } else {
        if (gameStatus !== GameStatus.REVIEW) {
          // Answer Last Game Directly
          // onAnswerGameObject({ _gameObject: gameObject, totalTime, isParent: true });
        }
        // setView(IELTSSpeakingView.OVERVIEW_PART);
        if (!isLastPart) {
          dispatch(getNextGameObject());
        } else {
          if (gameStatus !== GameStatus.REVIEW) {
            handleSubmitGame();
          }
        }
      }
    }
  }

  const renderChildGame = () => {
    if (view === TOEICSpeakingView.NONE) {
      return <LoadingGameIcon />
    }
    if (childGameObject) {
      const questionItem = questionItems.find((qI) => qI.id === childGameObject.id);
      const skill = childGameObject.skill;
      const isFirstQuestion = childGameObjectIdx === 0;
      const isLastQuestion = childGameObjectIdx === gameObject.childGameObjects.length - 1;
      return <div className="toeic-sw-child-game-object-view">
        {/* <span className="question-index">Question {questionItem.index}</span> */}
        <ChildTOEICSpeakingGameView
          gameObject={childGameObject}
          showResult={gameStatus === GameStatus.REVIEW}
          isFirst={isFirstQuestion}
          isFirstPart={isFirstPart}
          isLast={isLastQuestion}
          isLastPart={isLastPart}
          timeStudy={skill?.timeStudy ?? 0}
          timePrepare={skill?.timePrepare ?? 0}
          onPrev={onPrev}
          onNext={({ file, timeMs }) => {
            onAnswerGameObject({
              _gameObject: childGameObject,
              file,
              totalTime: timeMs / 1000
            })
          }}
        />
      </div>
    }
  }

  return <div className="main-game-toeic-speaking-2023-mar">
    <QuestionView question={directions} className="game-toeic-speaking-directions" />
    {lockType === "login" && <div className="game-toeic-speaking-locked-feature">
      Please <a href="#" className="unlock-link" onClick={(e) => {
        e.preventDefault();
        unlockFeatureAction();
      }}>login</a> to save your answers!
    </div>}
    {!readDirections && <div className="read-directions-btn">
      <Button variant="contained" onClick={() => setReadDirections(true)}>Got It!</Button>
    </div>}
    <Divider sx={{ mt: "14px" }} color="#e7eaef" />
    {readDirections && <div className="main-game-toeic-speaking-playzone">
      {renderChildGame()}
    </div>}
  </div>;
}

export default TOEICSpeakingGameView;
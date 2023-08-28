import { Button, useMediaQuery, useTheme } from "@mui/material";
import classNames from "classnames";
import _, { update } from "lodash";
import { PropsWithoutRef, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useGameSelector } from "../../../hooks";
import useGameContext from "../../../hooks/useGameContext";
import useSubmitGame from "../../../hooks/useSubmitGame";
import { ClientCardProgress, GameObjectStatus, GameStatus, QuestionItem } from "../../../models/game.core";
import { changeQuestionItem, getNextGameObject, getPreviousGameObject, onAnswer, updateCardProgress, upsertListCardProgress, upsertListQuestionItem } from "../../../redux/reducers/game.slice";
// import { getFormattedContentWithImg } from "../../../utils/format";
import Countdown from "../../Countdown";
import GameObjectMenu from "../../GameObjectMenu";
import HTMLContent from "../../HTMLContent";
import ClockIcon from "../../icons/ClockIcon";
import QuestionView from "../../QuestionView";
import "./style.scss";
import { TOEICWritingGameObject } from "./TOEICWritingGameObject";

function countWords(str: string) {
  return str?.match(/(\w+)/g)?.length ?? 0;
}

interface AnswerFunctionArgs {
  text?: string;
  disableSync?: boolean;
  cardId: string;
  totalTime?: number;
}

enum TOEICWritingState {
  INIT,
  PLAY
}

const TOEICWritingGameView = (props: PropsWithoutRef<{
  gameObject: TOEICWritingGameObject;
}>) => {
  const {
    gameObject
  } = props;
  const gameStatus = useGameSelector((state) => state.gameState.gameStatus);
  const gameObjects = useGameSelector((state) => state.gameState.gameObjects);
  const gameSetting = useGameSelector((state) => state.gameState.gameSetting);
  const questionItems = useGameSelector((state) => state.gameState.questionItems);
  const currentQuestion = useGameSelector((state) => state.gameState.currentQuestion);
  const currentGameIdx = useGameSelector((state) => state.gameState.currentGameIdx);
  const directions = useMemo(() => gameObject.question, [gameObject.question]);
  const cardProgresses = useGameSelector((state) => state.gameState.cardProgresses);
  const topicId = useGameSelector((state) => state.gameState.gameSetting?.topicId);
  const userId = useGameSelector((state) => state.gameState.gameSetting?.userId);

  const [answer, setAnswer] = useState("");
  const [gameDuration, setGameDuration] = useState(-1);
  const [timeStudy, setTimeStudy] = useState(-1);
  const [totalTime, setTotalTime] = useState(0);
  const [childGameObject, setChildGameObject] = useState<TOEICWritingGameObject>(null);
  const [childGameObjectIdx, setChildGameObjectIdx] = useState(-1);
  const [isFocusedOnPlay, setFocusedOnPlay] = useState(false);
  const [state, setState] = useState<TOEICWritingState>(TOEICWritingState.INIT);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const dispatch = useDispatch();
  const { onAnswer: ctxOnAnswer, onSubmitListAnswer, getFormattedContentWithImg } = useGameContext();
  const { handleSubmitGame } = useSubmitGame();
  const [directionsRef, setDirectionsRef] = useState<HTMLDivElement | null>(null);

  const isFirstGameObject = useMemo(() => !currentGameIdx, [currentGameIdx]);
  const isLastGameObject = useMemo(() => currentGameIdx === gameObjects.length - 1, [gameObjects.length, currentGameIdx]);

  const isFirstGameQuestion = useMemo(() => !childGameObjectIdx, [childGameObjectIdx]);
  const isLastGameQuestion = useMemo(() => childGameObjectIdx === gameObject.childGameObjects.length - 1, [childGameObjectIdx, gameObject.childGameObjects.length]);
  const clockId = useMemo(() => {
    if (!gameObject.hasChild || gameObject.useTimeParentSkill) return gameObject.id;
    return childGameObject?.id;
  }, [gameObject.id, childGameObjectIdx]);

  const theme = useTheme();
  const isTabletUI = useMediaQuery(theme.breakpoints.down("lg"));

  useEffect(() => {
    setState(TOEICWritingState.INIT);
    setChildGameObject(null);
    setChildGameObjectIdx(-1);
    setFocusedOnPlay(false);
    setAnswer("");
    setTotalTime(0);
    setTimeStudy(-1);
  }, [gameObject.id]);

  useEffect(() => {
    if (state === TOEICWritingState.INIT) {
      const gameProgress = cardProgresses[`${topicId}_${gameObject.id}`];
      // Time Sync
      if (gameStatus !== GameStatus.REVIEW) {
        if (gameObject.hasChild) {
          if (gameObject.useTimeParentSkill) {
            initGameDuration(gameObject, gameProgress);
          }
        } else {
          initGameDuration(gameObject, gameProgress);
        }
      } else {
        if (gameObject.hasChild && gameObject.useTimeParentSkill) {
          initGameDuration(gameObject, gameProgress);
        }
      }
      // Begin
      if (gameObject.hasChild) {
        const { nextGameObject, nextGameObjectIdx } = onNextGameObject();
        setChildGameObject(nextGameObject);
        setChildGameObjectIdx(nextGameObjectIdx);
        const cardProgress = cardProgresses[`${topicId}_${nextGameObject.id}`];
        if (!gameObject.useTimeParentSkill) {
          initGameDuration(nextGameObject, cardProgress);
        }
        if (gameStatus === GameStatus.REVIEW || gameSetting?.gameStatus === GameStatus.CONTINUE) {
          getQuestionAnswer(nextGameObject?.id);
          // setAnswer(nextGameObject?.progress?.answerOptional?.content ?? "");
        }
      } else {
        getQuestionAnswer(gameObject.id);
        initGameDuration(gameObject, gameProgress);
      }
      setState(TOEICWritingState.PLAY);
    }
  }, [gameObject.id, gameStatus, state]);

  useEffect(() => {
    if (inputRef.current && gameStatus === GameStatus.PLAY && !isFocusedOnPlay) {
      const answerLength = answer.length;
      inputRef.current.setSelectionRange(answerLength, answerLength);
      setFocusedOnPlay(true);
    }
  }, [inputRef.current, answer, isFocusedOnPlay, gameStatus]);

  useEffect(() => {
    if (gameObject.hasChild && currentQuestion) {
      const currentChildGameObjectIndex = gameObject.childGameObjects.findIndex((go) => go.id === currentQuestion.id);
      if (currentChildGameObjectIndex !== -1 && currentChildGameObjectIndex !== childGameObjectIdx) {
        setChildGameObjectIdx(currentChildGameObjectIndex);
        const go = gameObject.childGameObjects[currentChildGameObjectIndex];
        setChildGameObject(go);
        getQuestionAnswer(go.id);
      }
    }
  }, [currentQuestion?.id, childGameObjectIdx])

  const initGameDuration = (go: TOEICWritingGameObject, progress?: ClientCardProgress) => {
    const skill = go.skill;
    if (skill) {
      setTimeStudy(skill.timeStudy);
      if (gameStatus !== GameStatus.REVIEW) {
        setGameDuration(skill.timeStudy - (progress?.answerOptional?.totalTime ?? 0));
      } else {
        setGameDuration(progress?.answerOptional?.totalTime ?? 0);
      }
    }
  }

  const onNextGameObject = () => {
    let nextGameObject: TOEICWritingGameObject = null;
    let nextGameObjectIdx = -1;
    if (gameStatus !== GameStatus.REVIEW) {
      nextGameObjectIdx = gameObject.childGameObjects.findIndex((go, index) => index > childGameObjectIdx);
    } else {
      nextGameObjectIdx = gameObject.childGameObjects.findIndex((go, index) => index > childGameObjectIdx);
    }
    if (nextGameObjectIdx !== -1) nextGameObject = gameObject.childGameObjects[nextGameObjectIdx] || null;
    return {
      nextGameObject, nextGameObjectIdx
    }
  }

  const onPrevGameObject = () => {
    let prevGameObject: TOEICWritingGameObject = null;
    const prevGameObjectIdx = childGameObjectIdx - 1;
    if (prevGameObjectIdx !== -1) prevGameObject = gameObject.childGameObjects[prevGameObjectIdx] || null;
    return {
      prevGameObjectIdx, prevGameObject
    }
  }

  const onChangeText = (text: string, gameObjectId: string, sync = false, totalTime?: number) => {
    setAnswer(text);
    if (sync) {
      _onSubmitAnswer({ cardId: gameObjectId, text, disableSync: false, totalTime });
    } else {
      onSubmitAnswer({ cardId: gameObjectId, text, disableSync: true, totalTime });
    }
  }

  const _onSubmitAnswer = (args: AnswerFunctionArgs) => {
    const { cardId, text, disableSync, totalTime } = args;
    if (!cardId || gameStatus === GameStatus.REVIEW) return;
    const cardProgress = new ClientCardProgress(ClientCardProgress.getUserCardProgress({
      topicId, userId, cardId, cardProgresses
    }));
    const update: any = { content: text };
    if (typeof totalTime !== "undefined") update.totalTime = totalTime;
    cardProgress.answerOptional = {
      ...(cardProgress.answerOptional || {}),
      ...update
    }
    cardProgress.correct = null;
    const questionItem = questionItems.find((qI) => qI.id === cardId);
    const newQuestionItem = QuestionItem.clone(questionItem);
    if (questionItem && questionItem.status !== GameObjectStatus.ANSWERED) {
      newQuestionItem.setProgress({ correct: true, status: GameObjectStatus.ANSWERED });
      dispatch(onAnswer({ questionItem: newQuestionItem }));
    }

    dispatch(updateCardProgress(cardProgress));
    ctxOnAnswer(cardProgress, disableSync);
  }

  const onSubmitAnswer = useCallback(_.debounce((args: AnswerFunctionArgs) => {
    _onSubmitAnswer(args);
  }, 300), [gameObject.id, childGameObjectIdx, totalTime]);

  useEffect(() => {
    return () => {
      onSubmitAnswer.cancel();
    }
  }, [onSubmitAnswer]);

  const getQuestionAnswer = (cardId: string) => {
    const studyId = `${topicId}_${cardId}`;
    const progress = cardProgresses[studyId];
    if (progress && progress.userId === userId) {
      setAnswer(progress?.answerOptional?.content ?? "");
    } else {
      setAnswer("");
    }
  }

  const onNext = () => {
    // TODO: if (!gameObject.useTimeParentSkill) -> setTotalTime = ()
    const {
      nextGameObject,
      nextGameObjectIdx
    } = onNextGameObject();
    if (nextGameObject) {
      setChildGameObject(nextGameObject);
      setChildGameObjectIdx(nextGameObjectIdx);
      const questionItem = questionItems.find((qI) => qI.id === nextGameObject.id);
      if (questionItem) dispatch(changeQuestionItem({ item: questionItem, force: true }));
      getQuestionAnswer(nextGameObject.id);
    }
  }

  const onPrev = () => {
    const { prevGameObject, prevGameObjectIdx } = onPrevGameObject();
    if (prevGameObject) {
      setChildGameObject(prevGameObject);
      setChildGameObjectIdx(prevGameObjectIdx);
      const questionItem = questionItems.find((qI) => qI.id === prevGameObject.id);
      if (questionItem) dispatch(changeQuestionItem({ item: questionItem }));
      getQuestionAnswer(prevGameObject.id);
    }
  }

  const updateTotalTime = (cardId: string, totalTime: number, sync = false) => {
    const cardProgress = new ClientCardProgress(ClientCardProgress.getUserCardProgress({
      topicId, userId, cardId, cardProgresses
    }));
    cardProgress.answerOptional = {
      ...(cardProgress.answerOptional || {}),
      totalTime
    }
    dispatch(updateCardProgress(cardProgress));
    if (sync) {
      ctxOnAnswer(cardProgress);
    }
  }

  const submitGame = (isTimeout?: boolean) => {
    if (gameObject.hasChild) {
      const arrayCardProgresses = gameObject.childGameObjects
        .map((go) => {
          const cp = ClientCardProgress.getUserCardProgress({
            topicId, cardId: go.id, userId, cardProgresses
          });
          cp.correct = true;
          return cp;
        })
        .filter((e) => !!e);
      if (gameObject.useTimeParentSkill) {
        const parentProgress = new ClientCardProgress(ClientCardProgress.getUserCardProgress({
          topicId, cardId: gameObject.id, userId, cardProgresses
        }));
        parentProgress.correct = true;
        parentProgress.answerOptional = {
          ...(parentProgress.answerOptional || {}),
          totalTime: isTimeout && gameObject.skill ? gameObject.skill.timeStudy : totalTime
        }
        arrayCardProgresses.push(parentProgress);
      }
      const _questionItems = gameObject.childGameObjects.map((go) => {
        const questionItem = questionItems.find((qI) => qI.id === go.id);
        if (questionItem) {
          const newQuestionItem = QuestionItem.clone(questionItem);
          newQuestionItem.setProgress({ correct: true, status: GameObjectStatus.ANSWERED });
          return newQuestionItem;
        }
        return null;
      }).filter((e) => !!e);
      dispatch(upsertListQuestionItem(_questionItems));
      dispatch(upsertListCardProgress(arrayCardProgresses));
      onSubmitListAnswer(arrayCardProgresses);
    } else {
      const cardProgress = ClientCardProgress.getUserCardProgress({
        topicId, cardId: gameObject.id, userId, cardProgresses
      });
      cardProgress.correct = true;
      cardProgress.answerOptional = {
        ...(cardProgress.answerOptional || {}),
        totalTime: isTimeout && gameObject.skill ? gameObject.skill.timeStudy : totalTime
      }
      const questionItem = questionItems.find((qI) => qI.id === gameObject.id);
      if (questionItem) {
        const newQuestionItem = QuestionItem.clone(questionItem);
        newQuestionItem.setProgress({ correct: true, status: GameObjectStatus.ANSWERED });
        dispatch(onAnswer({ questionItem: newQuestionItem }));
      }
      dispatch(updateCardProgress(cardProgress));
      ctxOnAnswer(cardProgress);
    }
    if (isLastGameObject) {
      // Submit Root Game
      setTimeout(() => {
        handleSubmitGame();
      }, 300);
    } else {
      // get Next Game Object
      dispatch(getNextGameObject());
    }
  }

  const renderTextAreaAnswer = () => {
    return <div className="module-game-toeic-writing-answer">
      <div className="text-word-count">Word Count: <b>{countWords(answer)}</b></div>
      <textarea className="text-area-answer-toeic-writing"
        style={{
          height: !isTabletUI && (!gameObject.hasChild || gameObject.childGameObjects.length <= 1) ? directionsRef?.clientHeight : "200px"
        }}
        autoFocus
        spellCheck="false"
        value={answer}
        placeholder={gameStatus !== GameStatus.REVIEW ? "Your answer!" : ""}
        onChange={(e) => {
          onChangeText(
            e.target.value,
            gameObject.hasChild ? childGameObject?.id : gameObject.id,
            false,
            !gameObject.hasChild || !gameObject.useTimeParentSkill ? totalTime : undefined
          )
        }}
        onBlur={(e) => {
          _onSubmitAnswer({
            cardId: gameObject.hasChild ? childGameObject?.id : gameObject.id,
            disableSync: false,
            text: e.target.value,
            totalTime: !gameObject.hasChild || !gameObject.useTimeParentSkill ? totalTime : undefined
          })
          if (gameObject.hasChild && gameObject.useTimeParentSkill) {
            updateTotalTime(gameObject.id, totalTime, true);
          }
        }}
        onPaste={(e) => { e.preventDefault(); }}
        readOnly={gameStatus === GameStatus.REVIEW}
        ref={inputRef}
      />
    </div>
  }

  const renderChildGame = () => {
    if (gameObject.hasChild && childGameObject) {
      const questionItem = questionItems.find((qI) => qI.id === childGameObject.id);
      return <div className="module-game-toeic-writing-children">
        <div className="childgame-header">
          {questionItem && <div className="childgame-index">Question {questionItem.index}</div>}
          <div className="childgame-nav">
            <Button
              variant="outlined"
              onClick={onPrev}
              disabled={isFirstGameQuestion}
            >Back</Button>

            <Button
              variant="outlined"
              onClick={onNext}
              disabled={isLastGameQuestion}
            >Next</Button>
          </div>
          <div className="childgame-menu">
            <GameObjectMenu gameObject={childGameObject} />
          </div>
        </div>
        <QuestionView className="childgame-question" question={childGameObject.question} />
      </div>
    }
    return <></>;
  }

  return state === TOEICWritingState.PLAY && <div className="main-game-toeic-writing-2023-mar">
    <div className="main-game-toeic-writing-header">
      <div className={classNames("header-wrapper", isTabletUI ? "tablet" : "")}>
        {timeStudy !== -1 && <div className={classNames("test-clock", isTabletUI ? "tablet" : "")}>
          <ClockIcon />
          <Countdown
            id={clockId}
            total={gameDuration}
            stop={gameStatus === GameStatus.REVIEW}
            onChange={(timeLeft) => {
              const _totalTime = timeStudy - timeLeft;
              if (gameObject.hasChild && gameObject.useTimeParentSkill) {
                updateTotalTime(gameObject.id, _totalTime);
              }
              setTotalTime(_totalTime);
            }}
            onEnd={() => submitGame(true)}
            defaultTotal={0}
          />
        </div>}
        {gameStatus !== GameStatus.REVIEW && <Button
          className="submit-btn"
          variant="contained"
          onClick={() => submitGame()}
        >Submit</Button>}
        {gameStatus === GameStatus.REVIEW && <>
          <div className="game-review-nav">
            <Button
              variant="outlined"
              disabled={isFirstGameObject}
              onClick={() => { dispatch(getPreviousGameObject()); }}
            >
              Back
            </Button>

            <Button
              variant="outlined"
              disabled={isLastGameObject}
              onClick={() => { dispatch(getNextGameObject()) }}
            >
              Next
            </Button>
          </div>
        </>}
      </div>
    </div>
    <div className={classNames("main-game-toeic-writing-body", isTabletUI ? "tablet" : "")}>
      <QuestionView question={directions} className="game-toeic-writing-directions" ref={setDirectionsRef} />
      <div className="main-game-toeic-writing-answer-area">
        {renderChildGame()}
        {!gameObject.hasChild && <GameObjectMenu gameObject={gameObject} className="game-object-menu-toeic-writing-root" />}
        {renderTextAreaAnswer()}
        {gameStatus === GameStatus.REVIEW
          && gameObject.hasChild
          && gameObject.childGameObjects.length > 1
          && childGameObject
          && childGameObject.explanation
          && <div className="game-explanation-child">
            <div className="game-explanation-root-content">
              <HTMLContent content={getFormattedContentWithImg(childGameObject.explanation)} />
            </div>
          </div>}
      </div>
    </div>
    {gameStatus === GameStatus.REVIEW
      && (!gameObject.hasChild || gameObject.childGameObjects.length === 1)
      && (childGameObject?.explanation || gameObject.explanation)
      && <div className="game-explanation-root">
        <div className="game-explanation-root-content">
          <HTMLContent content={getFormattedContentWithImg(childGameObject?.explanation || gameObject.explanation)} />
        </div>
      </div>}
  </div>
}

export default TOEICWritingGameView;
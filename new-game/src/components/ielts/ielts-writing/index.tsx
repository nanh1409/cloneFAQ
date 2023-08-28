import { Box, Button, useMediaQuery, useTheme } from "@mui/material";
import classNames from "classnames";
import _ from "lodash";
import { PropsWithoutRef, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { EXAM_TYPE_IELTS } from "../../../utils/constraints";
import { useGameSelector } from "../../../hooks";
import useGameContext from "../../../hooks/useGameContext";
import useSubmitGame from "../../../hooks/useSubmitGame";
import { ClientCardProgress, GameObjectStatus, GameStatus, MapCardProgress, QuestionItem } from "../../../models/game.core";
import { changeQuestionItem, getNextGameObject, getPreviousGameObject, onAnswer, updateCardProgress, upsertListCardProgress, upsertListQuestionItem } from "../../../redux/reducers/game.slice";
import Countdown from "../../Countdown";
import GameObjectMenu from "../../GameObjectMenu";
import ClockIcon from "../../icons/ClockIcon";
import QuestionView from "../../QuestionView";
import { SpellingGameObject } from "../../spelling/SpellingGameObject";
import { IELTSWritingGameObject } from "./IELTSWritingGameObject";
import "./style.scss";

function countWords(str: string) {
  return str?.match(/(\w+)/g)?.length ?? 0;
}

interface AnswerFunctionArgs {
  cardId: string;
  totalTime?: number;
  text?: string;
  disableSync?: boolean;
}

enum IELTSWritingState {
  INIT,
  PLAY
}

const IELTSWritingGameView = (props: PropsWithoutRef<{
  gameObject: IELTSWritingGameObject;
}>) => {
  const {
    gameObject
  } = props;

  const { onAnswer: ctxOnAnswer, onSubmitListAnswer } = useGameContext();
  const dispatch = useDispatch();

  const gameStatus = useGameSelector((state) => state.gameState.gameStatus);
  const gameSetting = useGameSelector((state) => state.gameState.gameSetting);
  const currentGameIdx = useGameSelector((state) => state.gameState.currentGameIdx);
  const gameObjects = useGameSelector((state) => state.gameState.gameObjects);
  const questionItems = useGameSelector((state) => state.gameState.questionItems);
  const currentQuestion = useGameSelector((state) => state.gameState.currentQuestion);
  const cardProgresses = useGameSelector((state) => state.gameState.cardProgresses);
  const topicId = useGameSelector((state) => state.gameState.gameSetting?.topicId);
  const userId = useGameSelector((state) => state.gameState.gameSetting?.userId);

  const [childGameObject, setChildGameObject] = useState<IELTSWritingGameObject>(null);
  const [childGameObjectIdx, setChildGameObjectIdx] = useState(-1);
  const [state, setState] = useState<IELTSWritingState>(IELTSWritingState.INIT);
  const [isFocusedOnPlay, setFocusedOnPlay] = useState(false);
  const [answer, setAnswer] = useState("");
  const [timeStudy, setTimeStudy] = useState(-1);
  const [gameDuration, setGameDuration] = useState(0);
  const [totalTime, setTotalTime] = useState(0)

  const isFirstTask = useMemo(() => currentGameIdx === 0, [currentGameIdx]);
  const isLastTask = useMemo(() => currentGameIdx === gameObjects.length - 1, [currentGameIdx, gameObjects.length]);
  const clockId = useMemo(() => {
    if (!gameObject.hasChild || gameObject.useTimeParentSkill) return gameObject.id;
    return childGameObject?.id;
  }, [gameObject.id, childGameObjectIdx]);

  const theme = useTheme();
  const isTabletUI = useMediaQuery(theme.breakpoints.down("lg"));
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    setState(IELTSWritingState.INIT);
    setChildGameObject(null);
    setChildGameObjectIdx(-1);
    setFocusedOnPlay(false);
    setAnswer("");
    setTotalTime(0);
    setTimeStudy(-1);
  }, [gameObject.id]);

  useEffect(() => {
    if (state === IELTSWritingState.INIT) {
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
        if (nextGameObject) {
          setChildGameObject(nextGameObject);
          setChildGameObjectIdx(nextGameObjectIdx);
          const cardProgress = cardProgresses[`${topicId}_${nextGameObject.id}`];
          if (!gameObject.useTimeParentSkill) {
            initGameDuration(nextGameObject, cardProgress);
          }
          if (gameStatus === GameStatus.REVIEW || gameSetting?.gameStatus === GameStatus.CONTINUE) {
            // if (gameObject.childGameObjects.length === 1) {
            /**
             * In deprecated version, the module uses parent card progress for both time played and its only child question's answer.
             * In new version, each child question has its own progress.
             */
            // setAnswer((parentProgress?.answerOptional?.content ?? "") || (cardProgress?.answerOptional?.content ?? ""));
            // } else {
            setAnswer(cardProgress?.answerOptional?.content ?? "");
            // }
          }
        }
      } else {
        getQuestionAnswer(gameObject.id);
        initGameDuration(gameObject, gameProgress);
      }
      setState(IELTSWritingState.PLAY);
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
  }, [currentQuestion?.id, childGameObjectIdx]);

  const initGameDuration = (go: IELTSWritingGameObject, progress?: ClientCardProgress) => {
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

  const getQuestionAnswer = (cardId: string) => {
    const studyId = `${topicId}_${cardId}`;
    const progress = cardProgresses[studyId];
    if (progress && progress.userId === userId) {
      setAnswer(progress?.answerOptional?.content ?? "");
    } else {
      setAnswer("");
    }
  }

  const onSubmitAnswer = useCallback(_.debounce((args: AnswerFunctionArgs) => {
    _onSubmitAnswer(args);
  }, 300), [gameObject.id, childGameObjectIdx, totalTime]);

  useEffect(() => {
    return () => {
      onSubmitAnswer.cancel();
    }
  }, [onSubmitAnswer]);

  const { handleSubmitGame } = useSubmitGame();

  const onNextGameObject = () => {
    let nextGameObject: IELTSWritingGameObject = null;
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
    let prevGameObject: IELTSWritingGameObject = null;
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
    }
    onSubmitAnswer({ cardId: gameObjectId, text, disableSync: true, totalTime });
  }

  const _onSubmitAnswer = (args: AnswerFunctionArgs) => {
    const {
      cardId,
      totalTime,
      text,
      disableSync
    } = args;
    if (!cardId || gameStatus === GameStatus.REVIEW) return;
    /**
     * In deprecated version, the module uses parent card progress for both time played and its only child question's answer.
     * In new version, each child question has its own progress.
     */
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
    const questionItem = questionItems.find((qI) => qI.id === childGameObject.id);
    if (questionItem && questionItem.status !== GameObjectStatus.ANSWERED) {
      const newQuestionItem = QuestionItem.clone(questionItem);
      newQuestionItem.setProgress({ correct: true, status: GameObjectStatus.ANSWERED });
      dispatch(onAnswer({ questionItem: newQuestionItem }));
    }

    dispatch(updateCardProgress(cardProgress));
    ctxOnAnswer(cardProgress, disableSync);
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

  const submitGame = () => {
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
          totalTime
        }
        arrayCardProgresses.push(parentProgress)
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
        totalTime
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
    if (isLastTask) {
      // Submit Root Game
      setTimeout(() => {
        handleSubmitGame();
      }, 300);
    } else {
      // get Next Game Object
      dispatch(getNextGameObject());
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

  return state === IELTSWritingState.PLAY && <div className="game-object-ielts-writing-container">
    {timeStudy !== -1 && <Box display="flex" justifyContent="center" alignItems="center" columnGap="10px">
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
        onEnd={submitGame}
        defaultTotal={0}
      />
    </Box>}
    <div className="game-object-ielts-writing-view">
      <div className="game-object-ielts-writing-parent">
        <QuestionView
          question={gameObject.question}
          className="game-object-ielts-writing-parent-question"
        />
      </div>

      <div className="game-object-ielts-writing-child">
        {/* TODO: ChildGame Question View */}
        <div className="game-object-ielts-writing-label">
          Type your essay below and click <b>Submit</b>
        </div>
        <textarea
          className="game-object-ielts-writing-textarea"
          autoFocus
          spellCheck={false}
          value={answer}
          onChange={(e) => {
            onChangeText(
              e.target.value,
              gameObject.hasChild ? childGameObject?.id : gameObject.id,
              false,
              !gameObject.hasChild || !gameObject.useTimeParentSkill ? totalTime : undefined
            )
          }}
          onBlur={(e) => {
            if (gameStatus === GameStatus.REVIEW) return;
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
        <div className="game-object-ielts-writing-words-count">
          Word Count: <b>{countWords(answer)}</b>
        </div>
      </div>
    </div>

    <div className={classNames("game-object-ielts-writing-nav", isTabletUI ? "tablet" : "")}>
      {!isFirstTask && gameStatus === GameStatus.REVIEW &&
        <Button
          variant="contained"
          className="game-object-ielts-writing-nav-btn btn-prev"
          onClick={() => {
            dispatch(getPreviousGameObject());
          }}
        >
          Prev Task
        </Button>}

      {!(gameStatus === GameStatus.REVIEW && isLastTask) && <Button
        variant="contained"
        className="game-object-ielts-writing-nav-btn btn-next"
        onClick={() => {
          if (gameStatus !== GameStatus.REVIEW) {
            submitGame();
          } else {
            dispatch(getNextGameObject())
          }
        }}
      >
        {gameStatus === GameStatus.PLAY ? "Submit" : "Next Task"}
      </Button>}
    </div>
  </div>
}

export default IELTSWritingGameView;
import { Button, Container, IconButton } from "@mui/material";
import classNames from "classnames";
import React, { PropsWithoutRef, useEffect, useMemo, useRef, useState } from "react";
import OtpInput from "react-otp-input";
import { useDispatch } from "react-redux";
import { useGameSelector } from "../../hooks";
import useGameContext from "../../hooks/useGameContext";
import { GameObjectStatus, QuestionItem, GameStatus, ExplanationType } from "../../models/game.core";
import { onAnswer, ReplayMode } from "../../redux/reducers/game.slice";
// import { getFormattedContentWithImg } from "../../utils/format";
import QuestionView from "../QuestionView";
import ChoiceItem from "../quiz/ChoiceItem";
import QuizExplanation from "../quiz/QuizExplanation";
import { Choice } from "../quiz/QuizGameObject";
import CheckCorrectIcon from "./CheckCorrectIcon";
import SendAnswerIcon from "./SendAnswerIcon";
import { SpellingClientCardProgress, SpellingGameObject } from "./SpellingGameObject";
import "./spellingGameView.scss";
import TimesIncorrectIcon from "./TimesIncorrectIcon";

const SpellingGameView = (props: PropsWithoutRef<{
  gameObject: SpellingGameObject;
  showQuestionIndex?: boolean;
  isOtpInput?: boolean;
  onSubmitAnswer?: (isCorrectedAnswer: boolean) => void;
  showResult?: boolean;
  resetOnChangeGame?: boolean;
  explanationType?: ExplanationType;
}>) => {
  const {
    gameObject,
    showQuestionIndex,
    isOtpInput = false,
    onSubmitAnswer: _onSubmittedAnswer,
    showResult,
    resetOnChangeGame,
    explanationType,
  } = props;
  const { onAnswer: ctxOnAnswer, getFormattedContentWithImg } = useGameContext();
  const showResultOnAnswer = useGameSelector((state) => state.gameState.showResultOnAnswer);
  // const gameType = useGameSelector((state) => state.gameState.gameType);
  // const showQuestionsOnReview = useGameSelector((state) => state.gameState.showQuestionsOnReview);
  const questionItem = useGameSelector((state) => state.gameState.questionItems.find((item) => item.id === gameObject.id));
  const gameStatus = useGameSelector((state) => state.gameState.gameStatus);
  const language = useGameSelector((state) => state.gameState.gameSetting?.language ?? "en");
  const replayMode = useGameSelector((state) => state.gameState.replayMode);
  const cardProgresses = useGameSelector((state) => state.gameState.cardProgresses);
  const topicId = useGameSelector((state) => state.gameState.gameSetting?.topicId);
  const userId = useGameSelector((state) => state.gameState.gameSetting?.userId);
  // const sync = useGameSelector((state) => state.gameState.sync);
  const isReview = gameStatus === GameStatus.REVIEW;

  const [answered, setAnswered] = useState(false);
  const [answer, setAnswer] = useState(questionItem?.answerText ?? "");
  const [answerByWords, setAnswerByWords] = useState<string[]>([]);
  const answerLength = useMemo(() => gameObject.answer.trim().length, [gameObject.answer]);
  const numInputsArray = useMemo(() => gameObject.answer.trim().split(" ").map((e) => e.length), [gameObject.answer]);
  const otpInputRefs = useRef<OtpInput[]>([]);

  const _showResult = useMemo(() => {
    return typeof _onSubmittedAnswer !== "undefined"
      ? showResult
      : ((showResultOnAnswer && answered) || isReview)
  }, [typeof _onSubmittedAnswer, showResult, showResultOnAnswer, answered, isReview]);

  useEffect(() => {
    otpInputRefs.current.slice(1).forEach((ref) => ref !== null && ref.setState({ activeInput: -1 }));
  }, [gameObject.answer]);

  useEffect(() => {
    if (resetOnChangeGame) {
      setAnswered(false);
      setAnswer("");
      setAnswerByWords([]);
    }
  }, [resetOnChangeGame, gameObject.id]);

  useEffect(() => {
    setAnswered(questionItem?.status === GameObjectStatus.ANSWERED);
  }, [questionItem?.status]);

  useEffect(() => {
    if (replayMode !== ReplayMode.NONE) {
      setAnswered(false);
      setAnswer("");
    }
  }, [replayMode]);

  const dispatch = useDispatch();

  const onChangeOtpInput = (evt: any, index: number) => {
    setAnswerByWords(prevArray => {
      const newArray = [...prevArray];
      newArray[index] = evt;
      setAnswer(newArray.join(" "));
      return newArray;
    });
    if (index + 1 !== numInputsArray?.length && evt?.length === numInputsArray[index]) {
      otpInputRefs.current[index + 1].focusInput(0);
    }
    if (index !== 0 && evt.length === 0) {
      otpInputRefs.current[index - 1].focusInput(numInputsArray[index - 1] - 1);
    }
  }

  const submitSpelling = (args: { _answer: string }) => {
    const { _answer } = args;
    const correct = gameObject.answer.split(" / ").map((e) => e.trim().replace(/<\/?p>/gi, "").toLowerCase()).includes(_answer);
    const cardProgress = new SpellingClientCardProgress(SpellingClientCardProgress.getUserCardProgress({
      // @ts-ignore
      cardId: gameObject.id, topicId, userId, cardProgresses
    }));
    cardProgress.answer = _answer;
    cardProgress.correct = correct;
    const newHistory = cardProgress.history?.length < 5 ? [...(cardProgress.history ?? []), correct] : [...((cardProgress.history ?? []).slice(1)), correct];
    cardProgress.setHistory(newHistory);
    cardProgress.oldLastUpdate = cardProgress.lastUpdate;
    cardProgress.lastUpdate = Date.now();
    const newQuestionItem = QuestionItem.clone(questionItem!);
    newQuestionItem.setProgress({ correct, status: GameObjectStatus.ANSWERED });
    newQuestionItem.setAnswerText(answer);
    ctxOnAnswer(cardProgress);
    dispatch(onAnswer({
      questionItem: newQuestionItem,
      cardProgress
    }));
  }

  const onSubmitAnswer = () => {
    if (_showResult) return;
    const _answer = answer.trim().toLowerCase();
    if (typeof _onSubmittedAnswer !== "undefined") {
      _onSubmittedAnswer(_answer === gameObject.answer.trim().toLowerCase());
    }
    else {
      if (showResultOnAnswer) {
        if (questionItem!.status === GameObjectStatus.NOT_ANSWER || replayMode !== ReplayMode.NONE) {
          submitSpelling({ _answer });
        }
        setAnswered(true);
      } else {
        submitSpelling({ _answer });
      }
    }
  }

  return <div className="game-object-view game-object-spelling" id={`game-object-view-${gameObject.id}`}>
    <div className="question-index-wrap">
      {showQuestionIndex && <div className="game-object-view-question-index">
        <span>{questionItem?.index}.</span>
      </div>}

      <QuestionView gameObjectId={gameObject.id} question={gameObject.question} className="spelling-game-object-question" />
    </div>

    <div className="game-object-spelling-answer-box">
      <div className={classNames("answer-box-wrap", !isOtpInput ? "normal" : "otp-input")}>
        {!isOtpInput
          ? <input
            placeholder={_showResult ? "" : "Your answer..."}
            value={answer}
            onChange={(evt) => setAnswer(evt.target.value)}
            readOnly={_showResult}
            className={classNames(
              _showResult
              && (questionItem?.correct ? "input-correct-answer" : "input-incorrect-answer")
            )}
            onBlur={() => {
              if (!showResultOnAnswer) {
                onSubmitAnswer();
              }
            }}
          />
          : <Container maxWidth="lg" className="otp-input-wrap" >
            {numInputsArray.map((numInputs, index, { length }) => (
              <>
                <OtpInput
                  key={index}
                  ref={element => {
                    otpInputRefs.current[index] = element;
                  }}
                  shouldAutoFocus={index === 0}
                  value={answerByWords[index]}
                  onChange={(evt: any) => onChangeOtpInput(evt, index)}
                  isDisabled={_showResult}
                  containerStyle="answer-container"
                  inputStyle={classNames(
                    _showResult && (questionItem?.correct ? "input-correct-answer" : "input-incorrect-answer")
                  )}
                  numInputs={numInputs}
                />
                {index + 1 !== length && <div className="space-container"></div>}
              </>
            ))}
          </Container>
        }

        <div className="answer-box-button">
          {_showResult
            ? <>
              {questionItem?.correct
                ? <CheckCorrectIcon />
                : <TimesIncorrectIcon />
              }
            </>
            : <>
              {showResultOnAnswer
                ? !isOtpInput
                  ? <IconButton onClick={onSubmitAnswer}>
                    <SendAnswerIcon />
                  </IconButton>
                  : <Button variant="outlined" endIcon={<SendAnswerIcon />} onClick={onSubmitAnswer} disabled={answer?.length !== answerLength}>
                    {language === "vi" ? "Nộp" : "Submit"}
                  </Button>
                : <></>
              }
            </>
          }
        </div>
      </div>
    </div>

    {_showResult && <>
      <ChoiceItem
        choice={new Choice({ content: gameObject.answer, isCorrect: true })}
        showResult
        disabled
      />
      <QuizExplanation
        explanation={getFormattedContentWithImg(gameObject.explanation)}
        type={explanationType}
      />
    </>
    }
  </div>
}

export default SpellingGameView;
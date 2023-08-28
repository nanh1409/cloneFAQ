import classNames from "classnames";
import _ from "lodash";
import React, {
  PropsWithoutRef,
  useCallback,
  useEffect,
  useMemo, useState
} from "react";
import { useDispatch } from "react-redux";
import { useGameSelector } from "../../hooks";
import useGameContext from "../../hooks/useGameContext";
import { GameDisplayMode, GameObjectStatus, GameStatus, QuestionItem } from "../../models/game.core";
import { changeQuestionItem, onAnswer, ReplayMode } from "../../redux/reducers/game.slice";
// import { getFormattedContentWithImg, getStorageURL } from "../../utils/format";
import GameAudioPlayer from "../GameAudioPlayer";
import HTMLContent from "../HTMLContent";
import ImageWidget from "../ImageWidget";
import { SpellingClientCardProgress } from "../spelling/SpellingGameObject";
import { FillParaGameObject } from "./FillParaGameObject";
import "./fillParaGameView.scss";

const FillParaGameView = (props: PropsWithoutRef<{
  gameObject: FillParaGameObject;
  showQuestionIndex?: boolean;
}>) => {
  const { onAnswer: ctxOnAnswer, getFormattedContentWithImg, getStorageURL } = useGameContext();

  const { gameObject, showQuestionIndex } = props;
  const showResultOnAnswer = useGameSelector((state) => state.gameState.showResultOnAnswer);
  const language = useGameSelector((state) => state.gameState.gameSetting?.language ?? "en");
  const displayMode = useGameSelector((state) => state.gameState.gameSetting?.displayMode);
  const gameStatus = useGameSelector((state) => state.gameState.gameStatus);
  const replayMode = useGameSelector((state) => state.gameState.replayMode);
  const questionItems = useGameSelector((state) => state.gameState.questionItems);
  const topicId = useGameSelector((state) => state.gameState.gameSetting?.topicId);
  const userId = useGameSelector((state) => state.gameState.gameSetting?.userId);
  const devMode = useGameSelector((state) => state.gameState.gameSetting?.devMode);
  const cardProgresses = useGameSelector((state) => state.gameState.cardProgresses);
  // const gameFunction = useGameSelector((state) => state.gameState.gameFunction);
  const isReview = gameStatus === GameStatus.REVIEW;

  const [isReady, setReady] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [contentRef, setContentRef] = useState<HTMLDivElement | null>(null);

  const _showResult = useMemo(() => {
    return (showResultOnAnswer && answered) || isReview;
  }, [showResultOnAnswer, answered, isReview]);

  const gameQuestions = useMemo(() => {
    return questionItems.filter((item) => item.path.includes(gameObject.id)).sort((a, b) => a.index - b.index);
  }, [questionItems, gameObject.id]);

  const dispatch = useDispatch();

  useEffect(() => {
    const gameQuestions = questionItems.filter((item) => item.path.includes(gameObject.id));
    setAnswered(gameQuestions.every((item) => item.status === GameObjectStatus.ANSWERED));
  }, [gameObject.id]);

  useEffect(() => {
    setReady(false);
    if (contentRef) {
      const _inputEls = contentRef.querySelectorAll("input");
      const inputEls = Array.from(_inputEls).sort((a, b) => {
        const aIdx = Number(a.id.slice(a.id.lastIndexOf('-') + 1));
        const bIdx = Number(b.id.slice(b.id.lastIndexOf('-') + 1));
        if (isNaN(aIdx) || isNaN(bIdx)) return 0;
        return aIdx - bIdx;
      });
      inputEls.map((inputEl, index) => {
        const inputGameObject = gameObject.childGameObjects[index];
        const inputId = inputGameObject?.id;
        const questionItem = questionItems.find((item) => item.id === inputGameObject.id);
        if (!inputId || !questionItem || !inputGameObject) return;
        inputEl.value = questionItem.answerText || '';
        inputEl.setAttribute("autocomplete", "off");
        inputEl.setAttribute("id", `${inputId}-${index}`);
        inputEl.className = "fill-para-input";

        const questionIndexEl = inputEl.previousElementSibling;
        if (questionIndexEl) {
          questionIndexEl.setAttribute("class", "fill-para-question-index")
        }

        const submitBtnEl = contentRef.getElementsByClassName(`submit-fill-${inputId}`).item(0);
        const explanationBtnEl = contentRef.getElementsByClassName(`explanation-${inputId}`).item(0);
        const explanationContentEl = contentRef.getElementsByClassName(`explanation-content-${inputId}`).item(0);
        if (!explanationContentEl) {
          const _explanationContentEl = document.createElement("div");
          _explanationContentEl.className = `explanation-content-${inputId} fill-para-explanation-content collapsed`;
          _explanationContentEl.innerHTML = `
            <div><b>${language === "en" ? "Correct answer" : "Câu trả lời chính xác"}</b>: ${inputGameObject.answer}</div>
            ${!!inputGameObject.explanation ? `<div><b>Giải thích</b>: ${inputGameObject.explanation}</div>` : ''}
          `;
          inputEl.parentNode.insertBefore(_explanationContentEl, inputEl.nextSibling);
        };

        const renderExplanationBtnEl = () => {
          const _explanationBtnEl = document.createElement("span");
          _explanationBtnEl.className = `explanation-${inputId} fill-para-explanation-button`;
          _explanationBtnEl.innerHTML = language === "en" ? "Hide Explanation" : "Ẩn giải thích";
          _explanationBtnEl.onclick = (evt) => {
            const _explanationContentEl = document.getElementsByClassName(`explanation-content-${inputId}`).item(0);
            if (_explanationContentEl) {
              if (_explanationContentEl.classList.contains("collapsed")) {
                _explanationContentEl.classList.remove("collapsed");
                _explanationBtnEl.innerHTML = language === "en" ? "Hide Explanation" : "Ẩn giải thích";
              } else {
                _explanationContentEl.classList.add("collapsed");
                _explanationBtnEl.innerHTML = language === "en" ? "Show Explanation" : "Hiện giải thích";
              }
            }
          }
          inputEl.parentNode.insertBefore(_explanationBtnEl, inputEl.nextSibling);
        }

        if (!_showResult || replayMode !== ReplayMode.NONE) {
          if (explanationBtnEl) { explanationBtnEl.outerHTML = "" };
          if (showResultOnAnswer) {
            if (questionItem?.status !== GameObjectStatus.ANSWERED || replayMode !== ReplayMode.NONE) {
              if (replayMode !== ReplayMode.NONE) inputEl.value = "";
              inputEl.readOnly = false;
              inputEl.classList.remove("answered", "correct", "incorrect");
              if (devMode) inputEl.placeholder = inputGameObject?.answer;
              if (!submitBtnEl) {
                const _submitBtnEl = document.createElement("span");
                _submitBtnEl.innerHTML = "Submit";
                _submitBtnEl.className = `submit-fill-${inputId} fill-para-submit-input-button`;
                _submitBtnEl.onclick = (evt) => {
                  const inputValue = inputEl.value;
                  const { correct } = _onChangeInput({ questionId: inputId, value: inputValue }) || {};
                  inputEl.readOnly = true;
                  inputEl.onkeyup = (evt) => { evt.preventDefault(); return; };
                  inputEl.onblur = (evt) => { evt.preventDefault(); return; };
                  inputEl.classList.add("answered", correct ? "correct" : "incorrect");
                  if (!explanationBtnEl) {
                    renderExplanationBtnEl();
                  }
                  const explanationContentEl = contentRef.getElementsByClassName(`explanation-content-${inputId}`).item(0);
                  if (explanationContentEl) {
                    explanationContentEl.classList.remove("collapsed");
                  }
                  _submitBtnEl.remove();
                }
                inputEl.parentNode.insertBefore(_submitBtnEl, inputEl.nextSibling);
              }
            } else {
              inputEl.readOnly = true;
              inputEl.onkeyup = (evt) => { evt.preventDefault(); return; };
              inputEl.onblur = (evt) => { evt.preventDefault(); return; };
              inputEl.classList.add("answered", questionItem?.correct ? "correct" : "incorrect");
              if (!explanationBtnEl) {
                renderExplanationBtnEl();
              }
            }
          } else {
            // show result later
            inputEl.readOnly = false;
            inputEl.classList.remove("answered", "correct", "incorrect");
            inputEl.onkeyup = (evt) => {
              onChangeInput({ questionId: inputId, value: inputEl.value.trim().toLocaleLowerCase() });
            }
            inputEl.onblur = (evt) => {
              _onChangeInput({ questionId: inputId, value: inputEl.value.trim().toLocaleLowerCase() });
            }
          }
        } else {
          inputEl.readOnly = true;
          inputEl.classList.add("answered", questionItem.correct ? "correct" : "incorrect");
          inputEl.onkeyup = (evt) => { evt.preventDefault(); return; }
          inputEl.onblur = (evt) => { evt.preventDefault(); return; };
          if (!explanationBtnEl) {
            renderExplanationBtnEl();
          }
        }
      });
      setReady(true);
    }
  }, [contentRef, gameObject.id, _showResult, replayMode]);

  const _onChangeInput = (args: {
    questionId: string;
    value: string;
  }) => {
    const { questionId, value: _value } = args;
    const value = _value.trim().toLowerCase();
    const questionItem = gameQuestions.find((item) => item.id === questionId);
    const inputGameObject = gameObject.childGameObjects.find((go) => go.id === questionId);
    if (inputGameObject && questionItem) {
      const correct = inputGameObject.answer.split(" / ").map((e) => e.trim().toLowerCase()).includes(value);
      const cardProgress = new SpellingClientCardProgress(SpellingClientCardProgress.getUserCardProgress({
        cardId: questionId, topicId, userId, cardProgresses
      }));
      cardProgress.answer = value;
      cardProgress.correct = correct;
      const newHistory = cardProgress.history?.length < 5 ? [...(cardProgress.history ?? []), correct] : [...((cardProgress.history ?? []).slice(1)), correct];
      const newQuestionItem = QuestionItem.clone(questionItem || {} as QuestionItem);
      cardProgress.setHistory(newHistory);
      cardProgress.oldLastUpdate = cardProgress.lastUpdate;
      cardProgress.lastUpdate = Date.now();

      newQuestionItem.setProgress({ correct, status: GameObjectStatus.ANSWERED });
      newQuestionItem.setAnswerText(value);
      if (displayMode === GameDisplayMode.ALL_IN_PAGE) {
        dispatch(changeQuestionItem({ item: newQuestionItem }));
      }
      dispatch(onAnswer({
        questionItem: newQuestionItem,
        cardProgress
      }));
      ctxOnAnswer(cardProgress);
      return { correct }
    }
    return null;
  }

  const onChangeInput = useCallback(_.debounce((args: { questionId: string; value: string; }) => {
    return _onChangeInput(args);
  }, 300), [gameObject.id]);

  useEffect(() => {
    return () => {
      onChangeInput.cancel();
    }
  }, [onChangeInput]);

  return <div className="game-object-view game-object-fill-para" id={`game-object-view-${gameObject.id}`}>
    {showQuestionIndex && <div className={classNames("game-object-view-question-index", gameQuestions.length > 1 ? "long-index" : "")}>
      <span>{gameQuestions.length > 1
        ? `${gameQuestions[0]?.index ?? ''} - ${gameQuestions[gameQuestions.length - 1]?.index ?? ''}`
        : `${gameQuestions[0]?.index ?? ''}`
      }.</span>
    </div>}
    {!!gameObject.question.urlSound && <div className="game-object-question-sound">
      <GameAudioPlayer src={getStorageURL(gameObject.question.urlSound)} />
    </div>}

    {!!gameObject.question.urlImage && <div className="game-object-question-image">
      <ImageWidget src={getStorageURL(gameObject.question.urlImage)} width={300} />
    </div>}

    <div
      id={gameObject.id}
      ref={setContentRef}
      className={classNames(
        "game-object-question-text fill-para-question-text",
        isReady ? "ready" : ""
      )}
    >
      <HTMLContent content={getFormattedContentWithImg(gameObject.question.content)} />
    </div>
  </div>

}

export default FillParaGameView;
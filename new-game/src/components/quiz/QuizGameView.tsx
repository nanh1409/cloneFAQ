import classNames from "classnames";
import _ from "lodash";
import React, { Fragment, memo, PropsWithoutRef, useContext, useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { GameContext } from "../../context/GameContext";
import { useGameSelector } from "../../hooks";
import useCheckTOEICLRSimulator from "../../hooks/useCheckTOEICLRSimulator";
import { ExplanationType, GameObjectStatus, GameTypes, QuestionItem, GameStatus } from "../../models/game.core";
import { GameSetting } from "../../models/GameSetting";
import { onAnswer, ReplayMode, setCurrentCardId } from "../../redux/reducers/game.slice";
// import { getFormattedContentWithImg, getStorageURL } from "../../utils/format";
import ImageWidget from "../ImageWidget";
import QuestionView from "../QuestionView";
import RichContent from "../RichContent";
import ChoiceItem from "./ChoiceItem";
import QuizExplanation from "./QuizExplanation";
import { Choice, QuizClientCardProgress, QuizGameObject } from "./QuizGameObject";
import "./quizGameView.scss";
import GameObjectMenu from "../GameObjectMenu";
import useGameContext from "../../hooks/useGameContext";

const QuizGameView = (props: PropsWithoutRef<{
  gameObject: QuizGameObject;
  showQuestionIndex?: boolean;
  questionClassName?: string;
  onSelectChoice?: (choice: Choice) => void;
  showResult?: boolean;
  resetOnChangeGame?: boolean;
  explanationType?: ExplanationType;
  isRoot?: boolean;
  renderGameObjectMenu?: boolean;
}>) => {
  const {
    gameObject, showQuestionIndex,
    questionClassName,
    onSelectChoice: _onSelectedChoice,
    showResult,
    resetOnChangeGame,
    explanationType,
    isRoot,
    renderGameObjectMenu,
  } = props;
  const { onAnswer: ctxOnAnswer } = useContext(GameContext);
  const { getFormattedContentWithImg , getStorageURL} = useGameContext();
  const gameSetting = useGameSelector((state) => state.gameState.gameSetting || {} as GameSetting);
  const {
    language = "en",
    quizExplanationPosition,
    topicId,
    userId,
    enableChildGameAds,
    mathJax
  } = gameSetting;
  const showResultOnAnswer = useGameSelector((state) => state.gameState.showResultOnAnswer);
  const questionItem = useGameSelector((state) => state.gameState.questionItems.find((item) => item.id === gameObject.id));
  const gameType = useGameSelector((state) => state.gameState.gameType);
  const gameStatus = useGameSelector((state) => state.gameState.gameStatus);
  const replayMode = useGameSelector((state) => state.gameState.replayMode);
  const cardProgresses = useGameSelector((state) => state.gameState.cardProgresses);
  const { isPlayingSimulatorListening } = useCheckTOEICLRSimulator();
  const isReview = gameStatus === GameStatus.REVIEW;
  const [selected, setSelected] = useState<number[]>(questionItem?.selectedChoices ?? []);

  const _showResult = useMemo(() => {
    return typeof _onSelectedChoice !== "undefined"
      ? showResult
      : ((showResultOnAnswer && gameObject.numberOfAnswers === selected.length) || isReview)
  }, [typeof _onSelectedChoice, showResult, showResultOnAnswer, gameObject.numberOfAnswers, selected.length, isReview]);

  const multiChoiceLabel = useMemo(() => {
    return language === "vi"
      ? `Lựa chọn ${gameObject.numberOfAnswers} đáp án ${gameObject.splitPointAnswers ? "(1 point/answer)" : ""}`
      : `Select ${gameObject.numberOfAnswers} answers ${gameObject.splitPointAnswers ? "(1 point/answer)" : ""}`
  }, [gameObject.numberOfAnswers, gameObject.splitPointAnswers, language]);

  useEffect(() => {
    if (replayMode !== ReplayMode.NONE) {
      setSelected([]);
    }
  }, [replayMode]);

  useEffect(() => {
    if (resetOnChangeGame) {
      setSelected([]);
    }
  }, [resetOnChangeGame, gameObject?.id])

  const dispatch = useDispatch();

  const submitQuiz = (args: {
    _selected: number[]
  }) => {
    const { _selected } = args;
    const correctIds = gameObject.choices.filter((choice) => choice.isCorrect).map((choice) => choice.id);
    const correctNum = _selected.filter((id) => correctIds.includes(id)).length;
    const correct = gameObject.choices
      .filter((choice) => _selected.includes(choice.id))
      .every((choice) => choice.isCorrect);
    const cardProgress = new QuizClientCardProgress(QuizClientCardProgress.getUserCardProgress({
      cardId: gameObject.id, topicId: topicId, userId, cardProgresses
    }));
    cardProgress.choiceOrder = _.range(gameObject.choices.length);
    cardProgress.selectedChoices = _selected;
    cardProgress.correct = correct;
    cardProgress.correctNum = correctNum;
    const newHistory = cardProgress.history?.length < 5 ? [...(cardProgress.history ?? []), correct] : [...((cardProgress.history ?? []).slice(1)), correct];
    cardProgress.setHistory(newHistory);
    cardProgress.oldLastUpdate = cardProgress.lastUpdate;
    cardProgress.lastUpdate = Date.now();

    const newQuestionItem = QuestionItem.clone(questionItem);
    newQuestionItem.setProgress({ correct, status: GameObjectStatus.ANSWERED });
    newQuestionItem.setSelectedChoices(_selected);

    dispatch(onAnswer({
      questionItem: newQuestionItem,
      cardProgress,
      isSplitPointAnswers: gameObject.splitPointAnswers,
      splitCorrectNum: correctNum
    }));
    ctxOnAnswer(cardProgress);
  }

  const onSelectChoice = (choice: Choice, cardId: string) => {
    if (_showResult) return;
    if (typeof _onSelectedChoice !== "undefined") {
      let _selected = [...selected];
      if (gameObject.numberOfAnswers > _selected.length) {
        _selected.push(choice.id);
      } else {
        _selected = [choice.id];
      }
      setSelected(_selected);
      _onSelectedChoice(choice)
    } else {
      if (choice.isCorrect) {
        dispatch(setCurrentCardId(cardId));
      }
      if (showResultOnAnswer) {
        if (questionItem.status === GameObjectStatus.NOT_ANSWER || replayMode !== ReplayMode.NONE) {
          const isSelected = _.includes(selected, choice.id);
          if (isSelected || selected.length === gameObject.numberOfAnswers) return;
          const _selected = [...selected, choice.id];
          if (_selected.length === gameObject.numberOfAnswers) {
            submitQuiz({ _selected });
          }
          setSelected(_selected);
        }
      } else {
        let _selected = [...selected];
        if (gameObject.numberOfAnswers > _selected.length) {
          _selected.push(choice.id);
        } else {
          _selected = [choice.id];
        }
        if (_selected.length === gameObject.numberOfAnswers) {
          submitQuiz({ _selected });
        }
        setSelected(_selected);
      }
    }
  }

  return (<div className="game-object-view game-object-quiz" id={`game-object-view-${gameObject.id}`}>
    <RichContent mathJax={mathJax}>
      <div className="question-index-container">
        <div className="question-index-wrap">
          {showQuestionIndex && <div className="game-object-view-question-index">
            <span>{questionItem?.index}.</span>
          </div>}
          <QuestionView gameObjectId={gameObject.id} question={gameObject.question} className={classNames("quiz-game-object-question", questionClassName)} isRoot={isRoot} />
        </div>
        {renderGameObjectMenu && <GameObjectMenu gameObject={gameObject} className="child-game-object-view-menu" showBookmark isChildGame />}
      </div>

      <div className={classNames("game-object-quiz-playzone", isPlayingSimulatorListening && isRoot && !!gameObject.question.urlImage ? "toeic-lr-simulator" : "")}>
        {isPlayingSimulatorListening && isRoot && !!gameObject.question.urlImage && <div className="game-object-question-image">
          <ImageWidget src={getStorageURL(gameObject.question.urlImage)} width={300} />
        </div>}
        <div className="game-object-quiz-choices">
          {gameObject.numberOfAnswers > 1 && <div className="game-object-quiz-choices-label">{multiChoiceLabel}</div>}
          {gameObject.choices?.map((choice, i) => {
            const isLastCorrectChoice = choice.isCorrect && i === _.findLastIndex(gameObject.choices, (c) => c.isCorrect);
            return <Fragment key={choice.id}>
              <ChoiceItem
                choice={{
                  ...choice,
                  isSelected: _.includes(selected, choice.id)
                }}
                last={i === gameObject.choices.length - 1}
                onSelect={() => { onSelectChoice(choice, gameObject.id); }}
                showResult={_showResult}
                multiplePicking={gameObject.numberOfAnswers !== selected.length}
              />
              {quizExplanationPosition === "after-choice"
                && isLastCorrectChoice
                && _showResult
                && <QuizExplanation
                  explanation={getFormattedContentWithImg(gameObject.explanation)}
                  type={explanationType}
                  enableChildGameAds={!isRoot && !(gameObject.index % 2) && !(gameType === GameTypes.TEST && gameStatus !== GameStatus.PLAY) ? enableChildGameAds : false}
                />}
            </Fragment>
          })}
          {quizExplanationPosition === "below"
            && _showResult
            && <QuizExplanation
              explanation={getFormattedContentWithImg(gameObject.explanation)}
              type={explanationType}
              enableChildGameAds={!isRoot && !(gameObject.index % 2) && !(gameType === GameTypes.TEST && gameStatus !== GameStatus.PLAY) ? enableChildGameAds : false}
            />}
        </div>
      </div>
    </RichContent>
  </div>);
}

export default memo(QuizGameView);
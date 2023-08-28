import _ from "lodash";
import { useMemo } from "react";
import { useDispatch } from "react-redux";
import { useGameSelector } from ".";
import { ParaGameObject } from "../components/para/ParaGameObject";
import { QuizClientCardProgress, QuizGameObject } from "../components/quiz/QuizGameObject";
import { ClientCardProgress, GameObjectStatus, GameStatus, QuestionItem } from "../models/game.core";
import { getNextGameObject, onAnswer, setGameDuration, setShowSkillTutorial, upsertListCardProgress, upsertListQuestionItem } from "../redux/reducers/game.slice";
import { SKILL_TYPE_LISTENING, SKILL_TYPE_READING } from "../utils/constraints";
import useGameContext from "./useGameContext";

export default function useCheckTOEICLRSimulator() {
  const isTOEICLRSimulator = useGameSelector((state) => state.gameState.gameSetting?.testConfig?.toeicLR?.simulationMode);
  const allowPause = useGameSelector((state) => state.gameState.gameSetting?.testConfig?.toeicLR?.allowPause);
  const useDefaultPrepareTime = useGameSelector((state) => state.gameState.gameSetting?.testConfig?.toeicLR?.useDefaultPrepareTime);
  const gameStatus = useGameSelector((state) => state.gameState.gameStatus);
  const currentQuestion = useGameSelector((state) => state.gameState.currentQuestion);
  const currentGame = useGameSelector((state) => state.gameState.currentGame);
  const questionItems = useGameSelector((state) => state.gameState.questionItems);
  const skills = useGameSelector((state) => state.gameState.skills);
  const topicId = useGameSelector((state) => state.gameState.gameSetting?.topicId);
  const userId = useGameSelector((state) => state.gameState.gameSetting?.userId);
  const cardProgresses = useGameSelector((state) => state.gameState.cardProgresses);
  const duration = useGameSelector((state) => state.gameState.gameSetting?.duration ?? 0);
  const dispatch = useDispatch();
  const { onAnswer: ctxOnAnswer, onSubmitListAnswer } = useGameContext();

  const isPlayingSimulator = useMemo(() => {
    return isTOEICLRSimulator && gameStatus === GameStatus.PLAY;
  }, [isTOEICLRSimulator, gameStatus]);

  const questionItemDeps = JSON.stringify(questionItems);
  const nextQuestion = _.find(questionItems, (q) => q.status === GameObjectStatus.NOT_ANSWER);

  const currentSkillType = useMemo(() => currentQuestion?.skillType, [currentQuestion?.id]);
  const currentSkillValue = useMemo(() => currentQuestion?.skillValue, [currentQuestion?.id]);
  const currentSkillPart = useMemo(() => skills.find((e) => e.value === currentSkillValue), [currentSkillValue, skills]);
  const isListening = currentSkillType === SKILL_TYPE_LISTENING;
  const isReading = currentSkillType === SKILL_TYPE_READING;
  const {
    isFirstPartGame,
    isLastPartGame,
    isFirstReadingGame
  } = useMemo(() => {
    const qItems: Array<QuestionItem> = JSON.parse(questionItemDeps);
    const currentPartQuestions = qItems.filter((q) => q.skillValue === currentSkillValue);
    const prevPartLastQuestion = qItems[currentPartQuestions[0]?.index - 2];
    const currentGameQuestionIds = qItems.filter((q) => (q.path[0] || q.id) === currentGame?.id).map((q) => q.id);
    const isFirstPartGame = currentGameQuestionIds.includes(currentPartQuestions[0]?.id);
    const isFirstReadingGame = isFirstPartGame && prevPartLastQuestion && prevPartLastQuestion.skillType === SKILL_TYPE_LISTENING;
    return {
      isFirstPartGame,
      isLastPartGame: currentGameQuestionIds.includes(currentPartQuestions[currentPartQuestions.length - 1]?.id),
      isFirstReadingGame
    }
  }, [questionItemDeps, currentSkillValue, currentGame?.id])

  const onNextGameListening = () => {
    if (currentGame instanceof QuizGameObject) {
      const questionItem = questionItems.find((q) => q.id === currentGame.id);
      if (questionItem) {
        if (questionItem.status === GameObjectStatus.NOT_ANSWER) {
          const newQuestionItem = QuestionItem.clone(questionItem);
          newQuestionItem.status = GameObjectStatus.SKIP;
          const cardProgress = new QuizClientCardProgress(QuizClientCardProgress.getUserCardProgress({
            cardId: currentGame.id,
            topicId,
            userId,
            cardProgresses
          }))
          cardProgress.skip = true;
          dispatch(onAnswer({
            questionItem: newQuestionItem,
            cardProgress
          }))
          ctxOnAnswer(cardProgress);
        }
      }
    } else if (currentGame instanceof ParaGameObject) {
      const _questionItems = questionItems.filter((q) => q.path[0] === currentGame.id);
      if (_questionItems.length && _questionItems.some((q) => q.status === GameObjectStatus.NOT_ANSWER)) {
        const data = _questionItems.reduce((data, q) => {
          if (q.status === GameObjectStatus.NOT_ANSWER) {
            const newQuestionItem = QuestionItem.clone(q);
            newQuestionItem.status = GameObjectStatus.SKIP;
            const cardProgress = new QuizClientCardProgress(QuizClientCardProgress.getUserCardProgress({
              cardId: q.id,
              topicId,
              userId,
              cardProgresses
            }))
            cardProgress.skip = true;
            data.arrQuestionItems.push(newQuestionItem);
            data.arrCardProgress.push(cardProgress)
          }
          return data;
        }, {
          arrCardProgress: [],
          arrQuestionItems: []
        } as {
          arrCardProgress: Array<ClientCardProgress>;
          arrQuestionItems: Array<QuestionItem>;
        });
        dispatch(upsertListCardProgress(data.arrCardProgress));
        dispatch(upsertListQuestionItem(data.arrQuestionItems));
        onSubmitListAnswer(data.arrCardProgress);
      }
    }
    if (isLastPartGame) {
      if (isListening && nextQuestion?.skillType === SKILL_TYPE_READING) {
        let newDuration = Math.round(duration * 77.5 / 100);
        if (duration === 7200) newDuration = 4500;
        dispatch(setGameDuration(newDuration));
      }
      dispatch(setShowSkillTutorial(true))
    }
    dispatch(getNextGameObject())
    // setTimeout(() => {
    //   dispatch(getNextGameObject())
    // }, disableDelay ? 0 : 5000);
  }

  return {
    isTOEICLRSimulator,
    useDefaultPrepareTime,
    isPlayingSimulator,
    isListening,
    isPlayingSimulatorListening: isPlayingSimulator && isListening,
    isPlayingSimulatorReading: isPlayingSimulator && isReading,
    onNextGameListening,
    nextQuestion,
    isFirstPartGame,
    isLastPartGame,
    isFirstReadingGame,
    currentSkillPart,
    allowPause
  }
}
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useGameSelector } from "../../hooks";
import useGameContext from "../../hooks/useGameContext";
import { ClientCardProgress, GameObjectStatus, QuestionItem } from "../../models/game.core";
import { onAnswer, setUpdateBoxCard } from "../../redux/reducers/game.slice";
// import { updateTopicBoxCard } from "../../redux/reducers/topic.slice";
import { FlashCardGameObject } from "./FlashCardGameObject";

const useSubmitFlashCard = () => {
  const {
    onAnswer: ctxOnAnswer,
    onUpdateTopicBoxCard
  } = useGameContext();
  const topicId = useGameSelector((state) => state.gameState.gameSetting?.topicId);
  const userId = useGameSelector((state) => state.gameState.gameSetting?.userId);
  // const sync = useGameSelector((state) => state.gameState.sync);
  const cardProgresses = useGameSelector((state) => state.gameState.cardProgresses);
  const updateBoxCard = useGameSelector((state) => state.gameState.updateBoxCard);
  const questionItems = useGameSelector((state) => state.gameState.questionItems);
  const dispatch = useDispatch();

  useEffect(() => {
    if (topicId) {
      if (updateBoxCard !== null) {
        onUpdateTopicBoxCard({ topicId, boxCard: updateBoxCard });
        // dispatch(updateTopicBoxCard({ topicId, boxCard: updateBoxCard }));
        dispatch(setUpdateBoxCard(null));
      }
    }
  }, [updateBoxCard, topicId]);

  const onSubmit = (args: {
    gameObject: FlashCardGameObject;
    correct: boolean;
    isPractice?: boolean;
  }) => {
    const { gameObject, correct, isPractice } = args;
    const studyId = `${topicId}_${gameObject.id}`;
    let cardProgress =
      cardProgresses[studyId]
        ? (cardProgresses[studyId]?.userId === userId ? ClientCardProgress.clone(cardProgresses[studyId]) : undefined)
        : undefined;
    if (!cardProgress) cardProgress = new ClientCardProgress({
      cardId: gameObject.id,
      topicId,
      userId,
      correct
    });
    else
      cardProgress.correct = correct;
    const newHistory = cardProgress.history?.length < 5 ? [...(cardProgress.history ?? []), correct] : [...((cardProgress.history ?? []).slice(1)), correct];
    cardProgress.setHistory(newHistory);
    const questionItem = questionItems.find(({ id }) => id === gameObject.id);
    if (questionItem) {
      const newQuestionItem = QuestionItem.clone(questionItem);
      newQuestionItem.setProgress({ correct, status: GameObjectStatus.ANSWERED });
      dispatch(onAnswer({
        questionItem: newQuestionItem,
        cardProgress
      }));
      ctxOnAnswer(cardProgress);
    }
  }

  return {
    onSubmit
  }
}

export default useSubmitFlashCard;
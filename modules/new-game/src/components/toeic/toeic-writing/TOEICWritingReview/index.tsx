import { useMemo } from "react";
import { useGameSelector } from "../../../../hooks";
import { ClientCardProgress, QuestionItem } from "../../../../models/game.core";

const TOEICWritingReview = () => {
  const gameObjects = useGameSelector((state) => state.gameState.gameObjects);
  const questionItems = useGameSelector((state) => state.gameState.questionItems);
  const cardProgresses = useGameSelector((state) => state.gameState.cardProgresses);
  const userId = useGameSelector((state) => state.gameState.gameSetting?.userId);
  const topicId = useGameSelector((state) => state.gameState.gameSetting?.topicId);

  const mapQuestionItem = useMemo(() => {
    return questionItems.reduce((map, qI) => {
      map[qI.id] = qI;
      return map;
    }, {} as { [id: string]: QuestionItem })
  }, [questionItems]);

  const mapGameObjectProgress = useMemo(() => {
    return questionItems.reduce((map, qI) => {
      const studyId = `${topicId}_${qI.id}`;
      const cProgress = cardProgresses[studyId];
      if (cProgress?.userId === userId) {
        map[qI.id] = cProgress;
      }
      return map;
    }, {} as { [cardId: string]: ClientCardProgress });
  }, [userId, cardProgresses, questionItems]);

  return <div className="mod-game-toeic-writing-review-2023-apr">
    {gameObjects.map((go) => {
      return <div className="game-toeic-writing-review-block">

      </div>
    })}
  </div>
}

export default TOEICWritingReview;
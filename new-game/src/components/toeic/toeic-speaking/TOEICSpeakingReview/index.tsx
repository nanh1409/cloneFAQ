import { useMemo } from "react";
import GameAudioPlayer from "../../../../components/GameAudioPlayer";
import { useGameSelector } from "../../../../hooks";
import { ClientCardProgress, QuestionItem } from "../../../../models/game.core";
import QuestionView from "../../../QuestionView";
import { TOEICSpeakingGameObject } from "../TOEICSpeakingGameObject";
import "./style.scss";

const TOEICSpeakingReview = () => {
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


  return <div className="mod-game-toeic-speaking-review-2023-mar">
    {gameObjects.map((go) => {
      return <div className="game-toeic-speaking-review-block" key={go.id}>
        {go instanceof TOEICSpeakingGameObject && <>
          <QuestionView question={go.question} className="go-toeic-spk-directions" />
          {go.childGameObjects.map((cgo) => {
            const index = mapQuestionItem[cgo.id]?.index;
            const progress = mapGameObjectProgress[cgo.id];
            return <div className="go-toeic-speaking-main" key={cgo.id}>
              <div className="question-label">Question {index}</div>
              <QuestionView question={cgo.question} className="question-content-toeic-spk-review" />
              {progress?.answerOptional?.file?.[0]
                ? <>
                  <GameAudioPlayer src={progress?.answerOptional?.file?.[0]} />
                </>
                : <span style={{ fontStyle: "italic", fontWeight: "bold" }}>Unanswered</span>
              }

              {!!cgo.explanation && <div className="sample-response">
                <div className="sample-response-title">SAMPLE</div>
                <div dangerouslySetInnerHTML={{ __html: cgo.explanation }} />
              </div>}
            </div>
          })}
        </>
        }
      </div>
    })}
  </div>
}

export default TOEICSpeakingReview;
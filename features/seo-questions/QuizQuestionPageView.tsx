import { Button } from "@mui/material";
import Image from "next/image";
import { Fragment, useMemo } from "react";
import { useSelector } from "../../app/hooks";
import { ROUTER_STUDY } from "../../app/router";
import RawLink from "../../components/RawLink";
import useAppConfig from "../../hooks/useAppConfig";
import ChoiceItem from "../../modules/new-game/src/components/quiz/ChoiceItem";
import { QuizGameObject } from "../../modules/new-game/src/components/quiz/QuizGameObject";
import RichContent from "../../modules/new-game/src/components/RichContent";
import { Card } from "../../modules/share/model/card";
import "./quizQuestionPageView.scss";
import { getQuestionSlug } from "./seoQuestion.logic";

const QuizQuestionPageView = (props: {
  card: Card;
  relatedCards?: Array<Card>;
  mathJax?: boolean;
  learningSlug?: string;
}) => {
  const {
    card,
    relatedCards = [],
    mathJax,
    learningSlug
  } = props;

  const gameObject = useMemo(() => {
    const gameObject = new QuizGameObject(card);
    return gameObject;
  }, [card?._id]);

  const appConfig = useAppConfig();
  const appInfo = useSelector((state) => state.appInfos.appInfo);

  return <div className="quiz-question-page-view">
    <div className="page-question-container">
      {!!gameObject.question.urlImage && <div className="question-image">
        <Image src={gameObject.question.urlImage}
          layout="responsive"
          width="100%"
          height="100%"
          objectFit="contain"
        />
      </div>}
      <RichContent mathJax={mathJax}>
        <h1 className="question-title" dangerouslySetInnerHTML={{ __html: gameObject.question.content }} />

        {gameObject.choices.map((choice, i) => choice.isCorrect
          ? <ChoiceItem
            choice={choice}
            key={i}
            showResult
            disabled
          />
          : <Fragment key={i}></Fragment>)}

        {gameObject.explanation && <div className="question-explanation">
          <p className="explanation-title">Explanation</p>
          <p className="explanation-content" dangerouslySetInnerHTML={{ __html: gameObject.explanation }} />
        </div>}
      </RichContent>

      <div className="explore">
        <RawLink href={learningSlug ? `/${ROUTER_STUDY}/${learningSlug}` : "/"}>
          <Button classes={{ root: "explore-btn" }}>Explore more {appConfig.appName.toUpperCase()} questions</Button>
        </RawLink>

        <div className="explore-content">
          Visit our <a href={appInfo.siteAddress}>website</a> for other {appConfig.appName.toUpperCase()} topics now!
        </div>
      </div>
    </div>

    <div className="page-related-questions-container">
      <div className="related-questions-title">Related questions</div>
      <div className="related-questions-list">
        {relatedCards.map((card) => {
          const href = `/quiz/${getQuestionSlug(card.question.text, card._id)}`;
          return <div key={card._id} className="related-question-item">
            <RawLink href={href} dangerouslySetInnerHTML={{ __html: card.question.text }} />
          </div>;
        })}
      </div>
    </div>
  </div>
}

export default QuizQuestionPageView;
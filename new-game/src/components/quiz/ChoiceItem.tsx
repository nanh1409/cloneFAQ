import classNames from "classnames";
import React, { PropsWithoutRef, memo } from "react";
import { useGameSelector } from "../../hooks";
// import { getFormattedContentWithImg } from "../../utils/format";
import "./choiceItem.scss";
import QuizBoxIcon from "./QuizBoxIcon";
import QuizBoxSelectedIcon from "./QuizBoxSelectedIcon";
import QuizCorrectIcon from "./QuizCorrectIcon";
import { Choice } from "./QuizGameObject";
import QuizIncorrectIcon from "./QuizIncorrectIcon";
import useGameContext from "../../hooks/useGameContext";

const ChoiceItem = memo((props: PropsWithoutRef<{
  choice: Choice;
  last?: boolean;
  onSelect?: () => void;
  showResult?: boolean;
  multiplePicking?: boolean;
  disabled?: boolean
}>) => {
  const { choice, last = false, onSelect = () => { }, showResult = false, multiplePicking = false, disabled } = props;
  const devMode = useGameSelector((state) => state.gameState.gameSetting?.devMode);
  const renderIconItem = () => {
    if ((showResult && (choice.isSelected || choice.isCorrect)) || (showResult && multiplePicking && choice.isSelected)) {
      return choice.isCorrect ? <QuizCorrectIcon /> : <QuizIncorrectIcon />
    } else {
      return choice.isSelected ? <QuizBoxSelectedIcon /> : <QuizBoxIcon className="quiz-choice-item-icon-svg" />
    }
  }
  const { getFormattedContentWithImg } = useGameContext();
  return <div
    className={classNames(
      "quiz-choice-item",
      last ? "item-last" : "",
      showResult && choice.isSelected ? "picking" : "",
      disabled ? "disabled" : "",
      devMode && choice.isCorrect ? "dev-correct" : "",
      showResult ? "show-result" : ""
    )}
    onClick={onSelect}
  >
    <div className={classNames(
      "quiz-choice-item-icon",
      showResult ? "show-result" : ""
    )}>
      {renderIconItem()}
    </div>
    {/* <RichContent mathJax={mathJax}> */}
    <div className={classNames(
      "quiz-choice-item-content",
      showResult && !choice.isSelected && !choice.isCorrect ? "not-selected" : "",
      showResult && choice.isSelected && !choice.isCorrect ? "incorrect" : "",
      showResult && choice.isSelected && choice.isCorrect ? "correct" : "",
      !showResult && choice.isSelected ? "picking" : ""
    )}
      dangerouslySetInnerHTML={{ __html: getFormattedContentWithImg(choice.content) }}
    ></div>
    {/* </RichContent> */}
  </div>
}, (prevProps, nextProps) => { 
  const prevChoice = prevProps.choice;
  const nextChoice = nextProps.choice
  const renderProps = ["last", "showResult", "multiplePicking", "disabled"]
  const keyChoice = ["id", "content", "isCorrect", "isSelected"]
  return !(renderProps.some(prop => prevProps[prop] !== nextProps[prop]) || keyChoice.some(key => prevChoice[key] !== nextChoice[key]))
})

export default ChoiceItem;
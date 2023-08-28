import { styled } from "@mui/styles";
import { memo, PropsWithoutRef, useMemo } from "react";
import { useGameSelector } from "../../hooks";
import { GameTypes } from "../../models/game.core";
import PaletteStatIcon from "./PaletteStatIcon";

export type QuestionStatProps = {
  classes?: {
    root?: string;
  }
}

const QuestionStatContainer = styled("div")({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  "& .questions-stat-item": {
    "& .questions-stat-item-text": {
      marginLeft: 10,
      color: "#1d1d1d",
      fontWeight: 500,
      fontSize: 14,
      lineHeight: "21px"
    }
  }
})

const QuestionStat = memo((props: PropsWithoutRef<QuestionStatProps>) => {
  const {
    classes = {
      root: ""
    }
  } = props;
  const totalQuestions = useGameSelector((state) => state.gameState.totalQuestions);
  const totalCorrect = useGameSelector((state) => state.gameState.totalCorrect);
  const totalIncorrect = useGameSelector((state) => state.gameState.totalIncorrect);
  const gameType = useGameSelector((state) => state.gameState.gameType);
  const language = useGameSelector((state) => state.gameState.gameSetting?.language);

  const labels = useMemo(() => {
    let correct = "Correct";
    let incorrect = "Incorrect";
    if (language === "vi") {
      correct = "Câu đúng"; incorrect = "Câu sai";
    }
    if (gameType === GameTypes.FLASH_CARD) {
      correct = "Memorized"; incorrect = "Unmemorized";
      if (language === "vi") {
        correct = "Đã thuộc"; incorrect = "Chưa thuộc";
      }
    }
    return { correct, incorrect };
  }, [gameType, language])

  return <QuestionStatContainer className={classes.root}>
    <div className="questions-stat-item">
      <PaletteStatIcon fill="#4caf50" />
      <span className="questions-stat-item-text">{totalCorrect}/{totalQuestions} {labels.correct}</span>
    </div>

    <div className="questions-stat-item">
      <PaletteStatIcon fill="#FF5252" />
      <span className="questions-stat-item-text">{totalIncorrect}/{totalQuestions} {labels.incorrect}</span>
    </div>
  </QuestionStatContainer>
})

export default QuestionStat;
import { LinearProgress } from "@mui/material";
import { styled, withStyles } from "@mui/styles";
import { memo, PropsWithoutRef, useMemo } from "react";
import { useGameSelector } from "../../hooks";

export type QuestionProgressProps = {
  classes?: {
    root?: string;
  }
}

const QuestionProgressContainer = styled("div")({
  display: "flex",
  alignItems: "center",
  "& .game-progress-bar": { width: "100%" },
  "& .progress-title": {
    marginLeft: "16px",
    fontSize: 13,
    fontWeight: 600,
    color: "#29313a"
  }
})

const GameProgressBar = withStyles(({
  root: {
    backgroundColor: "#D8D9DC",
    height: 8,
    borderRadius: 50
  },
  barColorPrimary: { backgroundColor: "#4CAF50" }
}))(LinearProgress);

const QuestionProgress = memo((props: PropsWithoutRef<QuestionProgressProps>) => {
  const {
    classes = {
      root: ""
    }
  } = props;
  const totalQuestions = useGameSelector((state) => state.gameState.totalQuestions);
  const totalCorrect = useGameSelector((state) => state.gameState.totalCorrect);
  const totalIncorrect = useGameSelector((state) => state.gameState.totalIncorrect);
  const totalAnswered = useMemo(() => totalCorrect + totalIncorrect, [totalCorrect, totalIncorrect]);
  return <QuestionProgressContainer className={classes.root}>
    <div className="game-progress-bar">
      <GameProgressBar
        color="primary"
        variant="determinate"
        value={100 * (totalAnswered / (totalQuestions || 1))}
      />
    </div>
    <div className="progress-title">{totalAnswered}/{totalQuestions}</div>
  </QuestionProgressContainer>;
})

export default QuestionProgress;
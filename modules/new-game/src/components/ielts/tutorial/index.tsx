import { Button } from "@mui/material";
import { PropsWithoutRef, memo } from "react";
// import { getFormattedContentWithImg } from "../../../utils/format";
import HTMLContent from "../../HTMLContent";
import "./style.scss";
import useGameContext from "../../../hooks/useGameContext";

const IELTSTutorialView = memo((props: PropsWithoutRef<{
  tutorial?: string;
  onSkip?: () => void;
}>) => {
  const { getFormattedContentWithImg } = useGameContext();
  return <div className="game-object-ielts-tutorial">
    <div className="game-object-ielts-tutorial-content">
      <HTMLContent content={getFormattedContentWithImg(props.tutorial)} />
    </div>

    <div className="game-object-ielts-tutorial-skip">
      <Button variant="contained" onClick={props.onSkip}>Start</Button>
    </div>
  </div>
})

export default IELTSTutorialView;
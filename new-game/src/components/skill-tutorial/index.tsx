import HourglassEmpty from "@mui/icons-material/HourglassEmpty";
import { Button } from "@mui/material";
import { useCallback, useEffect, useMemo } from "react";
import { useDispatch } from "react-redux";
import useCheckTOEICLRSimulator from "../../hooks/useCheckTOEICLRSimulator";
import useCountdown from "../../hooks/useCountdown";
import { setShowSkillTutorial } from "../../redux/reducers/game.slice";
// import { getFormattedContentWithImg } from "../../utils/format";
import HTMLContent from "../HTMLContent";
import "./style.scss";
import useGameContext from "../../hooks/useGameContext";

const SkillTutorial = () => {
  const dispatch = useDispatch();

  const { getFormattedContentWithImg } = useGameContext();

  const {
    isTOEICLRSimulator,
    currentSkillPart
  } = useCheckTOEICLRSimulator();
  const {
    autoSkip,
    autoSkipAfter
  } = useMemo(() => {
    let autoSkip = false, autoSkipAfter = 0;
    if (isTOEICLRSimulator) {
      autoSkip = true;
      autoSkipAfter = 5;
    }
    return {
      autoSkip,
      autoSkipAfter
    }
  }, [isTOEICLRSimulator]);

  const { value: skipInSecs } = useCountdown({
    key: currentSkillPart?._id,
    total: autoSkipAfter ? 5 : 0,
    onEnd: () => {
      dispatch(setShowSkillTutorial(false))
    }
  })


  const renderTutorial = useCallback(() => {
    if (isTOEICLRSimulator) {
      if (!currentSkillPart) return <></>;
      return <>
        <div className="skill-part-name">
          {currentSkillPart.name}
        </div>
        <HTMLContent content={getFormattedContentWithImg(currentSkillPart.tutorial || "")} />
      </>
    }
    return <></>
  }, [isTOEICLRSimulator, currentSkillPart?._id]);

  return <div className="game-module-skill-tutorial-view">
    <div className="tutorial-text-content">
      {renderTutorial()}
    </div>
    <div className="tutorial-skip-button">
      {!(autoSkip && !autoSkipAfter) && <Button
        variant="outlined"
        onClick={() => {
          if (autoSkip) return;
          dispatch(setShowSkillTutorial(false))
        }}>
        {autoSkip
          ? <>
            <HourglassEmpty fontSize="inherit" className="tutorial-countdown-icon" />
            {skipInSecs}
          </>
          : "Start"}
      </Button>}
    </div>
  </div>
}

export default SkillTutorial;
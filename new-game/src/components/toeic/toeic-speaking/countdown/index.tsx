import FiberManualRecord from "@mui/icons-material/FiberManualRecord";
import { Button, Tooltip } from "@mui/material";
import classNames from "classnames";
import { memo, useEffect, useMemo, useState } from "react";
import Countdown, { CountdownProps } from "../../../Countdown";
import "./style.scss";

const keyShowSkipCountdown = "show_skip_countdown";
const getShowSkipCountdownLocal = () => {
  try {
    return !!JSON.parse(localStorage.getItem(keyShowSkipCountdown))
  } catch (error) {
    return false;
  }
}
const TOEICSpeakingCountdown = memo((props: CountdownProps & {
  className?: string;
  title?: string;
  recording?: boolean;
  onClickSkip?: () => void;
}) => {
  const {
    title, className, recording, onClickSkip, ...countdownProps
  } = props;
  const showSkipCountdown = useState(getShowSkipCountdownLocal());
  useEffect(() => {
    if (!showSkipCountdown) {
      localStorage.setItem(keyShowSkipCountdown, "true");
    }
  }, [showSkipCountdown]);

  return <div className={classNames("mod-game-toeic-spk-countdown", className)}>
    <div className="mod-game-toeic-spk-countdown-btn-wrap">
      <Tooltip title="Click to Skip" arrow placement="right" open={!!onClickSkip && !showSkipCountdown}>
        <Button className="mod-game-toeic-spk-cd-main-btn" onClick={onClickSkip}>
          {title}
        </Button>
      </Tooltip>
      <div className="mod-game-toeic-spk-cd-bg-layer" />
    </div>

    <div className="mod-game-toeic-spk-cd-clock">
      {recording && <FiberManualRecord fontSize="small" color="error" />}
      <Countdown {...countdownProps} style={{
        color: "#636CF5",
        fontWeight: 500
      }} />
    </div>
  </div>
}, (prevProps, nextProps) => {
  return !["className", "title", "recording"].some(prop => prevProps[prop] !== nextProps[prop])
})

export default TOEICSpeakingCountdown;
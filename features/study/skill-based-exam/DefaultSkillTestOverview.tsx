import { Button, useMediaQuery, useTheme } from "@mui/material";
import { styled } from "@mui/styles";
import classNames from "classnames";
import { PropsWithoutRef, useMemo } from "react";
import PracticeDoneImg from "../../../modules/new-game/src/components/icons/practice-images/PracticeDoneImg";
import PracticeInProgressImg from "../../../modules/new-game/src/components/icons/practice-images/PracticeInProgressImg";

export type DefaultSkillTestOverviewProps = {
  completed?: boolean;
  inProgress?: boolean;
  onClickPlay?: () => void;
  onClickReview?: () => void;
}

const Root = styled("div")({
  backgroundColor: "#fff",
  width: "100%",
  borderRadius: 15,
  padding: "25px 10px",
  paddingTop: "40px",
  "@media (max-width: 992px)": {
    padding: "15px",
    paddingTop: "40px",
    border: "1px solid #e4e6ed"
  },
  "& .test-game-done-title": {
    fontWeight: 600,
    fontSize: 24,
    color: "#1d1d1d",
    textAlign: "center"
  },
  "& .test-game-image": {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginTop: "28px",
  },
  "& .game-buttons": {
    display: "flex",
    alignItems: "center",
    margin: "0 auto",
    marginTop: "46px",
    justifyContent: "space-between",
    maxWidth: 400,
    "&.single-button": {
      justifyContent: "center"
    },
    "&.mobile": {
      gap: "10px"
    },
    "& .game-button": {
      textTransform: "uppercase",
      letterSpacing: 1,
      height: 40,
      width: 180,
      borderRadius: 50,
      fontWeight: 700,
      "&-play, &-play:hover": {
        border: "2px solid #007aff",
        color: "#007aff"
      },
      "&-review, &-review:hover": {
        background: "#007aff",
        color: "#fff"
      }
    }
  }
})

const DefaultSkillTestOverview = (props: PropsWithoutRef<DefaultSkillTestOverviewProps>) => {
  const {
    completed,
    inProgress,
    onClickPlay = () => { },
    onClickReview = () => { },
  } = props;

  const theme = useTheme();
  const isMobileUI = useMediaQuery(theme.breakpoints.down('sm'));
  const isNew = useMemo(() => !inProgress && !completed, [inProgress, completed]);

  return <Root>
    {completed && <div className="test-game-done-title">
      Congratulations
    </div>}
    <div className="test-game-image">
      {!completed ? <PracticeInProgressImg /> : <PracticeDoneImg />}
    </div>
    <div className={classNames(
      "game-buttons",
      !completed ? "single-button" : "",
      isMobileUI ? "mobile" : ""
    )}>
      {(isNew || inProgress) && <Button
        className="game-button game-button-play"
        onClick={onClickPlay}
      >
        {inProgress ? "CONTINUE" : "Take test"}
      </Button>}

      {completed && <>
        <Button className="game-button game-button-play" onClick={onClickPlay}>TRY AGAIN</Button>
        <Button className="game-button game-button-review" onClick={onClickReview}>REVIEW</Button>
      </>}
    </div>
  </Root>
}

export default DefaultSkillTestOverview;
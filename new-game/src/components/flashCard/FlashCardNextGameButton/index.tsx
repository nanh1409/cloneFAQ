import ChevronRight from "@mui/icons-material/ChevronRight";
import { Button } from "@mui/material";
import classNames from "classnames";
import React, { memo, PropsWithoutRef } from "react";
import { useDispatch } from "react-redux";
import { useGameSelector } from "../../../hooks";
import { getNextFlashCardGameObject } from "../../../redux/reducers/game.slice";
import { flashCardTrans } from "../FlashCardOverview";
import "./flashCardNextGameButton.scss";

const FlashCardNextGameButton = memo((props: PropsWithoutRef<{ className?: string }>) => {
  const dispatch = useDispatch();
  const showNext = useGameSelector((state) => state.gameState.showNext);
  const language = useGameSelector((state) => state.gameState.gameSetting?.language ?? "en");
  return showNext
    ? <Button
      className={classNames("flash-card-play-game-button-next-card", props.className)}
      onClick={() => {
        dispatch(getNextFlashCardGameObject());
      }}
      endIcon={<ChevronRight />}
    >
      {flashCardTrans[language].next}
    </Button>
    : <></>
});

export default FlashCardNextGameButton;
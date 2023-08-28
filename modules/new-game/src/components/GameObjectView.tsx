import { Box, useMediaQuery, useTheme } from "@mui/material";
import classNames from "classnames";
import React, { memo, PropsWithoutRef, useEffect, useMemo } from "react";
import { useGameSelector } from "../hooks";
import useCheckTOEICLRSimulator from "../hooks/useCheckTOEICLRSimulator";
import { CLASS_GAME_LAYOUT_LEFT_RIGHT, GameDisplayMode, GameObject, GameTypes } from "../models/game.core";
import { SKILL_TYPE_LISTENING } from "../utils/constraints";
import { FillParaGameObject } from "./fillPara/FillParaGameObject";
import FillParaGameView from "./fillPara/FillParaGameView";
import GameObjectMenu from "./GameObjectMenu";
import "./gameObjectView.scss";
import { GAME_PANEL_ID } from "./GameView";
import IELTSSpeakingGameView from "./ielts/ielts-speaking";
import { IELTSSpeakingGameObject } from "./ielts/ielts-speaking/IELTSSpeakingGameObject";
import IELTSWritingGameView from "./ielts/ielts-writing";
import { IELTSWritingGameObject } from "./ielts/ielts-writing/IELTSWritingGameObject";
import { ParaGameObject } from "./para/ParaGameObject";
import ParaGameView from "./para/ParaGameView";
import { QuizGameObject } from "./quiz/QuizGameObject";
import QuizGameView from "./quiz/QuizGameView";
import { SpellingGameObject } from "./spelling/SpellingGameObject";
import SpellingGameView from "./spelling/SpellingGameView";
import { TOEICSpeakingGameObject } from "./toeic/toeic-speaking/TOEICSpeakingGameObject";
import TOEICSpeakingGameView from "./toeic/toeic-speaking/TOEICSpeakingGameView";
import { TOEICWritingGameObject } from "./toeic/toeic-writing/TOEICWritingGameObject";
import TOEICWritingGameView from "./toeic/toeic-writing/TOEICWritingGameView";

const GameObjectView = memo((props: PropsWithoutRef<{
  gameObject: GameObject,
  showQuestionIndex?: boolean,
  isRoot?: boolean,
  id?: any,
  renderGameObjectMenu?: boolean,
}>) => {
  const { gameObject, showQuestionIndex, isRoot, id, renderGameObjectMenu } = props;
  const displayMode = useGameSelector(state => state.gameState.gameSetting?.displayMode);
  const gameType = useGameSelector(state => state.gameState.gameType);
  const useParaLeftRightDefault = useGameSelector((state) => state.gameState.gameSetting?.useParaLeftRightDefault);
  const isDisplayBookmark = useMemo(() => [GameTypes.FLASH_CARD, GameTypes.TEST].includes(gameType), [gameType]);
  const theme = useTheme();
  const isTabletUI = useMediaQuery(theme.breakpoints.down("lg"));
  const {
    isTOEICLRSimulator
  } = useCheckTOEICLRSimulator();

  useEffect(() => {
    if (displayMode !== GameDisplayMode.ALL_IN_PAGE && !!gameObject?.id) {
      document.getElementById(GAME_PANEL_ID)?.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [gameObject?.id]);

  const renderRootGOMenu = () => {
    if (!isDisplayBookmark) {
      if (!(gameObject instanceof TOEICWritingGameObject || gameObject instanceof TOEICSpeakingGameObject)) {
        return <GameObjectMenu gameObject={gameObject} className="game-object-view-menu" />;
      }
      return <></>;
    } else if (gameObject instanceof ParaGameObject) {
      return <GameObjectMenu gameObject={gameObject} className="game-object-view-menu" />;
    } else if (gameObject instanceof TOEICWritingGameObject || gameObject instanceof TOEICSpeakingGameObject) {
      return <></>;
    } else if (gameObject instanceof IELTSWritingGameObject || gameObject instanceof IELTSSpeakingGameObject) {
      return <></>;
    }
    if (isTOEICLRSimulator && gameObject.skill?.type === SKILL_TYPE_LISTENING) {
      return <GameObjectMenu gameObject={gameObject} className="game-object-view-menu" />;
    }
    return <GameObjectMenu gameObject={gameObject} className="game-object-view-menu" showBookmark />;
  }

  const renderGame = () => {
    if (gameObject instanceof QuizGameObject) {
      return <QuizGameView
        gameObject={gameObject}
        key={gameObject.id}
        showQuestionIndex={showQuestionIndex}
        isRoot={isRoot}
        renderGameObjectMenu={renderGameObjectMenu}
      />
    } else if (gameObject instanceof SpellingGameObject) {
      return <SpellingGameView
        gameObject={gameObject}
        key={gameObject.id}
        showQuestionIndex={showQuestionIndex}
      />
    } else if (gameObject instanceof FillParaGameObject) {
      return <FillParaGameView
        key={gameObject.id}
        gameObject={gameObject}
        showQuestionIndex={showQuestionIndex}
      />
    } else if (gameObject instanceof ParaGameObject) {
      return <ParaGameView
        gameObject={gameObject}
        key={gameObject.id}
        isRoot={isRoot}
      />
    } else if (gameObject instanceof IELTSSpeakingGameObject) {
      return <IELTSSpeakingGameView
        gameObject={gameObject}
      />
    } else if (gameObject instanceof IELTSWritingGameObject) {
      return <IELTSWritingGameView
        gameObject={gameObject}
      />
    } else if (gameObject instanceof TOEICSpeakingGameObject) {
      return <TOEICSpeakingGameView
        gameObject={gameObject}
      />
    } else if (gameObject instanceof TOEICWritingGameObject) {
      return <TOEICWritingGameView
        gameObject={gameObject}
      />
    }
  }
  return <div id={id} className="game-object-view-container">{
    isRoot
      ? <>
        {renderRootGOMenu()}
        {gameObject instanceof ParaGameObject
          ? <Box className={classNames(
            "box-game-para",
            !(gameObject.question?.content?.includes(CLASS_GAME_LAYOUT_LEFT_RIGHT) || gameObject.question?.isLayoutLeftRight) && !useParaLeftRightDefault ? "box-layout-normal" : ""
          )} sx={{
            height: gameObject.question?.isLayoutLeftRight || gameObject.question?.content?.includes(CLASS_GAME_LAYOUT_LEFT_RIGHT) || useParaLeftRightDefault
              ? (isTabletUI ? "63vh" : "80vh")
              : "auto",
            "> .game-object-view": {
              height: "inherit"
            }
          }}>
            {renderGame()}
          </Box>
          : <div className="normal-root-container">
            {renderGame()}
          </div>}
      </>
      : <>
        {renderGame()}
      </>
  }</div>
});

export default GameObjectView;
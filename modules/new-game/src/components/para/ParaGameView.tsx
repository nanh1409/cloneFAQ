import { useMediaQuery, useTheme } from "@mui/material";
import classNames from "classnames";
import React, { PropsWithoutRef, useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { useGameSelector } from "../../hooks";
import useCheckCurrentAudio from "../../hooks/useCheckCurrentAudio";
import useCheckTOEICLRSimulator from "../../hooks/useCheckTOEICLRSimulator";
import useGameContext from "../../hooks/useGameContext";
import { CLASS_GAME_LAYOUT_LEFT_RIGHT, GameObjectStatus, GameTypes, GameStatus } from "../../models/game.core";
import { setRootParaExplanationHeight } from "../../redux/reducers/game.slice";
import { SKILL_TYPE_LISTENING } from "../../utils/constraints";
// import { getStorageURL } from "../../utils/format";
import GameAudioPlayer from "../GameAudioPlayer";
import GameObjectView from "../GameObjectView";
import ExplanationLockIcon from "../icons/ExplainationLockIcon";
import QuestionView from "../QuestionView";
import { ParaGameObject } from "./ParaGameObject";
import "./paraGameView.scss";
const ParaGameView = (props: PropsWithoutRef<{
  gameObject: ParaGameObject;
  onAnswer?: () => void;
  isSize?: number;
  isRoot?: boolean;
}>) => {
  const { gameObject, isRoot } = props;
  const {
    isCheckShowCollapse, userPlaying, gameType, gameStatus, showResultOnAnswer, questionItems,
    gameSetting, showNext
  } = useGameSelector((state) => state.gameState);
  const { language, useParaLeftRightDefault, featureLockType: lockType } = gameSetting || {};
  const { unlockFeatureAction, getStorageURL } = useGameContext();
  const enableSetCurrentAudio = useCheckCurrentAudio();
  const {
    isTOEICLRSimulator,
    isPlayingSimulatorListening,
    onNextGameListening,
    useDefaultPrepareTime
  } = useCheckTOEICLRSimulator();
  const theme = useTheme();
  const isTabletUI = useMediaQuery(theme.breakpoints.down('lg'));

  const isReview = useMemo(() => gameStatus === GameStatus.REVIEW, [gameStatus]);
  const isDisplayBookmark = useMemo(() => [GameTypes.FLASH_CARD, GameTypes.TEST].includes(gameType), [gameType]);

  const _showResult = useMemo(() => {
    const isReview = gameStatus === GameStatus.REVIEW;
    return (showResultOnAnswer && gameObject.status === GameObjectStatus.ANSWERED) || isReview;
  }, [gameType, gameStatus, showResultOnAnswer, gameObject.status])

  const paraQuestionLabel = useMemo(() => {
    const gameQuestions = questionItems.filter((item) => (item.path[0] || item.id) === gameObject.id);
    return gameQuestions.length === 1 ? `${gameQuestions[0]?.index}` : `${gameQuestions[0]?.index}-${gameQuestions[gameQuestions.length - 1]?.index}`;
  }, [questionItems, gameObject]);

  const explanationLabel = useMemo(() =>
    language === "vi" ? "Giải thích" : "Explanation"
    , [language]);

  const [rootExplanationRef, setRootExplanationRef] = useState<HTMLDivElement | null>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (rootExplanationRef && !isReview) {
      dispatch(setRootParaExplanationHeight(rootExplanationRef.clientHeight));
    }
  }, [rootExplanationRef, isReview, gameObject.id]);

  useEffect(() => {
    return () => {
      dispatch(setRootParaExplanationHeight(0));
    }
  }, [gameObject.id]);

  const lockLabel = useMemo(() => {
    let lockLabel = <></>;
    if (lockType === "login") lockLabel = <>Please <a className="unlock-link" href="#" onClick={(e) => {
      e.preventDefault();
      unlockFeatureAction();
    }}>login to view detailed</a> explanation!</>;
    else if (lockType === "upgrade-plan") lockLabel = <>Please <a className="unlock-link" href="#" onClick={(e) => {
      e.preventDefault();
      unlockFeatureAction();
    }}>upgrade</a> your account to view detailed explanation!</>;
    return lockLabel;
  }, [lockType]);

  return (<>
    {!!gameObject.question.urlSound && isRoot && <div className="game-object-question-sound-para">
      <GameAudioPlayer
        src={getStorageURL(gameObject.question.urlSound)}
        playOnRender={!!userPlaying && !!isRoot}
        enableSetCurrentAudio={enableSetCurrentAudio}
        audioId={gameObject.id}
        disableControl={isPlayingSimulatorListening && isRoot}
        disableLoop={isPlayingSimulatorListening && isRoot}
        disableSeek={isPlayingSimulatorListening && isRoot}
        hideSeek={isPlayingSimulatorListening && isRoot}
        hideSpeedRate={isPlayingSimulatorListening && isRoot}
        onEnd={() => {
          if (isPlayingSimulatorListening && isRoot) {
            onNextGameListening()
          }
        }}
        delay={isPlayingSimulatorListening && isRoot
          ? (useDefaultPrepareTime ? (gameObject.skill?.timePrepare || 5) : (gameObject.skill?.timePrepare || 0))
          : 0}
      />
    </div>}
    <div className={classNames(
      "game-object-view game-object-para",
      isTabletUI ? "tablet" : "",
      !!gameObject.question.urlSound && isRoot ? "has-sound" : "",
      !isRoot ? "non-root" : "para-root-container",
      !(gameObject.question.content.includes(CLASS_GAME_LAYOUT_LEFT_RIGHT) || gameObject.question?.isLayoutLeftRight) && !useParaLeftRightDefault ? "normal-layout" : ""
    )} id={gameObject.id}>
      <QuestionView gameObjectId={gameObject.id} questionLabel={paraQuestionLabel} question={gameObject.question} isPara isRoot={isRoot} />

      <div id={`child-${gameObject.id}`} className={classNames(
        "game-object-para-children",
        !isCheckShowCollapse ? "showCollapse" : "",
        isTabletUI ? "tablet" : "",
        !gameObject.question.content && !gameObject.question.urlImage ? "no-parent-content" : ""
      )}>
        {gameObject.childGameObjects.map((childGameObject) => (
          <div className="game-object-child-wrap" key={childGameObject.id} id={`child-${gameObject.id}-${childGameObject.id}`}>
            <GameObjectView gameObject={childGameObject} showQuestionIndex renderGameObjectMenu={!(isTOEICLRSimulator && childGameObject.skill?.type === SKILL_TYPE_LISTENING) && isDisplayBookmark} />
          </div>
        ))}
      </div>
    </div>

    {_showResult &&
      !!gameObject.explanation &&
      isRoot &&
      <div
        ref={setRootExplanationRef}
        className={classNames("game-object-question-explanation-para", showNext ? "showNext" : "")}
      >
        <div><b>{explanationLabel}</b>:</div>
        {!!lockType
          ? <div className="locked-explanation">
            <ExplanationLockIcon />
            <div className="locked-explanation-title">{lockLabel}</div>
          </div>
          : <div dangerouslySetInnerHTML={{ __html: gameObject.explanation }} />
        }
      </div>}
  </>)
}

export default ParaGameView;
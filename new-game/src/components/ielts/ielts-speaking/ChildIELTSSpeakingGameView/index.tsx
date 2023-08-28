import { Button, useMediaQuery, useTheme } from "@mui/material";
import classNames from "classnames";
import { PropsWithoutRef, useEffect, useMemo, useRef, useState } from "react";
import { useGameSelector } from "../../../../hooks";
import { ClientCardProgress, GameStatus } from "../../../../models/game.core";
import AudioRecorder, { AudioRecorderRef } from "../../../audio-recorder";
import Countdown from "../../../Countdown";
import GameAudioPlayer from "../../../GameAudioPlayer";
import GameObjectMenu from "../../../GameObjectMenu";
import QuestionView from "../../../QuestionView";
import { IELTSSpeakingGameObject } from "../IELTSSpeakingGameObject";
import "./style.scss";

const ChildIELTSSpeakingGameView = (props: PropsWithoutRef<{
  gameObject: IELTSSpeakingGameObject;
  showResult?: boolean;
  isFirst?: boolean;
  isFirstPart?: boolean;
  isLast?: boolean;
  isLastPart?: boolean;
  onPrev?: () => void;
  onNext?: (args: {
    file?: string;
    timeMs?: number;
  }) => void;
  onSavingFile?: () => void;
  onSavedFile?: () => void;
  timePrepare?: number;
  onEndPrepare?: () => void;
  forceEnd?: boolean;
}>) => {
  const {
    gameObject,
    showResult,
    isFirst,
    isFirstPart,
    isLast,
    isLastPart,
    onPrev = () => { },
    onNext = () => { },
    onSavingFile = () => { },
    onSavedFile = () => { },
    timePrepare = 0,
    onEndPrepare = () => { },
    forceEnd = false
  } = props;

  const recorderRef = useRef<AudioRecorderRef | null>(null);
  const uploadURL = useGameSelector((state) => state.gameState.gameSetting?.uploadURL);
  // const sync = useGameSelector((state) => state.gameState.sync);
  const gameStatus = useGameSelector((state) => state.gameState.gameStatus);
  const cardProgresses = useGameSelector((state) => state.gameState.cardProgresses);
  const topicId = useGameSelector((state) => state.gameState.gameSetting?.topicId);
  const userId = useGameSelector((state) => state.gameState.gameSetting?.userId);
  
  const iPhoneChecked = useMemo(() => {
    const ua = typeof window !== "undefined" ? navigator.userAgent : "";
    return /iPhone|iPad|iPod/i.test(ua);
  }, []);

  const [url, setURL] = useState("");
  const [onPrepare, setOnPrepare] = useState(true);

  const theme = useTheme();
  const isTabletUI = useMediaQuery(theme.breakpoints.down("lg"));

  useEffect(() => {
    setOnPrepare(true);
    return () => {
      setURL("");
    }
  }, [gameObject.id]);

  useEffect(() => {
    if (gameStatus === GameStatus.REVIEW) {
      const cardProgress = ClientCardProgress.getUserCardProgress({
        topicId, userId, cardId: gameObject.id, cardProgresses
      });
      setURL(cardProgress?.answerOptional?.file?.at(0) ?? "");
    }
  }, [gameObject.id, gameStatus]);

  useEffect(() => {
    if (gameStatus === GameStatus.REVIEW) {
      handleEndPrepare();
    } else {
      if (timePrepare < 0) handleEndPrepare();
    }
  }, [gameObject.id, gameStatus, timePrepare]);

  useEffect(() => {
    if (gameStatus !== GameStatus.REVIEW && forceEnd && !!recorderRef.current) {
      recorderRef.current.stopRecord();
    }
  }, [gameObject.id, forceEnd, gameStatus, !!recorderRef.current]);

  const handleEndPrepare = () => {
    setOnPrepare(false);
    onEndPrepare();
  }

  return <div className="game-object-ielts-speaking-view">
    {/* <GameObjectMenu gameObject={gameObject} className="game-object-view-menu" /> */}
    <QuestionView question={gameObject.question} className="game-object-ielts-speaking-question" />
    {gameStatus !== GameStatus.REVIEW && <div className="game-object-ietls-speaking-playzone">
      {onPrepare
        ? <div title="Skip" className="game-object-ielts-speaking-time-prepare" onClick={handleEndPrepare}>
          Time to Think:
          <Countdown
            id={gameObject.id}
            total={timePrepare}
            onEnd={handleEndPrepare}
            stop={!onPrepare}
            onChange={() => { }}
          />
        </div>
        : <AudioRecorder
          id={gameObject.id}
          ref={recorderRef}
          autoStart
          onSavingFile={onSavingFile}
          onSaveFileSuccess={({ data, timeMs }) => {
            onSavedFile();
            setURL(data);
            onNext({ file: data, timeMs });
          }}
          uploadURL={uploadURL}
          forceStop={forceEnd}
        />}
    </div>}
    {gameStatus === GameStatus.REVIEW && url && <div className="game-object-ietls-speaking-playzone">
      <GameAudioPlayer src={url} />
    </div>}

    <div className={classNames("game-object-ielts-speaking-nav", isTabletUI ? "tablet" : "")}>
      {showResult && !(isFirstPart && isFirst) && <Button
        variant="contained" onClick={onPrev}
        className="game-object-ielts-speaking-nav-btn btn-prev"
      >
        Prev {isFirst ? "Part" : "Question"}
      </Button>}

      {showResult && !(isLast && isLastPart) && <Button
        variant="contained"
        className="game-object-ielts-speaking-nav-btn btn-next"
        onClick={() => {
          onNext({});
        }}>Next {isLast ? "Part" : "Question"}
      </Button>}
    </div>
  </div>
}

export default ChildIELTSSpeakingGameView;
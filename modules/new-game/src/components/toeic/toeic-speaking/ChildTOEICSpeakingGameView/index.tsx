import { Button, useMediaQuery, useTheme } from "@mui/material";
import classNames from "classnames";
import { PropsWithoutRef, useEffect, useMemo, useRef, useState } from "react"
import { useGameSelector } from "../../../../hooks";
import { GameObject } from "../../../../models/game.core"
// import { getFormattedContentWithImg } from "../../../../utils/format";
import AudioRecorder, { AudioRecorderRef } from "../../../audio-recorder";
import GameAudioPlayer from "../../../GameAudioPlayer";
import GameObjectMenu from "../../../GameObjectMenu";
import HTMLContent from "../../../HTMLContent";
import QuestionView from "../../../QuestionView";
import TOEICSpeakingCountdown from "../countdown";
import "./style.scss";
import useGameContext from "../../../../hooks/useGameContext";

const ChildTOEICSpeakingGameView = (props: PropsWithoutRef<{
  gameObject: GameObject;
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
  timeStudy?: number;
  timePrepare?: number;
}>) => {
  const {
    gameObject,
    showResult,
    isFirst,
    isFirstPart,
    isLast,
    isLastPart,
    onPrev,
    onNext,
    timeStudy = 0,
    timePrepare = 0
  } = props;

  const [isPrepareFinished, setPrepareFinished] = useState(!timePrepare);
  const [isResponseFinished, setResponseFinished] = useState(false);
  const recorderRef = useRef<AudioRecorderRef | null>(null);
  const uploadURL = useGameSelector((state) => state.gameState.gameSetting?.uploadURL);
  const cardProgresses = useGameSelector((state) => state.gameState.cardProgresses);
  const topicId = useGameSelector((state) => state.gameState.gameSetting?.topicId);
  const userId = useGameSelector((state) => state.gameState.gameSetting?.userId);

  const { getFormattedContentWithImg } = useGameContext();

  const gameProgress = useMemo(() => {
    const studyId = `${topicId}_${gameObject.id}`;
    const gameProgress = cardProgresses[studyId];
    return gameProgress && gameProgress.userId === userId ? gameProgress : undefined;
  }, [cardProgresses, topicId, userId, gameObject.id]);
  const url = gameProgress?.answerOptional?.file?.[0] ?? "";

  const theme = useTheme();
  const isTabletUI = useMediaQuery(theme.breakpoints.down("lg"));

  useEffect(() => {
    return () => {
      cleanFunc();
    }
  }, [gameObject.id]);

  const cleanFunc = () => {
    setPrepareFinished(false);
    setResponseFinished(false);
  }

  const handleEndPrepare = () => {
    setPrepareFinished(true);
  }

  const handleEndResponseTime = () => {
    setResponseFinished(true);
  }

  return <div className="game-object-toeic-speaking-view-c-2023-mar">
    <GameObjectMenu gameObject={gameObject} className="game-object-view-menu" />
    <QuestionView question={gameObject.question} className="game-object-toeic-speaking-question" />

    {!showResult && <>
      {!isPrepareFinished && <TOEICSpeakingCountdown
        id={`cd-prepare-${gameObject.id}`}
        total={timePrepare}
        title="PREPARATION TIME"
        stop={isPrepareFinished}
        onClickSkip={handleEndPrepare}
        onEnd={handleEndPrepare}
        onChange={() => { }}
      />}

      {isPrepareFinished && <div className="mod-game-toeic-spk-response-section">
        <TOEICSpeakingCountdown
          id={`cd-response-${gameObject.id}`}
          className={classNames("mod-game-toeic-spk-response-timer", isResponseFinished ? "finished" : "")}
          total={timeStudy}
          title="RESPONSE TIME"
          stop={isResponseFinished}
          recording
          onChange={() => { }}
          onEnd={handleEndResponseTime}
        />

        <div className="mod-game-toeic-speaking-recorder">
          <AudioRecorder
            autoStart
            ref={recorderRef}
            onSavingFile={() => { setResponseFinished(true); }}
            onSaveFileSuccess={({ data, timeMs }) => {
              onNext({ file: data, timeMs });
              // cleanFunc();
            }}
            uploadURL={uploadURL}
            forceStop={isResponseFinished}
          />
        </div>
      </div>}
    </>}

    {showResult && <>
      <div className="game-object-toeic-speaking-playzone">
        {url
          ? <>
            <GameAudioPlayer src={url} />
          </>
          : <span style={{ fontStyle: "italic", fontWeight: "bold" }}>Unanswered</span>}
      </div>
      {gameObject.explanation && <div className="game-object-speaking-sample">
        <div className="game-object-speaking-sample-content">
          <HTMLContent content={getFormattedContentWithImg(gameObject.explanation)} />
        </div>
      </div>}

      <div className={classNames("game-object-toeic-speaking-nav", isTabletUI ? "tablet" : "")}>
        {!(isFirstPart && isFirst) && <Button
          variant="contained" onClick={onPrev}
          className="game-object-toeic-speaking-nav-btn btn-prev"
        >
          Prev Question
        </Button>}

        {!(isLast && isLastPart) && <Button
          variant="contained"
          className="game-object-toeic-speaking-nav-btn btn-next"
          onClick={() => {
            onNext({});
          }}>Next Question
        </Button>}
      </div>
    </>}
  </div>
}

export default ChildTOEICSpeakingGameView;
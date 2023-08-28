import { useMediaQuery, useTheme } from "@mui/material";
import _ from "lodash";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useGameSelector } from "../../../hooks";
import { GameObject } from "../../../models/game.core";
import { setShowNext } from "../../../redux/reducers/game.slice";
// import { getStorageURL } from "../../../utils/format";
import { QuizGameObject } from "../../quiz/QuizGameObject";
import QuizGameView from "../../quiz/QuizGameView";
import { SpellingGameObject } from "../../spelling/SpellingGameObject";
import SpellingGameView from "../../spelling/SpellingGameView";
import AudioButton from "../AudioButton";
import { FlashCardGameObject, FlashCardGameTypes } from "../FlashCardGameObject";
import FlashCardNextGameButton from "../FlashCardNextGameButton";
import useSubmitFlashCard from "../useSubmitFlashCard";
import "./flashCardPlayGameView.scss";
import useGameContext from "../../../hooks/useGameContext";

const FlashCardPlayGameView = ({ onRestartGame, onOpenDialog }: { onRestartGame?: () => void, onOpenDialog?: (id: string) => void }) => {
  const currentGame = useGameSelector((state) => state.gameState.currentGame);
  const gameObjects = useGameSelector((state) => state.gameState.gameObjects);
  const showNext = useGameSelector((state) => state.gameState.showNext);
  const { totalCorrect, totalIncorrect } = useGameSelector((state) => state.gameState);
  const [gameType, setGameType] = useState<FlashCardGameTypes | null>(null);
  const [gameObject, setGameObject] = useState<GameObject | null>(null)
  const [showResult, setShowResult] = useState(false);
  const [isPlayingAudio, setPlayingAudio] = useState(false);
  const theme = useTheme();
  const isTabletUI = useMediaQuery(theme.breakpoints.down("lg"));

  const dispatch = useDispatch();

  const { onSubmit: onSubmitFlashCard } = useSubmitFlashCard();
  const { getStorageURL} = useGameContext();

  // useEffect(() => {
  //   if ((totalCorrect || totalIncorrect) && onRestartGame) {
  //     onRestartGame();
  //   }
  // }, []);

  useEffect(() => {
    if (!!currentGame?.id) {
      const _game = _.sample([
        FlashCardGameTypes.QUIZ,
        FlashCardGameTypes.SPELLING
      ]);
      setGameType(_game);
      setShowResult(false);
      if (_game === FlashCardGameTypes.QUIZ)
        setGameObject((currentGame as FlashCardGameObject).toQuizGameObject({ samples: gameObjects as FlashCardGameObject[] }));
      else if (_game === FlashCardGameTypes.SPELLING)
        setGameObject((currentGame as FlashCardGameObject).toSpellingGameObject());

    }
  }, [currentGame?.id]);

  useEffect(() => {
    dispatch(setShowNext(showResult));
  }, [showResult]);

  const onSubmitAnswer = (correct: boolean) => {
    onSubmitFlashCard({
      gameObject: gameObject as FlashCardGameObject,
      correct
    });
  }

  const renderGame = () => {
    if (!gameObject) return <></>;
    switch (gameType) {
      case FlashCardGameTypes.QUIZ:
        return <QuizGameView
          gameObject={gameObject as QuizGameObject}
          questionClassName="flash-card-quiz-question"
          onSelectChoice={(choice) => {
            onSubmitAnswer(choice.isCorrect);
            setShowResult(true);
          }}
          showResult={showResult}
          resetOnChangeGame
          explanationType="example"
        />;
      case FlashCardGameTypes.SPELLING:
        return <SpellingGameView
          gameObject={gameObject as SpellingGameObject}
          isOtpInput
          onSubmitAnswer={(isCorrectedAnswer) => {
            onSubmitAnswer(isCorrectedAnswer);
            setShowResult(true);
          }}
          showResult={showResult}
          resetOnChangeGame
          explanationType="example"
        />;
      default:
        return <></>;
    }
  }

  return gameType !== null
    ? <>
      <div id="flash-card-play-game-view">
        {currentGame?.question?.urlSound && <AudioButton
          src={getStorageURL(currentGame?.question?.urlSound)}
          isPlaying={isPlayingAudio}
          onChange={setPlayingAudio}
          onClick={() => {
            if (!showResult) return;
            if (!isPlayingAudio) setPlayingAudio(true);
          }}
          size="large"
          className="flash-card-audio-button"
        />}
        {renderGame()}
        {!isTabletUI && <FlashCardNextGameButton className="flash-card-desktop-footer-right" />}
      </div>
    </>
    : <></>
}

export default FlashCardPlayGameView;
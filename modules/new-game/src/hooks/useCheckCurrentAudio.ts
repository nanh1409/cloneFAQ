import { useMemo } from "react";
import { useGameSelector } from ".";
import { GameDisplayMode, GameStatus, GameTypes } from "../models/game.core";

export default function useCheckCurrentAudio() {
  const displayMode = useGameSelector((state) => state.gameState.gameSetting?.displayMode);
  const gameType = useGameSelector((state) => state.gameState.gameType);
  const gameStatus = useGameSelector((state) => state.gameState.gameStatus);
  const currentPlayingAudioId = useGameSelector((state) => state.gameState.currentPlayingAudioId);

  return useMemo(() => {
    return displayMode === GameDisplayMode.ALL_IN_PAGE && gameType === GameTypes.TEST && gameStatus === GameStatus.PLAY
  }, [displayMode, gameType, gameStatus, currentPlayingAudioId])
}
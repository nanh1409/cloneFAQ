import { useDispatch } from "react-redux";
import { useGameSelector } from ".";
import { GameTypes, GameStatus } from "../models/game.core";
import { resetGameStateAfterQuitting } from "../redux/reducers/game.slice";
// import { setShowStudyView } from "../redux/reducers/topic.slice";
import useSubmitGame from "./useSubmitGame";

const useQuitGame = () => {
  const gameStatus = useGameSelector((state) => state.gameState.gameStatus);
  const gameType = useGameSelector((state) => state.gameState.gameSetting?.gameType);
  const { handleSubmitGameOnBackground, handleSubmitGame } = useSubmitGame();
  const dispatch = useDispatch();

  // useEffect(() => {
  //   const handleBeforeUnload = (e) => {
  //     e = e || window.event;
  //     if (e) {
  //       if (gameType === GameTypes.TEST && gameStatus === GameStatus.PLAY) {
  //         //submit 
  //         handleSubmitGameOnBackground({ isPause: true });
  //       }
  //       e.returnValue = 'Sure?';
  //     }
  //   };
  //   const handleUnload = () => {
  //     if (gameType === GameTypes.TEST && gameStatus === GameStatus.PLAY) {
  //       //submit 
  //       handleSubmitGame({ isPause: true });
  //     }
  //   };
  //   window.addEventListener("beforeunload", handleBeforeUnload);
  //   //window.addEventListener("unload", handleUnload);
  //   return () => {
  //     window.removeEventListener("beforeunload", handleBeforeUnload);
  //     //window.removeEventListener("unload", handleUnload);
  //   }
  // }, [gameType, gameStatus, handleSubmitGame]);

  const handleQuitGame = (isDone: boolean = false) => {
    if (gameType === GameTypes.TEST && gameStatus === GameStatus.PLAY && !isDone) {
      //submit 
      handleSubmitGame({ isPause: true });
    }
    dispatch(resetGameStateAfterQuitting());
    // TODO: implement in Context
    // dispatch(setShowStudyView(false));
  }

  return {
    handleQuitGame
  }
}

export default useQuitGame;
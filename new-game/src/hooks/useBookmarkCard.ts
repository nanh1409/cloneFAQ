import { useGameSelector } from ".";
import useGameContext from "./useGameContext";
import { ClientCardProgress, GameObject } from "../models/game.core";
import { useDispatch } from "../../../../app/hooks";
import { updateCardProgress } from "../redux/reducers/game.slice";

const useBookmarkCard = () => {
  const {
    onUpdateCardBookmarks
  } = useGameContext();
  const topicId = useGameSelector((state) => state.gameState.gameSetting?.topicId);
  const userId = useGameSelector((state) => state.gameState.gameSetting?.userId);
  const cardProgresses = useGameSelector((state) => state.gameState.cardProgresses);
  const dispatch = useDispatch();

  const onMark = (args: {
    gameObject: GameObject;
    bookmark: boolean;
  }) => {
    const { gameObject, bookmark } = args;
    const cardProgress = ClientCardProgress.getUserCardProgress({ topicId, cardId: gameObject.id, userId, cardProgresses });
    cardProgress.setBookmark(bookmark);
    gameObject.setBookmark(bookmark);
    dispatch(updateCardProgress(cardProgress));

    onUpdateCardBookmarks({ topicId, cardId: gameObject.id, bookmark });
  }
  return {
    onMark
  }
}

export default useBookmarkCard;
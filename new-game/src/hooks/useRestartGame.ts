import _ from "lodash";
import { useDispatch } from "react-redux";
import { useGameSelector } from ".";
import { OnRestartGameArgs, OnRestartGameFunction, OnSubmitGameFunction } from "../context/gameContextTypes";
import { onStartGame, resetCardProgresses, setLoadingGame, setOpenRestartGameDialog, setShowNext } from "../redux/reducers/game.slice";
import useGameContext from "./useGameContext";

const useRestartGame = (args?: {
  onRestartGame: OnRestartGameFunction;
}) => {
  const outsideCtxRestartGame = args?.onRestartGame;
  const { onRestartGame } = useGameContext();
  const topicId = useGameSelector((state) => state.gameState.gameSetting?.topicId);
  const cards = useGameSelector((state) => state.gameState.cards);
  const shuffleQuestion = useGameSelector((state) => state.gameState.gameSetting?.shuffleQuestion);
  const userId = useGameSelector((state) => state.gameState.gameSetting?.userId);

  const dispatch = useDispatch();
  const handleOpenRestartDialog = () => {
    dispatch(setOpenRestartGameDialog(true));
  }

  const handleCloseRestartDialog = () => {
    dispatch(setOpenRestartGameDialog(false));
  }

  const handleRestartGame = () => {
    dispatch(setLoadingGame(true));
    let _cards = cards;
    if (shuffleQuestion) {
      _cards = _.shuffle(_cards);
    }
    const restartGameArgs: OnRestartGameArgs = { cardOrder: _cards.map((e) => e._id) };
    if (typeof outsideCtxRestartGame !== "undefined") outsideCtxRestartGame(restartGameArgs);
    else onRestartGame(restartGameArgs);
    dispatch(resetCardProgresses({ topicId }));
    // const newTopicProgress = ClientTopicProgress.clone(topicProgresses[topic._id]);

    // newTopicProgress.setCardOrder(_cards.map((e) => e._id));
    // newTopicProgress.setProgress(0);
    // newTopicProgress.setQuestionStats({ totalQuestions: newTopicProgress.totalCardNum, totalCorrect: 0 });
    // newTopicProgress.setUserId(userId);

    // dispatch(updateTopicProgress(newTopicProgress));
    // if (sync) {
    //   dispatch(updateAppPracticeData({ progress: 0, totalCorrect: 0, totalQuestions: newTopicProgress.totalCardNum, studyScoreDataId, totalIncorrect: 0, cardOrder: newTopicProgress.cardOrder, totalCardStudy: studyScore?.totalCardStudy }));
    //   dispatch(resetCardStudyData({ studyScoreDataId }));
    // }
    setTimeout(() => {
      dispatch(onStartGame({
        cards: _cards,
        cardProgresses: {},
        userId,
        topicId
      }));
      dispatch(setShowNext(false));
    }, 500);
    dispatch(setOpenRestartGameDialog(false));
  }

  // TODO: re-implement
  // const handleRestartGameAgain = () => {
  //   dispatch(setLoadingGame(true));
  //   const newTopicProgress = ClientTopicProgress.clone(topicProgresses[topic._id]);
  //   let _cards = cards;
  //   newTopicProgress.setCardOrder(_cards.map((e) => e._id));
  //   newTopicProgress.setProgress(0);
  //   newTopicProgress.setQuestionStats({ totalQuestions: newTopicProgress.totalCardNum, totalCorrect: 0 });
  //   newTopicProgress.setUserId(userId);

  //   dispatch(updateTopicProgress(newTopicProgress));
  //   dispatch(resetCardProgresses({ topicId: topic._id }));
  //   dispatch(setGameDuration(topic.topicExercise?.duration * 60));
  //   if (!!user) {
  //     dispatch(createAppPracticeDataAgain({
  //       cardOrder: newTopicProgress.cardOrder, studyTime: newTopicProgress.studyTime,
  //       topicId: topic._id, userId, courseId: topic.courseId, parentId: topic.parentId,
  //       studyScoreId, totalQuestions: newTopicProgress.cardOrder?.length
  //     }));
  //   }
  //   setTimeout(() => {
  //     dispatch(onStartGame({
  //       cards: _cards,
  //       cardProgresses: {},
  //       userId,
  //       topicId: topic._id
  //     }));
  //     dispatch(setShowNext(false));
  //   }, 500);
  //   dispatch(setOpenRestartGameDialog(false));
  // }

  return {
    handleOpenRestartDialog,
    handleCloseRestartDialog,
    handleRestartGame,
    // handleRestartGameAgain,
  }
}

export default useRestartGame;
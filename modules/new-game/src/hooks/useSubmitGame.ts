import { useDispatch } from "react-redux";
import { useGameSelector } from ".";
import { BAREM_SCORE_IELTS_GENERAL, EXAM_SCORE_FINISH, EXAM_SCORE_PAUSE, EXAM_TYPE_IELTS, EXAM_TYPE_TOEIC, SKILL_TYPE_LISTENING, SKILL_TYPE_READING, SKILL_TYPE_SPEAKING, SKILL_TYPE_WRITING } from "../utils/constraints";
import { OnSubmitGameArgs, OnSubmitGameFunction } from "../context/gameContextTypes";
import { GameStatus, GameTypes } from "../models/game.core";
import { returnEndGameState, setCheckFinishGame, setOpenSubmitGameDialog, setPauseForSubmit, setTestView } from "../redux/reducers/game.slice";
import { getSkillTypeValues, getTOEICScore, IELTS4SkillsUtils, MapSkillStats } from "../utils/game.scoreUtils";
import useGameContext from "./useGameContext";

const useSubmitGame = (args?: { onSubmitGame: OnSubmitGameFunction }) => {
  const outsideContextSubmitGame = args?.onSubmitGame;
  const { onSubmitGame } = useGameContext();
  const gameType = useGameSelector((state) => state.gameState.gameType);
  const totalCorrect = useGameSelector((state) => state.gameState.totalCorrect);
  const totalIncorrect = useGameSelector((state) => state.gameState.totalIncorrect);
  const totalQuestions = useGameSelector((state) => state.gameState.totalQuestions);
  const questionItems = useGameSelector((state) => state.gameState.questionItems);
  const currentSkill = useGameSelector((state) => state.gameState.gameSetting?.currentSkill);
  const showResultOnAnswer = useGameSelector((state) => state.gameState.showResultOnAnswer);
  const mapExamTypeSkills = useGameSelector((state) => state.gameState.mapExamTypeSkills);
  const topicContentType = useGameSelector((state) => state.gameState.gameSetting?.contentType);
  const topicPassScore = useGameSelector((state) => state.gameState.gameSetting?.passScore);
  const topicBaremScore = useGameSelector((state) => state.gameState.gameSetting?.baremScore);

  const dispatch = useDispatch();

  const handleOpenSubmitDialog = () => {
    dispatch(setPauseForSubmit(true));
    dispatch(setOpenSubmitGameDialog(true));
  }

  const handleCloseSubmitDialog = () => {
    dispatch(setPauseForSubmit(false));
    dispatch(setOpenSubmitGameDialog(false));
  }

  const handleSubmitGame = (args?: { isPause: boolean; }) => {
    // const newTopicProgress = ClientTopicProgress.clone(topicProgresses[topic._id] || {} as ClientTopicProgress);
    let essayEnd = false;
    if (gameType === GameTypes.TEST) {
      let progress = 0;
      let score = 0;
      let mapStats: MapSkillStats = {};
      const correctRate = totalCorrect / (totalQuestions || 1);
      if (topicContentType === EXAM_TYPE_TOEIC) {
        if (!!currentSkill && [SKILL_TYPE_SPEAKING, SKILL_TYPE_WRITING].includes(currentSkill.type)) {
          essayEnd = true;
          progress = args?.isPause ? 0 : 100;
        } else {
          const skills = mapExamTypeSkills[EXAM_TYPE_TOEIC] ?? [];
          const skillTypeValues = getSkillTypeValues(skills);
          const { score: _score, mapStats: _mapStats } = getTOEICScore({
            skillTypeValues, questionItems
          });
          score = _score;
          mapStats = _mapStats;
        }
      } else if (topicContentType === EXAM_TYPE_IELTS && !!currentSkill) {
        if ([SKILL_TYPE_LISTENING, SKILL_TYPE_READING].includes(currentSkill.type)) {
          if (currentSkill.type === SKILL_TYPE_LISTENING) {
            score = IELTS4SkillsUtils.getListeningScore({
              totalCorrect, totalQuestions, bandScore: topicBaremScore === BAREM_SCORE_IELTS_GENERAL ? "general" : "academic"
            });
          } else {
            score = IELTS4SkillsUtils.getReadingScore({
              totalCorrect, totalQuestions, bandScore: topicBaremScore === BAREM_SCORE_IELTS_GENERAL ? "general" : "academic"
            });
          }
        } else {
          essayEnd = true;
          progress = args?.isPause ? 0 : 100;
        }
      } else {
        const correctRate = totalCorrect / (totalQuestions || 1);
        score = correctRate * 10;
      }
      if (!args?.isPause) {
        progress = score >= topicPassScore ? 100 : Math.round((correctRate + Number.EPSILON) * 100);
      }

      const submitGameArgs: OnSubmitGameArgs = {
        progress, score, totalQuestions, totalCorrect, totalIncorrect,
        status: args?.isPause ? EXAM_SCORE_PAUSE : EXAM_SCORE_FINISH,
        mapStats
      };
      if (typeof outsideContextSubmitGame !== "undefined") outsideContextSubmitGame(submitGameArgs);
      else onSubmitGame(submitGameArgs);
      // newTopicProgress.setUserId(userId)
      // dispatch(updateTopicProgress(newTopicProgress));
      if (args?.isPause) dispatch(setTestView(GameStatus.CONTINUE));
      else {
        dispatch(returnEndGameState({ returnFirstGame: false, essayEnd }));
        dispatch(setTestView(GameStatus.REVIEW));
        dispatch(setCheckFinishGame(true));
      }

      // console.log({
      //   status: gameState?.isPause ? EXAM_SCORE_PAUSE : EXAM_SCORE_FINISH,
      //   totalCorrect,
      //   totalIncorrect,
      //   totalQuestions,
      //   tGameStatusnewTopicProgress.totalTime
      // })
      // if (!!user) {
      //   dispatch(updateAppPracticeData({
      //     progress,
      //     score,
      //     status: gameState?.isPause ? EXAM_SCORE_PAUSE : EXAM_SCORE_FINISH,
      //     studyScoreDataId,
      //     studyScoreId,
      //     totalCorrect,
      //     totalIncorrect,
      //     totalQuestions,
      //     totalTime: newTopicProgress.totalTime
      //   }));
      // }
    } else if (!showResultOnAnswer) {
      const correctRate = totalCorrect / (totalQuestions || 1);
      const _progress = Math.round((correctRate + Number.EPSILON) * 100);
      const progress = _progress > 100 ? 100 : _progress;
      const submitGameArgs: OnSubmitGameArgs = {
        progress, score: correctRate * 10, totalQuestions, totalCorrect, totalIncorrect,
        status: args?.isPause ? EXAM_SCORE_PAUSE : EXAM_SCORE_FINISH,
        mapStats: {}
      };
      if (typeof outsideContextSubmitGame !== "undefined") outsideContextSubmitGame(submitGameArgs);
      else onSubmitGame(submitGameArgs);
      dispatch(returnEndGameState({ returnFirstGame: false, essayEnd }));
      dispatch(setCheckFinishGame(true));
    }
  }
  const handleSubmitGameOnBackground = (gameState?: { isPause: boolean }) => {
    // const newTopicProgress = ClientTopicProgress.clone(topicProgresses[topic._id] || {} as ClientTopicProgress);
    if (gameType === GameTypes.TEST) {
      let progress = 0;
      let score = 0;
      const submitGameArgs: OnSubmitGameArgs = {
        progress, score, totalQuestions, totalCorrect, totalIncorrect,
        status: gameState?.isPause ? EXAM_SCORE_PAUSE : EXAM_SCORE_FINISH
      }
      if (topicContentType === EXAM_TYPE_TOEIC) {
        const skills = mapExamTypeSkills[EXAM_TYPE_TOEIC] ?? [];
        const skillTypeValues = getSkillTypeValues(skills);
        const { score: _score } = getTOEICScore({ skillTypeValues, questionItems });
        score = _score;
        const correctRate = totalCorrect / (totalQuestions || 1);
        progress = Math.round((correctRate + Number.EPSILON) * 100);
        submitGameArgs.progress = progress;
        submitGameArgs.score = score;
        // onSubmitGame({
        //   progress, score, totalQuestions, totalCorrect, totalIncorrect,
        //   status: gameState?.isPause ? EXAM_SCORE_PAUSE : EXAM_SCORE_FINISH
        // })
        // const passScore = topic.topicExercise?.pass ?? 0;
        // progress = score >= passScore ? 100 : Math.round((correctRate + Number.EPSILON) * 100);
        // newTopicProgress.setStudyData({
        //   progress, score, totalCardNum: totalQuestions, correctNum: totalCorrect, incorrectNum: totalIncorrect, status: EXAM_SCORE_FINISH,
        //   totalTime: newTopicProgress.totalTime
        // });
      } else {
        const correctRate = totalCorrect / (totalQuestions || 1);
        score = correctRate * 10;
        progress = Math.round((correctRate + Number.EPSILON) * 100);
        // const passScore = topic.topicExercise?.pass ?? 0;
        // progress = score >= passScore ? 100 : Math.round((correctRate + Number.EPSILON) * 100);
        submitGameArgs.progress = progress;
        submitGameArgs.score = score;
        // newTopicProgress.setStudyData({
        //   progress, score, totalCardNum: totalQuestions, correctNum: totalCorrect, incorrectNum: totalIncorrect, status: EXAM_SCORE_FINISH,
        //   totalTime: newTopicProgress.totalTime
        // });
      }
      if (typeof outsideContextSubmitGame !== "undefined") outsideContextSubmitGame(submitGameArgs);
      else onSubmitGame(submitGameArgs);
      // newTopicProgress.setUserId(userId)
      // if (!!user) {
      //   apiUpdateStudyData({
      //     progress,
      //     score,
      //     status: gameState?.isPause ? EXAM_SCORE_PAUSE : EXAM_SCORE_FINISH,
      //     studyScoreDataId,
      //     studyScoreId,
      //     totalCorrect,
      //     totalIncorrect,
      //     totalQuestions,
      //     totalTime: newTopicProgress.totalTime
      //   });
      // }
    }
  }
  const handlePauseGame = () => {
    handleSubmitGame({ isPause: true });
    // dispatch(setTestView(GameStatus.CONTINUE));
  }
  return {
    handleOpenSubmitDialog,
    handleCloseSubmitDialog,
    handleSubmitGame,
    handleSubmitGameOnBackground,
    handlePauseGame,
  }
}

export default useSubmitGame;
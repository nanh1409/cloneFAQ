import _ from "lodash";
import { useDispatch, useSelector } from "../../../app/hooks";
import { QuizClientCardProgress } from "../../../modules/new-game/src/components/quiz/QuizGameObject";
import { SpellingClientCardProgress } from "../../../modules/new-game/src/components/spelling/SpellingGameObject";
import { OnRestartGameArgs, OnStartTestGameArgs, OnSubmitGameArgs, OnUpdateCardBookmarksArgs, OnUpdateGameProgessArgs } from "../../../modules/new-game/src/context/gameContextTypes";
import { ClientCardProgress, MapCardProgress } from "../../../modules/new-game/src/models/game.core";
import {
  EXAM_SCORE_FINISH,
  EXAM_SCORE_PAUSE,
  EXAM_SCORE_PLAY,
  GAME_TYPE_TEST,
  STUDY_SCORE_DETAIL_CORRECT,
  STUDY_SCORE_DETAIL_IN_CORRECT,
  STUDY_SCORE_DETAIL_NO_STUDY,
  STUDY_SCORE_DETAIL_SKIP
} from "../../../modules/share/constraint";
import { CardGames } from "../../../modules/share/model/card";
import { StudyScoreDataStatistics } from "../../../modules/share/model/studyScoreData";
import StudyScoreDetail from "../../../modules/share/model/studyScoreDetail";
import { apiGetExamScoreDetails } from "../topic.api";
import { ClientTopicProgress, UpdateAppPracticeDataArgs } from "../topic.model";
import { createAppPracticeData, MapTopicProgress, resetCardStudyData, setMapCurrentProgress, StudyScoreDetailSync, updateAppPracticeData, updateListStudyScoreDetail, updateSkillStudyScoreData, updateStudyScoreDetail, updateStudyScoreDetailBookmarks, updateTopicProgress } from "../topic.slice";
import { handleCollectPracticeHistory, handleCollectTestHistory } from "./useTopicHistory";
import { LocalGameTimeUtils } from "../topic.utils";

const useSyncStudyData = () => {
  const fetchedTopicProgresses = useSelector((state) => state.topicState.fetchedTopicProgresses);
  const topic = useSelector((state) => state.topicState.currentTopic);
  const studyScoreDataId = useSelector((state) => state.topicState.studyScoreDataId);
  const currentTopic = useSelector((state) => state.topicState.currentTopic);
  const isSkillBasedExam = useSelector((state) => state.topicState.isSkillBasedExam);
  const currentSkillConfig = useSelector((state) => state.topicState.currentSkillConfig);
  const mapSkillStudyScoreData = useSelector((state) => state.topicState.mapSkillStudyScoreData);
  const totalSkills = useSelector((state) => state.topicState.totalSkills);
  const topicProgresses = useSelector((state) => state.topicState.topicProgresses);
  const mapCurrentProgress = useSelector((state) => state.topicState.mapCurrentProgress);
  const studyScoreId = useSelector((state) => state.topicState.studyScoreId);
  const userId = useSelector((state) => state.authState.userId);
  const user = useSelector((state) => state.authState.user);
  const dispatch = useDispatch();
  const analyticsAccount = user?.account ?? `guest-${userId}`;

  const handleOnAnswer = (args: ClientCardProgress, flashCardGame = false) => {
    if (fetchedTopicProgresses && !!studyScoreDataId) {
      const studyScoreDetail = StudyScoreDetailSync.fromClientCardProgress(args, flashCardGame);
      studyScoreDetail.topic = args.topicId || currentTopic?._id;
      studyScoreDetail.courseId = currentTopic?.courseId;
      studyScoreDetail.studyScoreDataId = studyScoreDataId;
      studyScoreDetail.lastUpdate = Date.now();
      dispatch(updateStudyScoreDetail(studyScoreDetail));
    }
  }

  const handleSubmitListAnswer = (args: Array<ClientCardProgress>) => {
    if (fetchedTopicProgresses && !!studyScoreDataId) {
      const studyScoreDetails = args.map((e) => {
        const studyScoreDetail = StudyScoreDetailSync.fromClientCardProgress(e);
        studyScoreDetail.topic = e.topicId || currentTopic?._id;
        studyScoreDetail.courseId = currentTopic?.courseId;
        studyScoreDetail.studyScoreDataId = studyScoreDataId;
        studyScoreDetail.lastUpdate = Date.now();
        return studyScoreDetail
      });
      dispatch(updateListStudyScoreDetail(studyScoreDetails));
    }
  }

  const handleUpdateGameProgress = (args: OnUpdateGameProgessArgs) => {
    const {
      totalQuestions,
      totalCorrect,
      totalIncorrect,
      boxCard
    } = args;
    const progressId = `${currentTopic._id}${isSkillBasedExam && currentSkillConfig ? `_${currentSkillConfig._id}` : ""}`;
    const topicProgress = ClientTopicProgress.clone(topicProgresses[progressId]);
    const _progress = Math.round(((totalCorrect / (totalQuestions || 1)) + Number.EPSILON) * 100);
    const progress = _progress > 100 ? 100 : _progress;
    topicProgress.setUserId(userId);
    topicProgress.setStudyData({
      progress,
      totalCardNum: totalQuestions,
      correctNum: totalCorrect,
      incorrectNum: totalIncorrect,
      boxCard
    });
    dispatch(setMapCurrentProgress({
      ...mapCurrentProgress,
      [currentTopic._id]: {
        ...mapCurrentProgress[currentTopic._id],
        currentProgress: topicProgress
      }
    }));
    dispatch(updateTopicProgress(topicProgress));
    if (!!user) {
      dispatch(updateAppPracticeData({ progress, totalCorrect, totalQuestions, studyScoreId, studyScoreDataId, totalIncorrect }))
    }
  }

  const handleClickPlayTest = (args: OnStartTestGameArgs & { simulationMode?: boolean; }) => {
    if (isSkillBasedExam && !currentSkillConfig) return;
    const { continueMode, replay, totalQuestions } = args;
    const progressId = `${currentTopic._id}${currentSkillConfig ? `_${currentSkillConfig._id}` : ""}`;
    const _savedTopicProgress = topicProgresses[progressId];
    let topicProgress = _savedTopicProgress?.userId === userId ? ClientTopicProgress.clone(_savedTopicProgress) : undefined;
    if (!topicProgress) topicProgress = new ClientTopicProgress({ topicId: currentTopic._id, userId, skillId: currentSkillConfig?._id });
    topicProgress.setStatus(EXAM_SCORE_PLAY);
    if (!continueMode) {
      topicProgress.increaseStudyTime();
      topicProgress.setTotalTime(0);
    }
    if (replay) {
      topicProgress.setStudyData({ correctNum: 0, incorrectNum: 0, score: 0, progress: 0, totalTime: 0 });
    }
    topicProgress.setUserId(userId);
    topicProgress.simulationMode = args.simulationMode
    dispatch(updateTopicProgress(topicProgress));
    if (isSkillBasedExam) return;
    if (!!user) {
      if (replay) {
        const updateAppPracticeDataArgs: UpdateAppPracticeDataArgs = {
          studyScoreDataId,
          studyScoreId,
          status: EXAM_SCORE_PLAY,
          progress: 0, totalCorrect: 0, totalIncorrect: 0,
          totalQuestions: (totalQuestions ?? topicProgress?.totalCardNum ?? 0),
          studyTime: topicProgress.studyTime,
          totalTime: 0,
          score: 0
        }
        dispatch(updateAppPracticeData(updateAppPracticeDataArgs));
        dispatch(resetCardStudyData({ studyScoreDataId }));
      } else if (!continueMode) {
        // New Game
        dispatch(createAppPracticeData({
          topicId: currentTopic._id,
          userId,
          courseId: currentTopic.courseId,
          parentId: currentTopic.parentId,
          gameType: GAME_TYPE_TEST
        }));
      }
    }
    handleCollectTestHistory({
      type: "start", data: args, topic, account: analyticsAccount
    });
  }

  const handleOnUpdateCardBookmarks = (args: OnUpdateCardBookmarksArgs & { updateCardData?: boolean }) => {
    dispatch(updateStudyScoreDetailBookmarks({ ...args, userId, studyScoreDataId }))
  }

  const onRestartGame = (args: OnRestartGameArgs) => {
    const { cardOrder } = args;
    const newTopicProgress = ClientTopicProgress.clone(topicProgresses[currentTopic._id]);
    newTopicProgress.setCardOrder(cardOrder);
    newTopicProgress.setProgress(0);
    newTopicProgress.setQuestionStats({ totalQuestions: newTopicProgress.totalCardNum, totalCorrect: 0 });
    newTopicProgress.setUserId(userId);
    dispatch(updateTopicProgress(newTopicProgress));
    if (!!user) {
      dispatch(updateAppPracticeData({ progress: 0, totalCorrect: 0, totalQuestions: newTopicProgress.totalCardNum, studyScoreDataId, totalIncorrect: 0, cardOrder: newTopicProgress.cardOrder }));
      dispatch(resetCardStudyData({ studyScoreDataId }));
    }
    handleCollectPracticeHistory({
      type: "restart", topic: currentTopic, account: analyticsAccount
    });
  }

  const onSubmitGame = (args: OnSubmitGameArgs) => {
    const {
      progress: _progress,
      score,
      totalCorrect,
      totalIncorrect,
      totalQuestions,
      status = EXAM_SCORE_FINISH,
      mapStats = {}
    } = args;
    const progressId = `${currentTopic._id}${currentSkillConfig ? `_${currentSkillConfig._id}` : ""}`
    const newTopicProgress = ClientTopicProgress.clone(topicProgresses[progressId] || {} as ClientTopicProgress);
    const passScore = currentTopic?.topicExercise?.pass ?? 0;
    let progress = _progress;
    if (status === EXAM_SCORE_FINISH) {
      progress = score >= passScore ? 100 : _progress;
    }
    const totalTime = LocalGameTimeUtils.get({topicId: currentTopic._id, skillId: currentSkillConfig?._id, userId}) || 0
    newTopicProgress.setStudyData({ progress, score, totalCardNum: totalQuestions, correctNum: totalCorrect, incorrectNum: totalIncorrect, status, totalTime });
    newTopicProgress.setUserId(userId);
    newTopicProgress.lastUpdate = Date.now();
    dispatch(updateTopicProgress(newTopicProgress));
    let rootProgress = progress;
    if (isSkillBasedExam) {
      const clientSkillProgresses = Object.keys(topicProgresses).reduce((map, key) => {
        const [_topicId, _skillId] = key.split("_");
        if (!!_skillId) map[key] = topicProgresses[key];
        return map;
      }, {} as MapTopicProgress);
      const completedGame = !!user
        ? Object.values(mapSkillStudyScoreData).filter((ssd) => ssd.status === EXAM_SCORE_FINISH).length
        : Object.values(clientSkillProgresses).filter((tp) => !!tp && tp.status === EXAM_SCORE_FINISH).length;
      rootProgress = Math.round(((completedGame + status === EXAM_SCORE_FINISH ? 1 : 0) * 100 / totalSkills || 1));
      rootProgress = rootProgress >= 100 ? 100 : rootProgress;
      const rootTopicProgress = ClientTopicProgress.clone(topicProgresses[currentTopic._id] || new ClientTopicProgress({
        topicId: currentTopic._id, userId, progress: rootProgress, status: rootProgress === 100 ? EXAM_SCORE_FINISH : EXAM_SCORE_PLAY
      }));
      rootTopicProgress.setStudyData({ progress: rootProgress, status: rootProgress === 100 ? EXAM_SCORE_FINISH : EXAM_SCORE_PLAY });
      rootTopicProgress.setUserId(userId);
      dispatch(updateTopicProgress(rootTopicProgress));
    }
    if (!!user) {
      const mapSkillTypeScore: StudyScoreDataStatistics["mapSkillTypeScore"] = {};
      const mapSkillTypeCard: StudyScoreDataStatistics["mapSkillTypeCard"] = {};
      const mapSkillValueCard: StudyScoreDataStatistics["mapSkillValueCard"] = {};
      Object.entries(mapStats).forEach(([strSkillType, { score, correct, count, skillValueStat }]) => {
        mapSkillTypeScore[+strSkillType] = score;
        mapSkillTypeCard[+strSkillType] = { correctNum: correct, totalCardNum: count };
        Object.entries(skillValueStat).forEach(([strSkillValue, { correct, count }]) => {
          mapSkillValueCard[+strSkillValue] = { correctNum: correct, totalCardNum: count };
        })
      });
      dispatch(updateAppPracticeData({
        progress,
        score,
        status,
        studyScoreDataId,
        studyScoreId,
        totalCorrect,
        totalIncorrect,
        totalQuestions,
        totalTime,
        isSkillBasedExam,
        isFinalGame: rootProgress === 100,
        rootProgress,
        statistics: { mapSkillTypeScore, mapSkillTypeCard, mapSkillValueCard }
      }));
      if (isSkillBasedExam && currentSkillConfig) {
        dispatch(updateSkillStudyScoreData({
          skillId: currentSkillConfig._id,
          studyScoreData: {
            ...mapSkillStudyScoreData[currentSkillConfig._id],
            status,
            totalCardNum: newTopicProgress.totalCardNum,
            totalTime,
            correctNum: newTopicProgress.correctNum,
            incorrectNum: newTopicProgress.incorrectNum,
            score: newTopicProgress.score
          }
        }))
      }
    }

    handleCollectTestHistory({
      type: "submit", data: args, topic, account: analyticsAccount, totalTime
    });
  }

  return {
    handleOnAnswer,
    handleSubmitListAnswer,
    handleUpdateGameProgress,
    handleClickPlayTest,
    handleOnUpdateCardBookmarks,
    onRestartGame,
    onSubmitGame
  }
}


export const fetchMapCardProgress = async (args: {
  topicId?: string;
  studyScoreDataId: string;
  userId: string;
  flashCardGame?: boolean;
  useSkipStatus?: boolean;
}) => {
  const { topicId, studyScoreDataId, userId, flashCardGame, useSkipStatus } = args;
  const studyScoreDetails = await apiGetExamScoreDetails({ studyScoreDataId, userId });
  const arrCardProgresses = studyScoreDetails
    .map((e) => {
      if (e.correct === STUDY_SCORE_DETAIL_NO_STUDY
        && !e.answerOptional?.file?.length
        && !e.answerOptional?.content
        && !e.answerOptional?.totalTime
      ) return null;
      if (!useSkipStatus && e.correct === STUDY_SCORE_DETAIL_SKIP) return null;
      const clientCardProgress = new ClientCardProgress({
        cardId: e.cardId,
        correct: e.correct !== STUDY_SCORE_DETAIL_NO_STUDY
          ? (e.correct === STUDY_SCORE_DETAIL_SKIP
            ? null
            : e.correct === STUDY_SCORE_DETAIL_CORRECT
          ) : null,
        topicId: e.topicId || topicId, userId: e.userId,
        history: e.cardHistory.map((e) => e === STUDY_SCORE_DETAIL_CORRECT),
        lastUpdate: e.lastUpdate,
        answerOptional: e.answerOptional,
        bookmark: !!e.bookmark,
        skip: e.correct === STUDY_SCORE_DETAIL_SKIP
      });

      if (!flashCardGame) {
        if (
          e.gameType === CardGames.quiz
          || e.answers.length
        ) {
          // QUIZ
          const selectedChoices = e.answers.map(({ answer: choiceId }) => choiceId);
          (clientCardProgress as QuizClientCardProgress).selectedChoices = selectedChoices.filter((choiceId, index) => selectedChoices.indexOf(choiceId) === index);
          (clientCardProgress as QuizClientCardProgress).correctNum = e.answers.filter(({ correct }) => correct === STUDY_SCORE_DETAIL_CORRECT).length;
        } else if (
          e.gameType === CardGames.spelling
          || e.answerText
        ) {
          (clientCardProgress as SpellingClientCardProgress).answer = e.answerText;
        }
      }
      return clientCardProgress;
    })
    .filter((e) => !!e);

  const mapCardProgress: MapCardProgress = arrCardProgresses.reduce((map, cardProgress) => {
    map[cardProgress.id] = cardProgress;
    return map;
  }, {} as MapCardProgress);

  return mapCardProgress;
}

export default useSyncStudyData;
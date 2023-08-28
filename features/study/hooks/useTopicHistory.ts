import _ from "lodash";
import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "../../../app/hooks";
import { OnStartTestGameArgs, OnSubmitGameArgs } from "../../../modules/new-game/src/context/gameContextTypes";
import { GAME_TYPE_FLASH_CARD, GAME_TYPE_PRACTICE, GAME_TYPE_TEST, TOPIC_CONTENT_TYPE_FLASH_CARD, TOPIC_TYPE_EXERCISE } from "../../../modules/share/constraint";
import Topic from "../../../modules/share/model/topic";
import TopicHistory, { LearningEvent } from "../../../modules/share/model/topicHistory";
import { apiCollectTopicHistory } from "../../topic-history/topicHistory.api";
import { cleanHistoryState, fetchLatestTopicHistory } from "../../topic-history/topicHistory.slice";

export const getAnalyticsAccount = () => {
  const { user, userId } = useSelector((state) => state.authState);
  return useMemo(() => user?.account || `guest-${userId}`, [user?._id, userId])
}

export const handleCollectTestHistory = (args: {
  type: "start" | "submit",
  data: OnStartTestGameArgs | OnSubmitGameArgs,
  topic: Topic;
  account: string;
  totalTime?: number;
}) => {
  const { type, data, topic, account, totalTime } = args;
  if (type !== "start" && type !== "submit") return;
  const history = new TopicHistory({
    courseId: topic.courseId,
    topicId: topic._id,
    account,
    gameType: GAME_TYPE_TEST,
  });
  if (type === "start") {
    const { replay } = data as OnStartTestGameArgs;
    history.event = replay ? LearningEvent.replay : LearningEvent.start_learning;
  } else if (type === "submit") {
    const { progress, score, totalCorrect, totalIncorrect } = data as OnSubmitGameArgs;
    history.event = LearningEvent.finish_learning;
    history.progress = progress;
    history.score = score;
    history.correct = totalCorrect;
    history.total = totalCorrect + totalIncorrect;
    history.totalTime = totalTime;
  }
  return apiCollectTopicHistory(history);
}

export const handleCollectPracticeHistory = (args: {
  type: "start" | "restart" | "done",
  topic: Topic;
  account: string;
  data?: { totalCorrect?: number; totalIncorrect?: number; totalQuestions?: number; boxCard?: { [cardId: string]: number; } };
}) => {
  const { type, topic, account, data = {} } = args;
  if (type !== "start" && type !== "restart" && type !== "done") return;
  const { totalCorrect, totalIncorrect, totalQuestions, boxCard } = data;
  const isFlashCard = topic.topicExercise?.contentType === TOPIC_CONTENT_TYPE_FLASH_CARD;
  const history = new TopicHistory({
    courseId: topic.courseId,
    topicId: topic._id,
    account,
    gameType: isFlashCard ? GAME_TYPE_FLASH_CARD : GAME_TYPE_PRACTICE,
    correct: totalCorrect,
    boxCard
  });
  if (type === "start") {
    history.event = LearningEvent.start_learning;
  } else if (type === "restart") {
    history.event = LearningEvent.replay;
  } else if (type === "done") {
    history.event = LearningEvent.finish_learning;
  }
  if (typeof totalCorrect !== "undefined" && typeof totalCorrect !== "undefined") {
    if (typeof totalQuestions !== "undefined" && totalQuestions > 0) {
      const progress = Math.round(((totalCorrect / totalQuestions) + Number.EPSILON) * 100);
      history.progress = progress;
    }
    history.total = totalCorrect + totalIncorrect;
  }
  return apiCollectTopicHistory(history);
}

const useTopicHistory = () => {
  const {
    loading: authLoading, user, userId
  } = useSelector((state) => state.authState);
  const userAnalytics = user?.account ?? `guest-${userId}`;
  const {
    currentTopic: topic,
    fetchedTopicProgresses,
    topicProgresses
  } = useSelector((state) => state.topicState);
  const {
    loading: historyLoading,
    lastestHistory
  } = useSelector((state) => state.topicHistoryState);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!authLoading && !!topic) {
      if (topic.type === TOPIC_TYPE_EXERCISE) {
        dispatch(fetchLatestTopicHistory({
          topicId: topic._id,
          account: user?.account ?? `guest-${userId}`
        }))
      }
    }
    return () => {
      dispatch(cleanHistoryState());
    }
  }, [authLoading, topic?._id]);

  useEffect(() => {
    if (fetchedTopicProgresses && !historyLoading) {
      if (!!topic) {
        if (topic.type === TOPIC_TYPE_EXERCISE) {
          if (!lastestHistory) {
            handleCollectPracticeHistory({
              type: "start",
              topic,
              account: userAnalytics
            });
          } else {
            let startLearning = false;
            const topicProgress = topicProgresses[topic._id];
            if (topicProgress && topicProgress.userId === userId) {
              if (lastestHistory) {
                const isFlashCard = topic.topicExercise?.contentType === TOPIC_CONTENT_TYPE_FLASH_CARD;
                const historyBoxCard = lastestHistory.boxCard || {};
                const progressBoxCard = topicProgress.boxCard || {};
                const isSameBoxCard = Object.keys(historyBoxCard).every((cardId) => {
                  return _.has(progressBoxCard, cardId) && progressBoxCard[cardId] === historyBoxCard[cardId];
                })
                if ((lastestHistory.progress || 0) !== (topicProgress.progress || 0)
                  || (lastestHistory.total || 0) !== ((topicProgress.correctNum || 0) + (topicProgress.incorrectNum || 0))
                  || (isFlashCard && !isSameBoxCard)
                ) {
                  startLearning = true;
                }
              }
            }
            if (startLearning) {
              handleCollectPracticeHistory({
                type: "start",
                topic,
                account: userAnalytics,
                data: {
                  totalCorrect: topicProgress.correctNum,
                  totalIncorrect: topicProgress.incorrectNum,
                  totalQuestions: topicProgress.totalCardNum,
                  boxCard: topicProgress.boxCard
                }
              });
            }
          }
        }
      }
    }
  }, [fetchedTopicProgresses, historyLoading]);
}

export default useTopicHistory;
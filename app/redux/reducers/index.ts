import { combineReducers } from "redux";
import appInfoSlice, { AppInfoState } from "../../../features/appInfo/appInfo.slice";
import authSlice, { AuthState } from "../../../features/auth/auth.slice";
import layoutSlice, { LayoutState } from "../../../features/common/layout.slice";
import customTestReducer, { CustomTestState } from "../../../features/custom-test/customTest.slice";
import learningStatSlice, { LearningStatState } from "../../../features/learning-stat/learningStat.slice";
import paymentSlice, { PaymentState } from "../../../features/get-pro/payment.slice";
import studyPlanSlice, { StudyPlanState } from "../../../features/study-plan/studyPlan.slice";
import feedbackSlice, { FeedbackState } from "../../../features/feedbacks/feedback.slice";
import _gameSlice, { GameState } from "../../../modules/new-game/src/redux/reducers/game.slice";
import studyLayoutSlice, { StudyLayoutState } from "../../../features/study/studyLayout.slice";
import topicSlice, { TopicState } from "../../../features/study/topic.slice";
import wordpressSlice, { WordPressState } from "../../../features/wordpress/wordpress.slice";
import stateReducer, { StateReducer } from "./states.slice";
import { persistReducer } from "redux-persist";
import { gameLocalStore } from "../../../features/study/topic.utils";
import { reduxPersistTimeout } from "../config";
import topicHistorySlice, { TopicHistoryState } from "../../../features/topic-history/topicHistory.slice";
import commentSlice, { CommentState } from "../../../features/comment/comment.slice";

const gameSlice = typeof window === "undefined"
  ? _gameSlice
  : persistReducer({
    key: "game-v2",
    timeout: reduxPersistTimeout,
    storage: gameLocalStore,
    whitelist: ["cardProgresses"]
  }, _gameSlice);

export type AppState = {
  appInfos: AppInfoState,
  topicState: TopicState,
  state: StateReducer,
  authState: AuthState,
  customTestState: CustomTestState;
  gameState: GameState,
  studyLayoutState: StudyLayoutState;
  wordPressState: WordPressState;
  layoutState: LayoutState;
  feedbackState: FeedbackState;
  studyPlanState: StudyPlanState;
  learningStatState: LearningStatState;
  paymentState: PaymentState;
  topicHistoryState: TopicHistoryState;
  commentState: CommentState;
}

export const rootReducers = combineReducers<AppState>({
  appInfos: appInfoSlice,
  topicState: topicSlice,
  state: stateReducer,
  authState: authSlice,
  customTestState: customTestReducer,
  gameState: gameSlice,
  studyLayoutState: studyLayoutSlice,
  wordPressState: wordpressSlice,
  layoutState: layoutSlice,
  feedbackState: feedbackSlice,
  studyPlanState: studyPlanSlice,
  learningStatState: learningStatSlice,
  paymentState: paymentSlice,
  topicHistoryState: topicHistorySlice,
  commentState: commentSlice,
});
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
// import storage from "redux-persist/lib/storage";
import createWebStorage from "redux-persist/lib/storage/createWebStorage";
import { StudyScoreDataStatistics } from "../../modules/share/model/studyScoreData";
import Topic from "../../modules/share/model/topic";
import TopicProgress from "../../modules/share/model/topicProgress";
import { apiGetTopicProgresses, apiGetTopicsByParentSlug } from "../study/topic.api";
import { GetTopicsByParentSlugArgs } from "../study/topic.model";

type StatItem = {
  tagIndex: number;
  itemIndex: number;
}

type MapStatTopic = {
  [key: string]: StatTopic;
}

type MapExpandTopic = {
  [parentId: string]: Array<StatTopic>;
}

type StatTopic = {
  parentTopic: Topic;
  childrenTopics?: Array<Topic>;
}

export type LearningStatState = {
  currentStat: StatItem;
  mapStatTopic: MapStatTopic;
  mapTopicProgress: {
    [topicId: string]: TopicProgress & {
      totalCardNum?: number;
      correctNum?: number;
      incorrectNum?: number;
      totalTime?: number;
      statistics?: StudyScoreDataStatistics;
    };
  };
  statTopics: Array<StatTopic>;
  mapExpandTopic: MapExpandTopic;
}

const initialState: LearningStatState = {
  currentStat: { tagIndex: 0, itemIndex: 0 },
  mapStatTopic: {},
  mapTopicProgress: {},
  statTopics: [],
  mapExpandTopic: {}
}

export const fetchTopicsByParentSlugStat = createAsyncThunk("learningStat/fetchTopics", async (args: GetTopicsByParentSlugArgs & { disableStore?: boolean; parentStatId?: string; }) => {
  const { disableStore, parentStatId, ...payload } = args;
  const data = await apiGetTopicsByParentSlug(payload);
  return data;
});

export const fetchTopicProgressesStat = createAsyncThunk("learningStat/fetchTopicProgresses", async (args: { topicIds: string[]; userId: string; }) => {
  const data = await apiGetTopicProgresses({ ...args, includeStatData: true });
  return data;
});

const learningStatSlice = createSlice({
  name: "learningStat",
  initialState,
  reducers: {
    setCurrentStat: (state, action: PayloadAction<StatItem>) => {
      state.currentStat = action.payload;
    },
    setStatTopics: (state, action: PayloadAction<Array<StatTopic>>) => {
      state.statTopics = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchTopicsByParentSlugStat.pending, (state) => {
      if (state.statTopics.length) state.statTopics = [];
    })
    builder.addCase(fetchTopicsByParentSlugStat.fulfilled, (state, action) => {
      const { courseId, slug, disableStore, parentStatId } = action.meta.arg;
      if (!Array.isArray(slug)) {
        const data = action.payload.at(0);
        if (data) {
          const { children = [], ...topic } = data;
          state.mapStatTopic[`${courseId}_${slug}`] = {
            parentTopic: topic as Topic,
            childrenTopics: children
          }
        }
      }
      if (!disableStore) {
        const statTopics: Array<StatTopic> = [];
        action.payload.forEach(({ children, ...topic }) => {
          statTopics.push({
            parentTopic: topic as Topic,
            childrenTopics: children
          })
        });
        state.statTopics = statTopics;
        if (parentStatId) state.mapExpandTopic[parentStatId] = statTopics;
      }
    });
    builder.addCase(fetchTopicProgressesStat.fulfilled, (state, action) => {
      const topicIds = action.meta.arg.topicIds;
      const userId = action.meta.arg.userId;
      topicIds.forEach((topicId) => {
        const progress = action.payload.find((tp) => tp.topicId === topicId);
        state.mapTopicProgress[topicId] = progress || new TopicProgress({ topicId, userId })
      });
    });
  }
});

export const {
  setCurrentStat,
  setStatTopics
} = learningStatSlice.actions;

const createNoopStorage = () => ({
  getItem: (_key: any) => Promise.resolve(null),
  setItem: (_key: any, value: any) => Promise.resolve(value),
  removeItem: (_key: any) => Promise.resolve()
});

const storage = typeof window !== "undefined" ? createWebStorage("local") : createNoopStorage();

const learningStatReducer = typeof window === "undefined"
  ? learningStatSlice.reducer
  : persistReducer({
    key: "learning-stat",
    storage,
    whitelist: ["currentStat"]
  }, learningStatSlice.reducer)

export default learningStatReducer;

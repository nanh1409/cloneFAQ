import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import TopicHistory from "../../modules/share/model/topicHistory";
import { apiCollectTopicHistory, apiGetLastTopicHistory } from "./topicHistory.api";

export type TopicHistoryState = {
  loading: boolean;
  lastestHistory: TopicHistory | null;
}

const sliceName = "topicHistory";

export const requestCollectTopicHistory = createAsyncThunk(`${sliceName}/collect`, (args: TopicHistory) => {
  return apiCollectTopicHistory(args);
});

export const fetchLatestTopicHistory = createAsyncThunk(`${sliceName}/fetchLastestHistory`, async (args: { topicId: string; account: string; }) => {
  const data = await apiGetLastTopicHistory(args);
  return data;
});

const topicHistorySlice = createSlice({
  name: sliceName,
  initialState: {
    loading: true,
    lastestHistory: null
  } as TopicHistoryState,
  reducers: {
    cleanHistoryState: (state) => {
      state.lastestHistory = null;
      state.loading = true;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLatestTopicHistory.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchLatestTopicHistory.fulfilled, (state, action) => {
        state.lastestHistory = action.payload;
        state.loading = false;
      })
  }
});

export const {
  cleanHistoryState
} = topicHistorySlice.actions;

export default topicHistorySlice.reducer;
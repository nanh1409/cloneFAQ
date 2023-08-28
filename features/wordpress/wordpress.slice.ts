import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { apiGetWPPosts, GetWPPostsArgs } from "./wordpress.api";
import { WPPost } from "./wordpress.model";

export type WordPressState = {
  latestPosts: WPPost[];
  popularPosts: WPPost[]
}

const initialState: WordPressState = {
  latestPosts: [],
  popularPosts: []
}

const wordPressSlice = createSlice({
  name: "wp",
  initialState,
  reducers: {
    setWPLatestPosts: (state, action: PayloadAction<Array<WPPost>>) => {
      state.latestPosts = action.payload;
    },
    setWPPopularPosts: (state, action: PayloadAction<Array<WPPost>>) => {
      state.popularPosts = action.payload;
    },
  },
});

export const {
  setWPLatestPosts,
  setWPPopularPosts
} = wordPressSlice.actions;

export default wordPressSlice.reducer;
import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export type StudyLayoutState = {
  openTabletMenu: boolean;
  hideSubList: boolean;
  forceHideSubTopicTheory: boolean;
  topicChunkSize?: number;
}

const initialState: StudyLayoutState = {
  openTabletMenu: false,
  hideSubList: false,
  forceHideSubTopicTheory: false
}

const studyLayoutSlice = createSlice({
  name: "studyLayout",
  initialState: initialState,
  reducers: {
    setOpenTabletMenu: (state, action: PayloadAction<boolean>) => {
      state.openTabletMenu = action.payload;
    },
    setHideSubList: (state, action: PayloadAction<boolean>) => {
      state.hideSubList = action.payload;
    },
    setForceHideSubTopicTheory: (state, action: PayloadAction<boolean>) => {
      state.forceHideSubTopicTheory = action.payload;
    },
    setTopicChunkSize: (state, action: PayloadAction<number | undefined>) => {
      state.topicChunkSize = action.payload;
    }
  }
});

export const {
  setOpenTabletMenu,
  setHideSubList,
  setForceHideSubTopicTheory,
  setTopicChunkSize
} = studyLayoutSlice.actions;
export default studyLayoutSlice.reducer;
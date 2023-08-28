import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FeedbackRefs, FeedbackTypes } from "../../modules/share/constraint";
import { apiSendFeedback } from "./feedback.api";

export interface FeedbackState {
  openDialog: boolean;
  mapCheckedTags: Record<number, boolean>;
  feedbackContent: string;
  isOnSubmit: boolean;
  tableName: string;
  tableId: string;
}

const initialState: FeedbackState = {
  openDialog: false,
  mapCheckedTags: {},
  feedbackContent: "",
  isOnSubmit: false,
  tableName: FeedbackRefs.CARD,
  tableId: ""
}

export const submitFeedback = createAsyncThunk("feedback/submit", async (args: {
  tableName: string;
  tableId: string;
  content: string;
  tags: number[];
  sourceName?: string;
  sourceNum?: string;
  link?: string;
  courseId: string;
  userId: string;
}) => {
  const feedback = await apiSendFeedback({
    ...args,
    sourceName: args.sourceName || "Web",
    type: FeedbackTypes.WAITING
  })
  return feedback;
})

const feedbackSlice = createSlice({
  name: "feedback",
  initialState,
  reducers: {
    setOpenFeedbackDialog: (state, action: PayloadAction<boolean>) => {
      state.openDialog = action.payload;
    },
    setFeedbackDialogData: (state, action: PayloadAction<{ tableName: string; tableId: string; }>) => {
      state.tableName = action.payload.tableName;
      state.tableId = action.payload.tableId;
    },
    checkFeedbackTag: (state, action: PayloadAction<{ tag: number; checked: boolean }>) => {
      state.mapCheckedTags = {
        ...state.mapCheckedTags,
        [action.payload.tag]: action.payload.checked
      }
    },
    setFeedbackContent: (state, action: PayloadAction<string>) => {
      state.feedbackContent = action.payload;
    },
    resetFeedbackState: (state) => {
      state.mapCheckedTags = initialState.mapCheckedTags;
      state.feedbackContent = initialState.feedbackContent;
      state.tableId = initialState.tableId;
      state.isOnSubmit = false;
    }
  },
  extraReducers(builder) {
    builder
      .addCase(submitFeedback.pending, (state) => {
        state.isOnSubmit = true;
      })
      .addCase(submitFeedback.fulfilled, (state) => {
        state.isOnSubmit = false;
      })
  }
})

export const {
  setOpenFeedbackDialog,
  checkFeedbackTag,
  setFeedbackContent,
  resetFeedbackState,
  setFeedbackDialogData
} = feedbackSlice.actions;

export default feedbackSlice.reducer;
import { createAsyncThunk, createSlice, isAnyOf, PayloadAction } from "@reduxjs/toolkit";
import { AppState } from "../../app/redux/reducers";
import { UserInfo } from "../../modules/share/model/user";
import { apiCreateComment, apiDelComment, apiLikeComment, apiResetFirebaseStore, apiSeekCommentsByParent, apiSeekCommentsByTopic, apiUpdateCommentContent, ApiUpdateCommentContentArgs } from "./comment.api";
import { ClientComment } from "./comment.model";

const commentSliceName = "comment";
export const COMMENT_DEFAULT_LIMIT = 5;
export const CHILDREN_COMMENT_DEFAULT_LIMIT = 2;

export const createComment = createAsyncThunk(`${commentSliceName}/createComment`, async (args: { user: UserInfo; content: string; courseId?: string; topicId?: string; parentId?: string; useFirebase?: boolean; }, { getState }) => {
  const { user, ...rest } = args;
  const token = (getState() as AppState).authState.token;
  const href = window.location.href;
  const data = await apiCreateComment({ userId: user._id, user, token, href, ...rest });
  return data;
});

export const seekCommentsByTopic = createAsyncThunk(`${commentSliceName}/seekCommentsByTopic`, async (args: { topicId: string; limit?: number; childrenLimit?: number; useFirebase?: boolean }) => {
  const { limit = COMMENT_DEFAULT_LIMIT, childrenLimit = CHILDREN_COMMENT_DEFAULT_LIMIT, ...rest } = args;
  const data = await apiSeekCommentsByTopic({ limit, childrenLimit, ...rest });
  return data;
});

export const loadMoreCommentsInTopic = createAsyncThunk<{ total: number; comments: ClientComment[] }, { topicId: string; limit?: number; childrenLimit?: number; useFirebase?: boolean }, { state: AppState }>(`${commentSliceName}/loadMoreCommentsInTopic`, async (args, { getState }) => {
  const { limit = COMMENT_DEFAULT_LIMIT, childrenLimit = CHILDREN_COMMENT_DEFAULT_LIMIT, ...rest } = args;
  const data = await apiSeekCommentsByTopic({ limit, childrenLimit, ...rest, lastRecord: getState().commentState.commentsList.at(-1) });
  return data;
});

export const loadMoreRepliesInComment = createAsyncThunk<{ parentId: string; replies: ClientComment[] }, { parentId: string; limit?: number; }, { state: AppState }>(`${commentSliceName}/loadMoreRepliesInComments`, async (args, { getState }) => {
  const { limit = COMMENT_DEFAULT_LIMIT, parentId } = args;
  const data = await apiSeekCommentsByParent({ limit, parentId, lastRecord: getState().commentState.mapChildComments[parentId].at(-1) });
  return { parentId, replies: data };
});

export const resetFirebaseStore = createAsyncThunk(`${commentSliceName}/resetFirebaseStore`, (userId: string) => {
  return apiResetFirebaseStore(userId);
});

export const likeComment = createAsyncThunk(`${commentSliceName}/like`, (args: { commentId: string; userId: string; like: boolean; parentId?: string; }) => {
  const { parentId, ...payload } = args;
  return apiLikeComment(payload);
})

export const updateCommentContent = createAsyncThunk(`${commentSliceName}/updateContent`, (args: ApiUpdateCommentContentArgs & { parentId?: string; }, { getState }) => {
  const token = (getState() as AppState).authState.token;
  const { parentId, ...payload } = args;
  return apiUpdateCommentContent({ ...payload, token });
});

export const deleteComment = createAsyncThunk(`${commentSliceName}/delete`, (args: { _id: string; parentId?: string; }, { getState }) => {
  const token = (getState() as AppState).authState.token;
  const { _id } = args;
  return apiDelComment(_id, token);
})

export type CommentState = {
  total: number;
  commentsList: ClientComment[];
  mapChildComments: {
    [parentId: string]: ClientComment[];
  }
}

const initialState: CommentState = {
  total: 0,
  commentsList: [],
  mapChildComments: {},
}

const commentSlice = createSlice({
  name: commentSliceName,
  initialState,
  reducers: {
    addComment: (state, action: PayloadAction<ClientComment>) => {
      addNewComment(state, action.payload);
    },
    removeComment: (state, action: PayloadAction<ClientComment>) => {
      state.commentsList = state.commentsList.filter(e => e._id = action.payload._id);
    }
  },
  extraReducers: builder => {
    builder.addCase(createComment.fulfilled, (state, action) => {
      addNewComment(state, action.payload);
    });
    builder.addCase(seekCommentsByTopic.fulfilled, (state, action) => {
      state.total = action.payload.total;
      state.commentsList = action.payload.comments.map(({ childComments, ...rest }) => {
        state.mapChildComments[rest._id] = childComments;
        return { childComments: [], ...rest };
      })
      // state.commentsList = action.payload.comments;
    });
    builder.addCase(loadMoreCommentsInTopic.fulfilled, (state, action) => {
      state.total = action.payload.total;
      state.commentsList.push(...action.payload.comments);
    })
    builder.addCase(loadMoreRepliesInComment.fulfilled, (state, action) => {
      const { parentId, replies } = action.payload;
      state.mapChildComments[parentId] ? state.mapChildComments[parentId].push(...replies) : state.mapChildComments[parentId] = replies;
      // const index = state.commentsList.findIndex(e => e._id === action.payload.parentId);
      // state.commentsList[index].childComments.push(...action.payload.replies);
    })

    builder.addMatcher(isAnyOf(deleteComment.fulfilled, deleteComment.rejected), (state, action) => {
      const { _id, parentId } = action.meta.arg;
      const comIdx = state.commentsList.findIndex((c) => !!parentId ? c._id === parentId : c._id === _id);
      if (comIdx === -1) return;
      if (!parentId) {
        state.commentsList.splice(comIdx, 1);
        state.total = state.total - 1;
      } else {
        const replies = state.mapChildComments[parentId] || [];
        const repIdx = replies.findIndex((e) => e._id === _id);
        if (repIdx === -1) return;
        state.mapChildComments[parentId].splice(repIdx, 1);
        state.commentsList[comIdx].totalReplies -= 1;
      }
    });
  }
});

const addNewComment = (state: CommentState, newComment: ClientComment) => {
  const parentId = newComment.parentId;
  if (parentId) {
    const parentComment = state.commentsList.find(e => e._id === newComment.parentId);
    parentComment.totalReplies = parentComment.totalReplies + 1;
    state.mapChildComments[parentId] ? state.mapChildComments[parentId].push(newComment) : state.mapChildComments[parentId] = [newComment];
    // parentComment.childComments = [...parentComment.childComments, newComment];
  } else {
    state.total = state.total + 1;
    state.commentsList = [newComment, ...state.commentsList];
  }
}

export const {
  addComment,
  removeComment
} = commentSlice.actions;

export default commentSlice.reducer;
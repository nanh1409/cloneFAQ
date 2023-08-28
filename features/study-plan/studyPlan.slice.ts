import { createAsyncThunk, createSlice, PayloadAction, current } from "@reduxjs/toolkit";
import moment from "moment";
import { persistReducer } from "redux-persist";
import { reduxPersistTimeout } from "../../app/redux/config";
import { ClientCardProgress } from "../../modules/new-game/src/models/game.core";
import DailyGoal from "../../modules/share/model/dailyGoal";
import StudyPlan from "../../modules/share/model/studyPlan";
import Topic from "../../modules/share/model/topic";
import { apiGetTopicsBySlugs, apiOffsetTopicsByParentId } from "../study/topic.api";
import { gameLocalStore } from "../study/topic.utils";
import { apiBulkUpdateDailyGoals, apiCountQuestionsByCourse, apiGetStudyPlanByCourse, apiInitStudyPlan, apiUpdateDailyGoal, GetStudyPlanByCourseArgs, InitStudyPlanArgs, UpdateDailyGoalArgs } from "./studyPlan.api";
import { StudyPlanBuildStep } from "./useStudyPlanConfig";

export type MapStudyPlanQuestionsNum = {
  [studyPlanId: string]: number;
}


export type StudyPlanState = {
  currentStudyPlan: StudyPlan;
  listPlans: Array<StudyPlan>;
  loading: boolean;
  step: StudyPlanBuildStep;
  canNext: boolean;
  stateId: string;
  states: Topic[];
  topics: Topic[];
  mapStudyPlanQuestionsNum: MapStudyPlanQuestionsNum;
  isTopicQuestion: boolean;
  isCreated: boolean;
  dailyGoals: Array<DailyGoal>;
  lastCardProgress: ClientCardProgress | null;
  initTopicLoading: boolean;
}

export const fetchTopicsOrStates = createAsyncThunk("studyPlan/fetchTopics", async (args: { parentId: string | null; courseId: string; isState?: boolean }) => {
  const data = await apiOffsetTopicsByParentId({
    serverSide: false,
    courseId: args.courseId,
    parentId: args.parentId,
    field: "name",
    topicFields: ["_id", "name", "slug"]
  });
  return {
    isState: !!args.isState,
    data
  }
});

export const getQuestionsNumByCourse = createAsyncThunk("studyPlan/countQuestions", async (args: { studyPlanId: string; courseId: string; topicIds?: string[]; isTopicQuestion?: boolean }) => {
  const { totalQuestions } = await apiCountQuestionsByCourse(args);
  return {
    studyPlanId: args.studyPlanId,
    totalQuestions
  }
});

export const initStudyPlan = createAsyncThunk("studyPlan/init", async (args: InitStudyPlanArgs) => {
  const studyPlan = await apiInitStudyPlan(args);
  return {
    studyPlan,
    dailyGoals: args.dailyGoals
  };
});

export const initPlanTopics = createAsyncThunk("studyPlan/initPlanTopics", async (args: { courseId: string; slugs: string[]; }) => {
  const { courseId, slugs } = args;
  const topics = await apiGetTopicsBySlugs({
    courseId, slug: slugs, local: false, topicFields: ["_id"]
  });
  return topics;
})

export const fetchStudyPlan = createAsyncThunk("studyPlan/fetch", async (args: GetStudyPlanByCourseArgs) => {
  const data = await apiGetStudyPlanByCourse(args);
  return data;
});

export const requestUpdateDailyGoal = createAsyncThunk("studyPlan/requestUpdateDailyGoal", async (args: UpdateDailyGoalArgs) => {
  const data = await apiUpdateDailyGoal(args);
  return data;
});

export const requestBulkUpdateDailyGoals = createAsyncThunk("studyPlan/bulkUpdateDailyGoals", async (args: Array<DailyGoal>) => {
  const data = await apiBulkUpdateDailyGoals(args);
  return data;
});

const initialState: StudyPlanState = {
  currentStudyPlan: null,
  listPlans: [],
  loading: true,
  step: StudyPlanBuildStep.INTRO,
  canNext: true,
  stateId: "",
  states: [],
  topics: [],
  mapStudyPlanQuestionsNum: {},
  isTopicQuestion: false,
  isCreated: false,
  dailyGoals: [],
  lastCardProgress: null,
  initTopicLoading: true
}

const studyPlanSlice = createSlice({
  name: "studyPlan",
  initialState,
  reducers: {
    loadPlans: (state, action: PayloadAction<Array<StudyPlan>>) => {
      state.listPlans = action.payload;
      const studyPlanIds = action.payload.map(({ _id }) => _id);
      state.dailyGoals = state.dailyGoals.filter(({ studyPlanId }) => studyPlanIds.includes(studyPlanId))
    },
    setCurrentPlan: (state, action: PayloadAction<{ studyPlan: StudyPlan | null, isCreated?: boolean; }>) => {
      state.currentStudyPlan = action.payload.studyPlan;
      state.isCreated = action.payload.isCreated;
      state.loading = false;
    },
    setStudyPlanBuildStep: (state, action: PayloadAction<{ step: StudyPlanBuildStep, isNext?: boolean; canNext?: boolean; }>) => {
      state.step = action.payload.step;
      if (action.payload.isNext) state.canNext = action.payload.canNext;
      else state.canNext = true;
    },
    updatePlan: (state, action: PayloadAction<StudyPlan>) => {
      const { courseId, userId } = action.payload;
      const newPlan: StudyPlan = Object.assign<StudyPlan, Partial<StudyPlan>>(action.payload, { lastUpdate: Date.now() });
      const idx = state.listPlans.findIndex((plan) => plan.courseId === courseId && plan.userId === userId);
      if (idx !== -1) {
        const newList = [...state.listPlans];
        newList.splice(idx, 1, newPlan);
        state.listPlans = newList;
      }
      if (state.currentStudyPlan.courseId === courseId && state.currentStudyPlan.userId === userId) {
        state.currentStudyPlan = newPlan;
      }
    },
    setCanNextStep: (state, action: PayloadAction<boolean>) => {
      state.canNext = action.payload;
    },
    setStudyPlanStateId: (state, action: PayloadAction<string>) => {
      state.stateId = action.payload;
    },
    setTopicQuestionMode: (state, action: PayloadAction<boolean>) => {
      state.isTopicQuestion = action.payload;
    },
    createDailyGoals: (state, action: PayloadAction<Array<DailyGoal>>) => {
      const studyPlanId = action.payload[0]?.studyPlanId;
      if (!!studyPlanId) {
        state.dailyGoals = [...state.dailyGoals.filter((e) => e.studyPlanId !== studyPlanId), ...action.payload]
      }
    },
    updateDailyGoal: (state, action: PayloadAction<DailyGoal>) => {
      const { studyPlanId, date } = action.payload;
      const idx = state.dailyGoals.findIndex((e) =>
        e.studyPlanId === studyPlanId
        && moment(e.date).isSame(date, "day")
      );
      if (idx !== -1) {
        state.dailyGoals.splice(idx, 1, action.payload);
      } else {
        state.dailyGoals.push(action.payload);
      }
    },
    bulkUpdateDailyGoals: (state, action: PayloadAction<DailyGoal[]>) => {
      action.payload.forEach((e) => {
        const idx = current(state.dailyGoals).findIndex(({ studyPlanId, date }) => studyPlanId === e.studyPlanId && moment(date).isSame(e.date, "day"));
        if (idx !== -1) {
          state.dailyGoals.splice(idx, 1, e);
        }
      });
    },
    setLastCardProgress: (state, action: PayloadAction<ClientCardProgress | null>) => {
      state.lastCardProgress = action.payload;
    },
    setInitTopicLoading: (state, action: PayloadAction<boolean>) => {
      state.initTopicLoading = action.payload;
    },
    changeKeyMapStudyPlanQuestionsNum: (state, action: PayloadAction<{ oldKey: string; newKey: string }>) => {
      const { oldKey, newKey } = action.payload;
      const { [oldKey]: oldValue = 0, [newKey]: _ = 0, ...rest } = current(state.mapStudyPlanQuestionsNum);
      state.mapStudyPlanQuestionsNum = { ...rest, [newKey]: oldValue };
    },
    recreateStudyPlan: (state, action: PayloadAction<{ initPlan: StudyPlan }>) => {
      state.currentStudyPlan = action.payload.initPlan;
      state.listPlans.push(action.payload.initPlan);
      state.isCreated = false;
      state.step = StudyPlanBuildStep.INTRO;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchTopicsOrStates.fulfilled, (state, action) => {
      if (action.payload.isState) state.states = action.payload.data;
      else state.topics = action.payload.data;
    });
    builder.addCase(getQuestionsNumByCourse.fulfilled, (state, action) => {
      const { studyPlanId, totalQuestions } = action.payload;
      state.mapStudyPlanQuestionsNum = {
        ...current(state.mapStudyPlanQuestionsNum),
        [studyPlanId]: totalQuestions
      }
    });
    builder.addCase(initStudyPlan.fulfilled, (state, action) => {
      if (action.payload) {
        state.currentStudyPlan = action.payload.studyPlan;
        state.listPlans.push(action.payload.studyPlan);
        state.dailyGoals.push(...action.payload.dailyGoals.map((e) => ({ ...e, studyPlanId: action.payload.studyPlan._id })));
      }
    });
    builder.addCase(fetchStudyPlan.fulfilled, (state, action) => {
      state.currentStudyPlan = action.payload.studyPlan;
      state.dailyGoals = action.payload.dailyGoals ?? [];
      state.loading = false;
    });
    builder.addCase(requestUpdateDailyGoal.fulfilled, (state, action) => {
      const { studyPlanId, date } = action.payload;
      const idx = state.dailyGoals.findIndex((e) =>
        e.studyPlanId === studyPlanId
        && moment(e.date).isSame(date, "day")
      );
      if (idx !== -1) {
        state.dailyGoals.splice(idx, 1, action.payload);
      } else {
        state.dailyGoals.push(action.payload);
      }
    });
    builder
      .addCase(initPlanTopics.pending, (state) => {
        state.initTopicLoading = true;
      })
      .addCase(initPlanTopics.fulfilled, (state, action) => {
        if (state.currentStudyPlan) {
          state.currentStudyPlan.topicIds = action.payload.map(({ _id }) => _id);
        }
        state.initTopicLoading = false;
      });
    builder.addCase(requestBulkUpdateDailyGoals.fulfilled, () => {

    });
  }
});

export const {
  loadPlans,
  setCurrentPlan,
  setStudyPlanBuildStep,
  updatePlan,
  setCanNextStep,
  setStudyPlanStateId,
  setTopicQuestionMode,
  createDailyGoals,
  updateDailyGoal,
  setLastCardProgress,
  setInitTopicLoading,
  bulkUpdateDailyGoals,
  changeKeyMapStudyPlanQuestionsNum,
  recreateStudyPlan
} = studyPlanSlice.actions;

const studyPlanSliceReducer = typeof window === "undefined"
  ? studyPlanSlice.reducer
  : persistReducer({
    key: "study-plan",
    timeout: reduxPersistTimeout,
    storage: gameLocalStore,
    whitelist: ["listPlans", "mapStudyPlanQuestionsNum", "dailyGoals"]
  }, studyPlanSlice.reducer)
export default studyPlanSliceReducer;
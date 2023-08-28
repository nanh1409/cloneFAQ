import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";
import AppSetting from "../../modules/share/model/appSetting";
import Topic from "../../modules/share/model/topic";
import WebSeo from "../../modules/share/model/webSeo";
import { HydrateAppAction } from "../../types/nextReduxTypes";
import { TopicWithUser } from "../study/topic.model";

export type AppInfoState = {
  appInfo: AppSetting;
  seoInfo: WebSeo;
  practiceList: Topic[];
  testList: Array<Topic & { fullName?: string }>;
  practiceSlug: Topic | null;
  practiceSlugList: TopicWithUser[];
  mapSeoInfo: {
    [slug: string]: WebSeo
  };
  childApp: AppSetting;
}

const initialState: AppInfoState = {
  appInfo: null,
  seoInfo: null,
  practiceList: [],
  testList: [],
  practiceSlug: null,
  practiceSlugList: [],
  mapSeoInfo: {},
  childApp: null
}

const appInfoSlice = createSlice({
  name: "appInfo",
  initialState,
  reducers: {
    setAppInfo: (state, action: PayloadAction<AppSetting>) => {
      state.appInfo = action.payload;
    },
    setSEOInfo: (state, action: PayloadAction<WebSeo>) => {
      state.seoInfo = action.payload;
    },
    setPracticeList: (state, action: PayloadAction<Topic[]>) => {
      state.practiceList = action.payload;
    },
    setTestList: (state, action: PayloadAction<Topic[]>) => {
      state.testList = action.payload;
    },
    setSlugList: (state, action: PayloadAction<{ practiceSlug: Topic; practiceSlugList: TopicWithUser[] }>) => {
      state.practiceSlug = action.payload.practiceSlug;
      state.practiceSlugList = action.payload.practiceSlugList;
    },
    setKeySEOInfo: (state, action: PayloadAction<WebSeo>) => {
      if (action.payload) {
        const slug = action.payload.slug;
        state.mapSeoInfo = {
          ...state.mapSeoInfo,
          [slug]: action.payload
        }
      }
    },
    setChildApp: (state, action: PayloadAction<AppSetting>) => {
      state.childApp = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(HYDRATE, (state, action: HydrateAppAction) => {
      state.appInfo = action.payload?.appInfos?.appInfo ?? initialState.appInfo;
      state.seoInfo = action.payload?.appInfos?.seoInfo ?? initialState.seoInfo;
      state.practiceList = action.payload?.appInfos?.practiceList ?? initialState.practiceList;
      state.testList = action.payload?.appInfos?.testList ?? initialState.testList;
      state.mapSeoInfo = { ...(action.payload?.appInfos?.mapSeoInfo || state.mapSeoInfo) }
    });
  }
});

export const {
  setAppInfo,
  setSEOInfo,
  setPracticeList,
  setTestList,
  setSlugList,
  setKeySEOInfo,
  setChildApp
} = appInfoSlice.actions;
export default appInfoSlice.reducer;
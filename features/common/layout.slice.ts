import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { apiGetGeoInfo } from "./common.api";

export type LayoutState = {
  useDynamicNav: boolean;
  geoInfoLoading: boolean;
  geoInfo: {
    country: string;
    ip: string;
  },
  currentBlogPostCategoryLink: string;
}

const initialState: LayoutState = {
  useDynamicNav: false,
  geoInfoLoading: true,
  geoInfo: {
    country: "",
    ip: ""
  },
  currentBlogPostCategoryLink: ""
}

export const fetchGeoInfo = createAsyncThunk("layout/fetGeoInfo", async () => {
  const data = await apiGetGeoInfo();
  return data;
});

const layoutSlice = createSlice({
  name: "layout",
  initialState,
  reducers: {
    setUseDynamicNav: (state, action: PayloadAction<boolean>) => {
      state.useDynamicNav = action.payload;
    },
    setCurrentBlogPostCategoryLink: (state, action: PayloadAction<string>) => {
      state.currentBlogPostCategoryLink = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchGeoInfo.pending, (state) => {
      state.geoInfoLoading = true;
    })
    builder.addCase(fetchGeoInfo.fulfilled, (state, action) => {
      if (action.payload) state.geoInfo = {
        ...action.payload,
        country: ["127.0.0.1", "::1"].includes(action.payload.ip) ? "VN" : action.payload.country
      };
      state.geoInfoLoading = false;
    });
  }
});

export const {
  setUseDynamicNav,
  setCurrentBlogPostCategoryLink
} = layoutSlice.actions;

export default layoutSlice.reducer;
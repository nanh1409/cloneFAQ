import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
// import persistSessionStorage from "redux-persist/lib/storage/session";
import createWebStorage from "redux-persist/lib/storage/createWebStorage";
import createNoopStorage from "../../app/createNoopStorate";
import { PricingPlan } from "../../modules/share/model/pricingPlan";
import { UserPricingPlan } from "../../types/UserPricingPlan";
import { apiCreateUserPlanOrder, apiGetPricingPlanById, apiGetUserSubscriptionByApp, apiGetUserSubscriptions, CreateUserPlanOrderArgs } from "./payment.api";

const storage = typeof window === "undefined" ? createNoopStorage() : createWebStorage("session");

type WebUserPayment = UserPricingPlan & { userId?: string; }

export type PaymentState = {
  loading: boolean;
  listPaymentInfo: Array<UserPricingPlan>;
  paymentInfo: WebUserPayment | null;
  appPlans: Array<PricingPlan>;
  checkingOutPlan: PricingPlan | null;
  isMakingPayment: boolean;
  accountPayment: WebUserPayment | null;
}

const initialState: PaymentState = {
  loading: true,
  listPaymentInfo: [],
  paymentInfo: null,
  appPlans: [],
  checkingOutPlan: null,
  isMakingPayment: false,
  accountPayment: null
}

export const loadUserSubscriptions = createAsyncThunk("payment/loadUserSubscriptions", async (args: { token: string; appName?: string }) => {
  const data = await apiGetUserSubscriptions({ token: args.token, appName: args.appName });
  return data;
});

export const loadUserSubscriptionByApp = createAsyncThunk("payment/loadUserSubscriptionByApp", async (args: { token: string; appName: string }) => {
  const data = await apiGetUserSubscriptionByApp({ token: args.token, appName: args.appName });
  return data;
});

export const fetchCheckingOutPlan = createAsyncThunk("payment/fetchCheckingOutPlan", async (planId: string) => {
  const data = await apiGetPricingPlanById(planId);
  return data;
});

export const checkoutPayment = createAsyncThunk("payment/checkout", async (args: CreateUserPlanOrderArgs) => {
  const data = await apiCreateUserPlanOrder(args);
  return data;
});

const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {
    setPaymentInfoLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setAppPlans: (state, action: PayloadAction<Array<PricingPlan>>) => {
      state.appPlans = action.payload;
    },
    setCheckingOutPlan: (state, action: PayloadAction<PricingPlan | null>) => {
      state.checkingOutPlan = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(loadUserSubscriptionByApp.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(loadUserSubscriptionByApp.fulfilled, (state, action) => {
      state.paymentInfo = action.payload;
      state.accountPayment = action.payload;
      state.loading = false;
    });
    builder.addCase(loadUserSubscriptionByApp.rejected, (state, action) => {
      state.paymentInfo = null;
      state.accountPayment = null;
      state.loading = false;
    })
    builder.addCase(fetchCheckingOutPlan.fulfilled, (state, action) => {
      state.checkingOutPlan = action.payload;
    });
    builder.addCase(checkoutPayment.pending, (state) => {
      state.isMakingPayment = true;
    });
    builder.addCase(checkoutPayment.fulfilled, (state) => {
      state.isMakingPayment = false;
    })
  }
});

export const {
  setPaymentInfoLoading,
  setAppPlans,
  setCheckingOutPlan
} = paymentSlice.actions;

const paymentReducer = typeof window === "undefined"
  ? paymentSlice.reducer
  : persistReducer({
    key: "payment",
    storage,
    whitelist: ["accountPayment"]
  }, paymentSlice.reducer)

export default paymentReducer;
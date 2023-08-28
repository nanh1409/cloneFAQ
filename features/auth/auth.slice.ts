import { createAsyncThunk, createSlice, current, isAnyOf, PayloadAction } from "@reduxjs/toolkit";
import localforage from "localforage";
import moment from "moment";
import { parseCookies, setCookie } from "nookies";
import { persistReducer } from "redux-persist";
import { useSelector } from "../../app/hooks";
import { reduxPersistTimeout } from "../../app/redux/config";
import { LOGIN_SUCCESS } from "../../modules/share/constraint";
import { UserInfo } from "../../modules/share/model/user";
import { apiChangePassword, apiGetUserByToken, apiLogin, apiLogout, apiRegister, apiRegisterUserId, apiRequestResetPassword, apiResetPassword, apiUpdateUserInfo, ForgotAppPasswordArgs } from "./auth.api";
import { LOCAL_REGISTER_TIME_KEY, LOCAL_USER_ID_KEY, SIGN_IN_SESSION_KEY } from "./auth.config";

type FetchUserResult = {
  _id: string;
  token: string;
  user?: any;
}

export type AuthState = {
  userId: string;
  loading: boolean;
  user: UserInfo & { syncedPass?: boolean } | null;
  token: string;
  loginCode: number | null;
  fetchingAPI: boolean;
}

const initialState: AuthState = {
  userId: null,
  loading: true,
  user: null,
  token: null,
  loginCode: null,
  fetchingAPI: false
}

export const authLocalForage = localforage.createInstance({
  name: "koolsoft-elearning-auth",
  storeName: "redux-persist"
});

const saveLocalRegisterTime = () => {
  const localRegisterTime = window.localStorage.getItem(LOCAL_REGISTER_TIME_KEY);
  if (!localRegisterTime) window.localStorage.setItem(LOCAL_REGISTER_TIME_KEY, Date.now().toString());
}

export const registerUserId = createAsyncThunk("users/registerUserId", async () => {
  const localUID = window.localStorage.getItem(LOCAL_USER_ID_KEY);
  if (!!localUID) {
    saveLocalRegisterTime();
    return localUID;
  }
  // TODO: create userId by bson-bject lib;
  const { userId }: { userId: string } = await apiRegisterUserId();
  if (userId) {
    window.localStorage.setItem(LOCAL_USER_ID_KEY, userId);
    saveLocalRegisterTime();
  }
  return userId;
});

export const login = createAsyncThunk("users/login", async (args: { account: string, password: string; appId?: string; }) => {
  const data = await apiLogin({ ...args, appLogin: true, withRole: false, skipActivation: true });
  return data;
});

export const registerUser = createAsyncThunk("users/registerUser", async (args: { account: string, name: string, password: string, email: string; appId?: string; localRegisterTime?: number; }) => {
  const data = await apiRegister(args);
  return data;
});

export const logout = createAsyncThunk("users/logout", async (args: { token: string }) => {
  const { token } = args;
  const data = await apiLogout(token);
  return data;
});

export const fetchUserByToken = createAsyncThunk("users/fetchUserByToken", async (token: string): Promise<FetchUserResult> => {
  const localUID = window.localStorage.getItem(LOCAL_USER_ID_KEY)
  console.log("Call");
  if (!token) {
    if (localUID) {
      saveLocalRegisterTime();
      return { _id: localUID, token: '' };
    }
    const { userId } = await apiRegisterUserId();
    saveLocalRegisterTime();
    return { _id: userId, token: '' }
  };
  const cookies = parseCookies();
  const signInSessionUID = cookies[SIGN_IN_SESSION_KEY];
  const updateLoginTime = signInSessionUID !== localUID;
  if (updateLoginTime) {
    const now = moment(); const eod = moment(now).endOf("day");
    setCookie(null, SIGN_IN_SESSION_KEY, localUID, { maxAge: Math.abs(now.diff(eod, "seconds")), path: "/" });
  }
  const user = await apiGetUserByToken(token, updateLoginTime);
  return { _id: user?._id ?? '', token: !!user ? token : '', user };
});

export const fetchUserByTokenNoCache = createAsyncThunk("users/fetchUserByTokenNoCache", async (args: { token: string; noCache?: boolean }): Promise<FetchUserResult> => {
  const { token, noCache } = args;
  const localUID = window.localStorage.getItem(LOCAL_USER_ID_KEY);
  if (!token) {
    if (localUID) {
      saveLocalRegisterTime();
      return { _id: localUID, token: '' };
    }
    const { userId } = await apiRegisterUserId();
    saveLocalRegisterTime();
    return { _id: userId, token: '' }
  };
  const cookies = parseCookies();
  const signInSessionUID = cookies[SIGN_IN_SESSION_KEY];
  const updateLoginTime = signInSessionUID !== localUID;
  if (updateLoginTime) {
    const now = moment(); const eod = moment(now).endOf("day");
    setCookie(null, SIGN_IN_SESSION_KEY, localUID, { maxAge: Math.abs(now.diff(eod, "seconds")), path: "/" });
  }
  const user = await apiGetUserByToken(token, updateLoginTime, noCache);
  return { _id: user?._id ?? '', token: !!user ? token : '', user };
});

export const requestResetPassword = createAsyncThunk("users/requestResetPassword", async (args: ForgotAppPasswordArgs) => {
  const loginCode = await apiRequestResetPassword(args);
  return loginCode;
});

export const resetPassword = createAsyncThunk("users/resetPassword", async (args: { token: string; password: string }) => {
  const loginCode = await apiResetPassword(args);
  return loginCode;
});

export const updateUserInfo = createAsyncThunk("users/update", async (args: { token: string } & Partial<Pick<UserInfo, "name" | "email" | "birth" | "phoneNumber">>) => {
  const result = await apiUpdateUserInfo(args);
  return result;
});

export const changePassword = createAsyncThunk("users/changePassword", async (args: { token: string; oldPassword: string; newPassword: string; }) => {
  const data = await apiChangePassword(args);
  return data;
});

const authSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setAuthLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setUserInfo: (state, action: PayloadAction<UserInfo & { syncedPass?: boolean; }>) => {
      state.user = action.payload
    },
    setLoginCode: (state, action: PayloadAction<number | null>) => {
      state.loginCode = action.payload
    },
    setFetching: (state, action: PayloadAction<boolean>) => {
      state.fetchingAPI = action.payload
    },
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUserId.fulfilled, (state, action) => {
        state.userId = action.payload;
        state.token = null;
        state.user = null;
        state.loading = false;
        state.fetchingAPI = false;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<UserInfo>) => {
        const user = action.payload;
        state.user = user?.loginCode === LOGIN_SUCCESS ? user : null;
        state.userId = action.payload?._id ?? state.userId;
        state.token = user?.token || null;
        state.loginCode = user.loginCode;
        state.fetchingAPI = false;
        if (!!user?._id) window.localStorage.setItem(LOCAL_USER_ID_KEY, user._id);
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        const user = action.payload;
        state.user = user?.loginCode === LOGIN_SUCCESS ? user : null;
        state.userId = action.payload?._id ?? state.userId;
        state.token = user?.token;
        state.loginCode = user.loginCode;
        state.fetchingAPI = false;
        if (!!user?._id) window.localStorage.setItem(LOCAL_USER_ID_KEY, user._id);
      })
      .addCase(fetchUserByToken.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserByToken.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.userId = action.payload?._id ?? state.userId;
        state.token = action.payload?.token;
        state.loading = false;
        if (!!action.payload?._id) window.localStorage.setItem(LOCAL_USER_ID_KEY, action.payload._id);
      })
      .addCase(fetchUserByTokenNoCache.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserByTokenNoCache.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.userId = action.payload?._id ?? state.userId;
        state.token = action.payload?.token;
        state.loading = false;
        if (!!action.payload?._id) window.localStorage.setItem(LOCAL_USER_ID_KEY, action.payload._id);
      })
      .addCase(requestResetPassword.fulfilled, (state, action) => {
        state.loginCode = action.payload;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.loginCode = action.payload;
      })
      .addCase(updateUserInfo.fulfilled, (state, action) => {
        if (action.payload) {
          const { name, email, birth, phoneNumber } = action.meta.arg;
          state.user = {
            ...(current(state).user),
            name: name ?? current(state).user.name,
            email: email ?? current(state).user.email,
            birth: birth ?? current(state).user.birth,
            phoneNumber: phoneNumber ?? current(state).user.phoneNumber
          }
        }
      });

    builder.addMatcher(isAnyOf(logout.fulfilled, logout.rejected, logout.pending), (state) => {
      state.user = null;
      state.userId = '';
      state.token = null;
      window.localStorage.removeItem(LOCAL_USER_ID_KEY);
      window.localStorage.removeItem(LOCAL_REGISTER_TIME_KEY);
    });
  }
});

export const getAccessToken = () => useSelector((state) => state.authState.token);

const authReducer = typeof window === "undefined"
  ? authSlice.reducer
  : persistReducer({
    key: "auth",
    timeout: reduxPersistTimeout,
    storage: authLocalForage,
    whitelist: ["token"]
  }, authSlice.reducer);

export default authReducer;

export const { setUserInfo, setLoginCode, setAuthLoading, setFetching, setToken } = authSlice.actions;
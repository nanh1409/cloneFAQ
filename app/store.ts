import { Action, configureStore, ThunkDispatch } from "@reduxjs/toolkit";
import { createWrapper } from "next-redux-wrapper";
import { persistStore } from "redux-persist";
import { rootReducers } from "./redux/reducers";

export const store = configureStore({
  reducer: rootReducers,
  devTools: process.env.NODE_ENV !== "production",
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false
    })
  }
});

export const persistor = persistStore(store);

const makeStore = () => {
  return store;
}

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type ThunkAppDispatch = ThunkDispatch<AppState, void, Action>;

export const wrapper = createWrapper(makeStore, { debug: false });

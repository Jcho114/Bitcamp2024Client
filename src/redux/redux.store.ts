import { configureStore } from "@reduxjs/toolkit";
import tokenReducer from "./tokenSlice";
import appointmentReducer from "./appointmentSlice";

export const store = configureStore({
  reducer: {
    token: tokenReducer,
    appointment: appointmentReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
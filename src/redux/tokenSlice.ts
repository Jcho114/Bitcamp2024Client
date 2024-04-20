import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./redux.store";

export interface TokenState {
  value: string;
};

const initialState: TokenState = {
  value: localStorage.getItem('token') || ""
};

export const tokenSlice = createSlice({
  name: "token",
  initialState,
  reducers: {
    updateToken: (_, action: PayloadAction<string>) => {
      localStorage.setItem("token", action.payload);
      return { value: action.payload };
    }
  }
});

export const { updateToken } = tokenSlice.actions;

export const selectToken = (state: RootState) => state.token.value;

export default tokenSlice.reducer;
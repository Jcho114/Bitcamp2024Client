import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "./redux.store";

export interface AppointmentState {
  value: string[];
};

const initialState: AppointmentState = {
  value: []
};

export const appointmentSlice = createSlice({
  name: "appointment",
  initialState,
  reducers: {
    updateAppointment: (_, action: PayloadAction<string[]>) => {
      return { value: action.payload };
    }
  }
});

export const { updateAppointment } = appointmentSlice.actions;

export const selectRoomId = (state: RootState) => state.appointment.value;

export default appointmentSlice.reducer;
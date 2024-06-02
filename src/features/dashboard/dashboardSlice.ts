/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice } from "@reduxjs/toolkit";
import { MqttClient } from "mqtt";

interface IDashboardState {
  editMode: boolean;
  clientsMqttConnected: MqttClient[];
}

const initialState: IDashboardState = {
  editMode: false,
  clientsMqttConnected: [],
};

const DashboardSlice = createSlice({
  name: "dashboard",
  initialState: initialState,
  reducers: {
    toggleEditMode: (state) => {
      return {
        ...state,
        editMode: !state.editMode,
      };
    },
    pushClientMqtt: (state, action) => {
      return {
        ...state,
        clientsMqttConnected: [...state.clientsMqttConnected, action.payload],
      };
    },
  },
});

export const { toggleEditMode, pushClientMqtt } = DashboardSlice.actions;

export default DashboardSlice.reducer;

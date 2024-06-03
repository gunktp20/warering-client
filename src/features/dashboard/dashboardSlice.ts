/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice } from "@reduxjs/toolkit";
import { MqttClient } from "mqtt";

interface IDashboard {
  id: string;
  nameDashboard: string;
  description: string;
  createdAt: string;
}

interface IDashboardState {
  editMode: boolean;
  dashboards: IDashboard[];
  clientsMqttConnected: MqttClient[];
  selectedDashboard: string;
}

const initialState: IDashboardState = {
  editMode: false,
  dashboards: [],
  clientsMqttConnected: [],
  selectedDashboard: "",
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
    setDashboards: (state, action) => {
      return {
        ...state,
        dashboards: action.payload,
      };
    },
    setSelectedDashboard: (state, action) => {
      return {
        ...state,
        selectedDashboard: action.payload,
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

export const {
  toggleEditMode,
  pushClientMqtt,
  setDashboards,
  setSelectedDashboard,
} = DashboardSlice.actions;

export default DashboardSlice.reducer;

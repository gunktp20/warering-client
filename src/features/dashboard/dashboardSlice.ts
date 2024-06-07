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
  showAlert: boolean;
  alertType: "error" | "success" | "info" | "warning";
  alertText: string;
}

const initialState: IDashboardState = {
  editMode: false,
  dashboards: [],
  clientsMqttConnected: [],
  selectedDashboard: "",
  showAlert: false,
  alertType: "error",
  alertText: "",
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
    displayAlert: (state, action) => {
      const { msg, type } = action.payload;
      return {
        ...state,
        alertText: msg,
        alertType: type,
        showAlert: true,
      };
    },
    clearAlert: (state) => {
      return {
        ...state,
        alertText: "",
        alertType: "error",
        showAlert: false,
      };
    },
  },
});

export const {
  toggleEditMode,
  pushClientMqtt,
  setDashboards,
  setSelectedDashboard,
  clearAlert,
  displayAlert,
} = DashboardSlice.actions;

export default DashboardSlice.reducer;

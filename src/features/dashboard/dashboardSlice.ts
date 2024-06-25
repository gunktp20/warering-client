/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice } from "@reduxjs/toolkit";
import { MqttClient } from "mqtt";

export interface IConfigWidget {
  value: string;
  min: number;
  max: number;
  unit: string;
  button_label: string;
  payload: string;
  on_payload: string;
  off_payload: string;
}

export interface IWidgetDashboard {
  id: string;
  _id: string;
  deviceId: string;
  label: string;
  type: string;
  configWidget: IConfigWidget;
  createdAt: string;
  updatedAt: string;
  column: "column-1" | "column-2" | "column-3" | string;
}

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
  widgets: IWidgetDashboard[];
}

const initialState: IDashboardState = {
  editMode: false,
  dashboards: [],
  clientsMqttConnected: [],
  selectedDashboard: "",
  showAlert: false,
  alertType: "error",
  alertText: "",
  widgets: [],
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
    setWidgets: (state, action) => {
      return {
        ...state,
        widgets: action.payload,
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
  setWidgets,
  clearAlert,
  displayAlert,
} = DashboardSlice.actions;

export default DashboardSlice.reducer;

/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice } from "@reduxjs/toolkit";
import { IWidgetState } from "./types";

const initialState: IWidgetState = {
  selectedWidget: "",
  selectedWidgetInfo: null,
  showAlert: false,
  alertType: "error",
  alertText: "",
};

const WidgetSlice = createSlice({
  name: "widget",
  initialState: initialState,
  reducers: {
    setSelectedWidgets: (state, action) => {
      return { ...state, selectedWidget: action.payload };
    },
    setSelectedWidgetInfo: (state, action) => {
      return { ...state, selectedWidgetInfo: action.payload };
    },
    displayAlert: (state, action) => {
      const { msg, type } = action.payload;
      return { ...state, showAlert: true, alertText: msg, alertType: type };
    },
    clearAlert: (state) => {
      return { ...state, showAlert: false, alertText: "", alertType: "error" };
    },
  },
});

export const {
  setSelectedWidgets,
  setSelectedWidgetInfo,
  displayAlert,
  clearAlert,
} = WidgetSlice.actions;

export default WidgetSlice.reducer;

/* eslint-disable @typescript-eslint/no-explicit-any */
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { IDeviceState } from "./types";

const initialState: IDeviceState = {
  deviceOffline: 0,
  deviceOnline: 0,
  totalDevice: 0,
  totalDeviceDeny: 0,
  devices: [],
  selectedDevice: "",
  alertType: "error",
  alertText: "",
  showAlert: false,
};

const DeviceSlice = createSlice({
  name: "device",
  initialState: initialState,
  reducers: {
    setDeviceOverview: (state, action) => {
      const { deviceOffline, deviceOnline, totalDevice, totalDeviceDeny } =
        action.payload;
      return {
        ...state,
        deviceOffline,
        deviceOnline,
        totalDevice,
        totalDeviceDeny,
      };
    },
    setDevices: (state, action: PayloadAction<any[]>) => {
      return {
        ...state,
        devices: action.payload,
      };
    },
    setSelectedDevice: (state, action) => {
      return {
        ...state,
        selectedDevice: action.payload,
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
  setDeviceOverview,
  setDevices,
  setSelectedDevice,
  displayAlert,
  clearAlert
} = DeviceSlice.actions;

export default DeviceSlice.reducer;

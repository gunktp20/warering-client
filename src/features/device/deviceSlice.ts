/* eslint-disable @typescript-eslint/no-explicit-any */
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { IDeviceState } from "./types";

const initialState: IDeviceState = {
  deviceOffline: 0,
  deviceOnline: 0,
  totalDevice: 0,
  totalDeviceDeny: 0,
  devices: [],
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
  },
});

export const { setDeviceOverview, setDevices } = DeviceSlice.actions;

export default DeviceSlice.reducer;

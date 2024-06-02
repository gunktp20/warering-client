/* eslint-disable @typescript-eslint/no-explicit-any */
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { IDeviceState } from "./types";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import getAxiosErrorMessage from "../../utils/getAxiosErrorMessage";

const initialState: IDeviceState = {
  deviceOffline: 0,
  deviceOnline: 0,
  totalDevice: 0,
  totalDeviceDeny: 0,
  devices: [],
};

export const fetchAllDevices = createAsyncThunk(
  "auth/requestVerifyEmail",
  async (_, thunkApi) => {
    const axiosPrivate = useAxiosPrivate();
    try {
      const { data } = await axiosPrivate.get(`/devices/`);
      return {
        ...data,
      };
    } catch (err: any) {
      const msg = await getAxiosErrorMessage(err);
      return thunkApi.rejectWithValue(msg);
    }
  }
);

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

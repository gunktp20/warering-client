import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import deviceReducer from "../features/device/deviceSlice";
import dashboardReducer from "../features/dashboard/dashboardSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    device: deviceReducer,
    dashboard: dashboardReducer,
  },
  devTools: true,
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

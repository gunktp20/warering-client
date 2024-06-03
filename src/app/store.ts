import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import deviceReducer from "../features/device/deviceSlice";
import dashboardReducer from "../features/dashboard/dashboardSlice";
import widgetReducer from "../features/widget/widgetSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    device: deviceReducer,
    dashboard: dashboardReducer,
    widget: widgetReducer,
  },
  devTools: true,
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

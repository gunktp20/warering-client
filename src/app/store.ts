import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice"
import deviceReducer from "../features/device/deviceSlice"
export const store = configureStore({
    reducer:{
        auth:authReducer,
        device:deviceReducer
    },
    devTools:true
})

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../services/api";
import { IAuthState, IRegister } from "./types";

const initialState: IAuthState = {
  user: null,
  token: "",
  isLoading: false,
  showAlert: false,
  alertText: "",
  alertType: "",
};

export const register = createAsyncThunk(
  "auth/register",
  async (userInfo: IRegister, thunkApi) => {
    try {
      const response = await api.post("/auth/register", userInfo);
      return response.data;
    } catch (err: any) {
      const msg =
        typeof err?.response?.data?.message === "object"
          ? err?.response?.data?.message[0]
          : err?.response?.data?.message;
      return thunkApi.rejectWithValue(msg);
    }
  }
);

const AuthSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    clearAlert: (state) => {
      return {
        ...state,
        isLoading: false,
        showAlert: false,
        alertText: "",
        alertType: "",
      };
    },
    displayAlert: (state, action) => {
      const { alertText, alertType } = action.payload;
      return {
        ...state,
        showAlert: true,
        alertText: alertText,
        alertType: alertType,
      };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(register.pending, (state, action) => {
      state.isLoading = true;
      state.showAlert = true;
      state.alertText = "Creating your account...";
      state.alertType = "info";
    }),
      builder.addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.showAlert = true;
        state.alertText = "Please verify your email address";
        state.alertType = "info";
      }),
      builder.addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.showAlert = true;
        state.alertText = action.payload as string;
        state.alertType = "error";
      });
  },
});

export const { clearAlert, displayAlert } = AuthSlice.actions;

export default AuthSlice.reducer;

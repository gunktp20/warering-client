/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../services/api";
import { jwtDecode } from "jwt-decode";
import {
  IAuthState,
  ILogin,
  IRegister,
  IResetPass,
  AddUserFunc,
  AccessTokenPayload,
} from "./types";

const user = localStorage.getItem("user");
const token = localStorage.getItem("token");

const initialState: IAuthState = {
  user: user ? JSON.parse(user) : null,
  token: token || null,
  isLoading: false,
  showAlert: false,
  alertText: "",
  alertType: "",
};

const addUserToLocalStorage: AddUserFunc = (user, token) => {
  localStorage.setItem("user", JSON.stringify(user));
  localStorage.setItem("token", token);
};
const removeUserFromLocalStorage = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
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
export const login = createAsyncThunk(
  "auth/login",
  async (userInfo: ILogin, thunkApi) => {
    try {
      const response = await api.post("/auth/login", userInfo);
      const { username } = userInfo;
      return {
        ...response.data,
        user: {
          username,
        },
      };
    } catch (err: any) {
      const msg =
        typeof err?.response?.data?.message === "object"
          ? err?.response?.data?.message[0]
          : err?.response?.data?.message;
      return thunkApi.rejectWithValue(msg);
    }
  }
);

export const forgetPassword = createAsyncThunk(
  "auth/forget-password",
  async (email: string | undefined, thunkApi) => {
    try {
      const response = await api.get(`/auth/forget-password/${email}`);
      return response.data;
    } catch (err: any) {
      const msg =
        typeof err?.response?.data?.msg === "object"
          ? err?.response?.data?.msg[0]
          : err?.response?.data?.msg;
      return thunkApi.rejectWithValue(msg);
    }
  }
);

export const resetPassword = createAsyncThunk(
  "auth/reset-password",
  async (resetPassInfo: IResetPass, thunkApi) => {
    try {
      const { token, newPassword } = resetPassInfo;
      const response = await api.post(`/auth/reset-password/${token}`, {
        newPassword,
      });
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

export const refreshToken = createAsyncThunk(
  "auth/refresh-token",
  async (_: void, thunkApi: any) => {
    try {
      const response = await api.get(`/auth/refresh`);
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
    logout: (state) => {
      removeUserFromLocalStorage();
      return {
        ...state,
        user: null,
        token: "",
      };
    },
    setCredential: (state, action) => {
      return {
        ...state,
        token: action.payload,
      };
    },
    demoAuth: (state) => {
      return {
        ...state,
        user: {
          username: "demo",
          firstname: "demo",
          lastname: "demo",
          email: "demo_email@gmail.com",
          roles: ["user"],
        },
        token: "demo_app",
      };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(register.pending, (state) => {
      state.isLoading = true;
      state.showAlert = true;
      state.alertText = "Creating your account...";
      state.alertType = "info";
    }),
      builder.addCase(register.fulfilled, (state) => {
        state.isLoading = false;
        state.showAlert = true;
        state.alertText = "Created your account and Please verify your email";
        state.alertType = "success";
      }),
      builder.addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.showAlert = true;
        state.alertText = action.payload as string;
        state.alertType = "error";
      }),
      builder.addCase(login.pending, (state) => {
        state.isLoading = true;
      }),
      builder.addCase(login.fulfilled, (state, action) => {
        const { user, access_token } = action.payload;
        const decoded: AccessTokenPayload | undefined = access_token
          ? jwtDecode(access_token)
          : undefined;
        const roles = decoded?.roles || [];
        user.roles = roles;
        state.isLoading = false;
        state.user = user;
        state.token = access_token;
        addUserToLocalStorage(user, access_token);
      }),
      builder.addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.showAlert = true;
        state.alertText = action.payload as string;
        state.alertType = "error";
      }),
      builder.addCase(forgetPassword.pending, (state) => {
        state.isLoading = true;
      }),
      builder.addCase(forgetPassword.fulfilled, (state) => {
        state.isLoading = false;
        state.showAlert = true;
        state.alertText = "Reset password was check in your email";
        state.alertType = "success";
      }),
      builder.addCase(forgetPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.showAlert = true;
        state.alertText = action.payload as string;
        state.alertType = "error";
      }),
      builder.addCase(resetPassword.pending, (state) => {
        state.isLoading = true;
      }),
      builder.addCase(resetPassword.fulfilled, (state) => {
        state.isLoading = false;
        state.showAlert = true;
        state.alertText =
          "Your password has been reset . Try with new password";
        state.alertType = "success";
      }),
      builder.addCase(resetPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.showAlert = true;
        state.alertText = action.payload as string;
        state.alertType = "error";
      });
    builder.addCase(refreshToken.pending, (state) => {
      state.isLoading = true;
    }),
      builder.addCase(refreshToken.fulfilled, (state, action) => {
        state.isLoading = false;
        state.showAlert = true;
        state.alertText = "";
        state.alertType = "";
        state.token = action.payload.access_token;
      }),
      builder.addCase(refreshToken.rejected, (state, action) => {
        state.isLoading = false;
        state.showAlert = true;
        state.alertText = action.payload as string;
        state.alertType = "error";
      });
    // builder.addCase(logout.pending, (state) => {
    //   state.isLoading = true;
    // }),
    //   builder.addCase(logout.fulfilled, (state) => {
    //     state.isLoading = false;
    //     state.showAlert = false;
    //     state.alertText = "";
    //     state.alertType = "";
    //     state.token = "";
    //     state.user = null;
    //   }),
    //   builder.addCase(logout.rejected, (state, action) => {
    //     state.isLoading = false;
    //     state.showAlert = true;
    //     state.alertText = action.payload as string;
    //     state.alertType = "error";
    //   });
  },
});

export const { logout, clearAlert, displayAlert, setCredential, demoAuth } =
  AuthSlice.actions;

export default AuthSlice.reducer;

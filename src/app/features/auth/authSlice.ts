import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IAuthState {
  user: {
    username: string;
    firstname: string;
    lastname: string;
    email: string;
  } | null;
  token: string | null;
  isLoading: boolean;
  showAlert: boolean;
  alertText: string;
  alertType: string;
}
const initialState: IAuthState = {
  user: null,
  token: "",
  isLoading: false,
  showAlert: false,
  alertText: "",
  alertType: "",
};
export interface IRegister {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirm_password: string;
}
export interface ILogin {
  username: string;
  password: string;
}
export interface ISetupUser {
  endPoint: "login" | "register" | "forget-pass";
  msg?: string;
}
const AuthSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    register: (state, action: PayloadAction<IRegister>) => {
      return;
    },
    login: (state, action: PayloadAction<ILogin>) => {
      return;
    },
    setupUserBegin: (state, action: PayloadAction<ISetupUser>) => {
      switch (action.payload.endPoint) {
        case "login":
          return {
            ...state,
            isLoading: true,
          };
        case "register":
          return {
            ...state,
            isLoading: true,
            showAlert: true,
            alertText: "Created your account already",
            alertType: "primary",
          };
      }
    },
    setupUserSuccess: (state, action: PayloadAction<ISetupUser>) => {
      switch (action.payload.endPoint) {
        case "login":
          return {
            ...state,
            isLoading: false,
            showAlert: true,
            alertText: action.payload.msg
              ? action.payload.msg
              : "Login success",
            alertType: "success",
          };
        case "register":
          return {
            ...state,
            isLoading: false,
            showAlert: true,
            alertText: action.payload.msg
              ? action.payload.msg
              : "Register success",
            alertType: "success",
          };
        default:
      }
    },
    setupUserError: (state, action: PayloadAction<ISetupUser>) => {
      switch (action.payload.endPoint) {
        case "login":
          return {
            ...state,
            isLoading: false,
            showAlert: true,
            alertText: action.payload.msg ? action.payload.msg : "Login error",
            alertType: "danger",
          };
        case "register":
          return {
            ...state,
            isLoading: false,
            showAlert: true,
            alertText: action.payload.msg
              ? action.payload.msg
              : "Register error",
            alertType: "danger",
          };
      }
    },
    clearAlert: (state) => {
      return {
        ...state,
        isLoading: false,
        showAlert: false,
        alertText: "",
        alertType: "",
      };
    },
  },
});

export const {
  register,
  login,
  setupUserBegin,
  setupUserSuccess,
  setupUserError,
  clearAlert,
} = AuthSlice.actions;

export default AuthSlice.reducer;

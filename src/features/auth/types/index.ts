export interface IAuthState {
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
  alertType: "error" | "success" | "info" | "warning" | "";
}

export interface IRegister {
  username: string;
  firstName: string | undefined;
  lastName: string | undefined;
  email: string | undefined;
  password: string;
  confirm_password: string | undefined;
}

export interface ILogin {
  username: string;
  password: string;
}
export interface ISetupUser {
  endPoint: "login" | "register" | "forget-pass";
  msg?: string;
}

export interface ForgetPass {
  email: string | undefined;
}

export interface IResetPass {
  token: string | undefined;
  newPassword: string | undefined;
}

export type AddUserFunc = (user: { username: string }, token: string) => void;

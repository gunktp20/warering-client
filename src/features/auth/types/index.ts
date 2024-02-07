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
    alertType: "error" | "success" | "info" | "warning" ;
  }
  
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
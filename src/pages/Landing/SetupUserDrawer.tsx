import { Drawer, Box, Typography, Alert, Button } from "@mui/material";
import { FormRow } from "../../components";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  handleChange,
  displayAlert,
  clearAlert,
  register,
  login,
  forgetPassword,
  toggleTermActive
} from "../../features/auth/authSlice";
import { IoArrowBackSharp } from "react-icons/io5";

interface IDrawer {
  isDrawerOpen: boolean;
  setIsDrawerOpen: (active: boolean) => void;
  setIsMember: (member: boolean) => void;
  isMember: boolean;
}

function SetupUserDrawer(props: IDrawer) {
  const navigate = useNavigate();
  const { isDrawerOpen, setIsDrawerOpen, setIsMember, isMember } = props;
  const { isLoading, showAlert, alertText, alertType } = useAppSelector(
    (state) => state.auth
  );
  const { username, firstName, lastName, email, password, confirm_password, email_forget_password } = useAppSelector((state) => state.auth)
  const [isForgetPassword, setIsForgetPassword] = useState<boolean>(false);
  const [isAcceptTerm, setIsAcceptTerm] = useState<boolean>(false);

  const dispatch = useAppDispatch();

  const showDisplayAlert = (
    alertType: "warning" | "error" | "info" | "success",
    alertText: string
  ) => {
    dispatch(
      displayAlert({
        alertType,
        alertText,
      })
    );
    setTimeout(() => {
      dispatch(clearAlert());
    }, 4000);
  };

  const onSubmit = async () => {

    if (isForgetPassword) {
      if (!email_forget_password) {
        showDisplayAlert("error", "Please provide an email");
        return;
      }
      await dispatch(forgetPassword(email_forget_password));
      return;
    }
    
    if(!username){
      showDisplayAlert("error", "Username is required");
      return;
    }
    if(!password){
      showDisplayAlert("error", "Password is required");
      return;
    }

    if(!firstName && !isMember){
      showDisplayAlert("error", "E-mail is required");
      return;
    }

    if(!lastName && !isMember){
      showDisplayAlert("error", "E-mail is required");
      return;
    }

    if(!email && !isMember){
      showDisplayAlert("error", "E-mail is required");
      return;
    }

    if(!confirm_password && !isMember){
      showDisplayAlert("error", "Confirm password is required");
      return;
    }

    if (!isMember && confirm_password !== password) {
      showDisplayAlert("error", "Confirm password should be the same password");
      return;
    }

    if (!isMember && !isAcceptTerm) {
      showDisplayAlert("error", "You must accept term and condition before");
      return;
    }

    if (isMember) {
      const responseLogin = await dispatch(login({ username, password }));
      if (responseLogin.meta.requestStatus === "fulfilled") {
        navigate("/");
        return;
      }
      return;
    } else {
      await dispatch(register({ username, firstName, lastName, email, password, confirm_password }));
      return;
    }
  };

  const authHandleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(handleChange(event))
  }

  return (
    <div>
      <Drawer
        anchor="right"
        open={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
          setIsForgetPassword(false);
        }}
        className="sm:hidden"
        PaperProps={{ id: "setup-user-drawer" }}
        id="setup-user-drawer"
      >
        <Box p={2} width="420px" textAlign="left" role="presentation">
          <Typography variant="h6" component="div" className="p-5 pb-0">
            {isForgetPassword ? (
              <div>
                <div onClick={() => {
                  setIsForgetPassword(false)
                }} className="text-[10px] cursor-pointer flex text-primary-900 mb-6" id="forget-pass-back-btn">
                  <IoArrowBackSharp className="text-sm mr-2" />
                  Back</div>
                <h3 className="text-left text-[27px] mt-1 font-bold mb-2 text-[#1D4469]" id="forget-password-drawer-title">
                  Forget your password ?
                </h3>
                <div className="text-[12px] text-[#0000009d] mb-3">
                  Input your e-mail address of your account
                </div>

                {showAlert && alertType && (
                  <Alert
                    severity={alertType}
                    sx={{ fontSize: "11.8px", alignItems: "center" }}
                    id="alert-forget-password-drawer"
                  >
                    {alertText}
                  </Alert>
                )}


                <FormRow
                  type="text"
                  name="email_forget_password"
                  labelText="Email"
                  value={email_forget_password}
                  handleChange={authHandleChange}
                />
                <Button
                  onClick={() => {
                    onSubmit();
                  }}
                  style={{
                    textTransform: "none",
                    width: "100%",
                    height: "39px",
                    marginTop: "1.5rem",
                  }}
                  sx={{
                    bgcolor: "#1966fb",
                    ":hover": {
                      bgcolor: "#10269C"
                    },
                    ":disabled": {
                      color: "#fff",
                    }
                  }}
                  variant="contained"
                  disabled={isLoading}
                  id="forget-pass-drawer-submit"
                >
                  {isLoading ? "Loading..." : "Continue"}
                </Button>
              </div>
            ) : (
              <div>
                <h3 className="text-left text-[27px] mt-1 font-bold mb-3 text-[#1D4469]" id="setup-user-drawer-title">
                  {isMember ? "Sign In" : "Sign Up"}
                </h3>
                {showAlert && alertType && (
                  <Alert
                    severity={alertType}
                    sx={{ fontSize: "11.8px", alignItems: "center" }}
                    id="alert-setup-user-drawer"
                  >
                    {alertText}
                  </Alert>
                )}
                <FormRow
                  type="text"
                  name="username"
                  value={username}
                  handleChange={authHandleChange}
                />
                {!isMember && (
                  <FormRow
                    type="text"
                    name="firstName"
                    labelText="firstname"
                    value={firstName}
                    handleChange={authHandleChange}
                  />
                )}
                {!isMember && (
                  <FormRow
                    type="text"
                    name="lastName"
                    labelText="lastname"
                    value={lastName}
                    handleChange={authHandleChange}
                  />
                )}
                {!isMember && (
                  <FormRow
                    type="text"
                    name="email"
                    labelText="email"
                    value={email}
                    handleChange={authHandleChange}
                  />
                )}
                <FormRow
                  type="password"
                  name="password"
                  value={password}
                  handleChange={authHandleChange}
                />
                {!isMember && (
                  <FormRow
                    type="password"
                    name="confirm_password"
                    labelText="confirm password"
                    value={confirm_password}
                    handleChange={authHandleChange}
                  />
                )}
                {!isMember && (
                  <div className="flex items-center">
                    <input
                      id="agree-term-and-conditions-drawer-checkbox"
                      type="checkbox"
                      value=""
                      onClick={() => setIsAcceptTerm(!isAcceptTerm)}
                      checked={isAcceptTerm}
                      className="w-[13px] h-[13px] text-[#2CB1BC] bg-gray-100 border-gray-300 rounded focus:ring-[#fff] dark:focus:ring-[#2CB1BC] dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <label
                      htmlFor="link-checkbox"
                      className="flex ms-2 text-[11.5px] font-medium text-gray-900 dark:text-gray-300"
                    >
                      I agree with the{" "}
                      <div
                        id="terms-and-conditions-btn"
                        onClick={() => {
                          dispatch(toggleTermActive())
                        }}
                        className="ml-[0.35rem] text-[#3173B1] dark:text-[#3173B1] hover:underline cursor-pointer"
                      >
                        terms and conditions
                      </div>
                    </label>
                  </div>
                )}
                {isMember && (
                  <div className="flex justify-end items-center">
                    <div className="flex items-center">
                      <button
                        onClick={() => {
                          setIsForgetPassword(true);
                          dispatch(clearAlert());
                        }}
                        className="cursor-pointer ms-2 text-[11.5px] text-[#3173B1] font-bold"
                        id="forget-pass-drawer-btn"
                      >
                        Forget Password ?
                      </button>
                    </div>
                  </div>
                )}
                <Button
                  onClick={() => {
                    onSubmit();
                  }}
                  style={{
                    textTransform: "none",
                    width: "100%",
                    height: "39px",
                    marginTop: "1.5rem",
                  }}
                  sx={{
                    bgcolor: "#1966fb",
                    ":hover": {
                      bgcolor: "#10269C"
                    },
                    ":disabled": {
                      color: "#fff",
                    }
                  }}
                  variant="contained"
                  disabled={isLoading}
                  id="setup-user-drawer-submit"
                >
                  {isLoading ? "Loading..." : isMember ? "Sign In" : "Sign Up"}
                </Button>

                <div className="flex mt-4 justify-end pr-2">
                  <p className="text-[12px] text-[#333]">
                    {isMember ? "Not a member yet?" : "Already a member?"}
                  </p>

                  <button
                    className="text-[12px] ml-2 text-[#3173B1] bg-none cursor-pointer"
                    onClick={() => {
                      setIsMember(!isMember);
                      dispatch(clearAlert());
                    }}
                    id="toggle-setup-user-endpoint-drawer-btn"
                  >
                    {isMember ? "SignUp" : "SignIn"}
                  </button>
                </div>
              </div>
            )}
          </Typography>
        </Box>
      </Drawer>
    </div>
  );
}

export default SetupUserDrawer;

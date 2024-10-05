import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import {
  login,
  register,
  forgetPassword,
  clearAlert,
  displayAlert,
  toggleTermActive,
} from "../../features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { useNavigate } from "react-router-dom";
import { FormRow } from "../../components";
import { Alert, Button } from "@mui/material";
import { handleChange } from "../../features/auth/authSlice";
import { IoArrowBackSharp } from "react-icons/io5";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface IDrawer {
  isDrawerOpen: boolean;
  setIsDrawerOpen: (active: boolean) => void;
  setIsMember: (member: boolean) => void;
  isMember: boolean;
}

export default function DialogMui({ isDrawerOpen, setIsDrawerOpen, setIsMember, isMember }: IDrawer) {
  const { isLoading, showAlert, alertText, alertType } = useAppSelector(
    (state) => state.auth
  );

  const navigate = useNavigate();
  const [isForgetPassword, setIsForgetPassword] = useState<boolean>(false);
  const { username, firstName, lastName, email, password, confirm_password, email_forget_password } = useAppSelector((state) => state.auth)
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
      showDisplayAlert("error", "First name is required");
      return;
    }

    if(!lastName && !isMember){
      showDisplayAlert("error", "Last name is required");
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

  const handleClose = () => {
    setIsDrawerOpen(false);
    setIsForgetPassword(false);
  };

  return (
    <div>
      <Dialog
        open={isDrawerOpen}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
        fullScreen
        className="m-5 hidden sm:block"
        id="setup-user-landing-dialog"
        sx={{
          zIndex: "200"
        }}
      >
        <DialogContent>
          <DialogContentText
            id="setup-user-landing-dialog-content"
            className="p-3 "
            component={"div"}
            variant={"body2"}
          >
            <div
              onClick={handleClose}
              className="cursor-pointer absolute top-2 right-3 text-[21px]"
              id="close-setup-user-dialog-btn"
            >
              X
            </div>
            {isForgetPassword ? (
              <div>
                <div onClick={() => {
                  setIsForgetPassword(false)
                }} className="text-[10px] cursor-pointer flex text-primary-900 mb-6" id="forget-pass-back-btn">
                  <IoArrowBackSharp className="text-sm mr-2" />
                  Back</div>
                <h3 className="text-left text-[27px] mt-1 font-bold mb-2 text-[#1D4469]" id="forget-password-title">
                  Forget your password ?
                </h3>
                <div className="text-[12px] text-[#0000009d] mb-3">
                  Input your e-mail address of your account
                </div>

                {showAlert && alertType && (
                  <Alert
                    severity={alertType}
                    sx={{ fontSize: "11.8px", alignItems: "center" }}
                  >
                    {alertText}
                  </Alert>
                )}

                <FormRow
                  type="text"
                  id="email_forget_password_dialog"
                  name="email_forget_password"
                  labelText="Email"
                  value={email_forget_password}
                  handleChange={handleChange}
                />

                <Button
                  onClick={() => {
                    onSubmit();
                  }}
                  style={{
                    textTransform: "none",
                    width: "100%",
                    height: "39px",
                    marginTop: "1rem",
                  }}
                  sx={{
                    bgcolor: "#1966fb",
                    ":hover": {
                      bgcolor: "#10269C",
                    },
                    ":disabled": {
                      color: "#fff",
                    },
                  }}
                  variant="contained"
                  disabled={isLoading}
                  id="forget-pass-submit"
                >
                  {isLoading ? "Loading..." : "Continue"}
                </Button>
              </div>
            ) : (
              <div>
                <h3 id="endpoint-set-up-user-title-dialog" className="text-left text-[27px] mt-1 font-bold mb-3 text-[#1D4469]">
                  {isMember ? "Sign In" : "Sign Up"}
                </h3>

                {showAlert && alertType && (
                  <Alert
                    severity={alertType}
                    sx={{ fontSize: "11.8px", alignItems: "center" }}
                  >
                    {alertText}
                  </Alert>
                )}

                <FormRow
                  type="text"
                  name="username"
                  id="username_dialog"
                  value={username}
                  handleChange={authHandleChange}
                />

                {!isMember && (
                  <FormRow
                    type="text"
                    name="firstName"
                    id="firstName_dialog"
                    labelText="firstname"
                    value={firstName}
                    handleChange={authHandleChange}
                  />
                )}
                {!isMember && (
                  <FormRow
                    type="text"
                    name="lastName"
                    id="lastName_dialog"
                    labelText="lastname"
                    value={lastName}
                    handleChange={authHandleChange}
                  />
                )}
                {!isMember && (
                  <FormRow
                    type="text"
                    name="email"
                    id="email_dialog"
                    labelText="email"
                    value={email}
                    handleChange={authHandleChange}
                  />
                )}

                <FormRow
                  type="password"
                  name="password"
                  id="password_dialog"
                  value={password}
                  handleChange={authHandleChange}
                />

                {!isMember && (
                  <FormRow
                    type="password"
                    name="confirm_password"
                    id="confirm_password_dialog"
                    labelText="confirm password"
                    value={confirm_password}
                    handleChange={authHandleChange}
                  />
                )}

                {!isMember && (
                  <div className="flex items-center">
                    <input
                      id="agree-terms-and-conditions-checkbox"
                      type="checkbox"
                      value=""
                      onClick={() => setIsAcceptTerm(!isAcceptTerm)}
                      checked={isAcceptTerm}
                      className="w-[13px] h-[13px] text-[#2CB1BC] bg-gray-100 border-gray-300 rounded focus:ring-[#fff]"
                    />
                    <label
                      htmlFor="link-checkbox"
                      className="flex ms-2 text-[11.5px] font-medium text-gray-900 dark:text-gray-300"
                    >
                      I agree with the{" "}
                      <div
                        onClick={() => {
                          dispatch(toggleTermActive())
                        }}
                        className="ml-[0.35rem] text-[#3173B1] hover:underline cursor-pointer"
                        id="toggle-terms-conditions-dialog-btn"
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
                        id="toggle-forget-pass-dialog-btn"
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
                    marginTop: "1rem",
                  }}
                  sx={{
                    bgcolor: "#1966fb",
                    ":hover": {
                      bgcolor: "#10269C",
                    },
                    ":disabled": {
                      color: "#fff",
                    },
                  }}
                  variant="contained"
                  disabled={isLoading}
                  id="endpoint-setup-user-submit-dialog-btn"
                >
                  {isLoading ? "Loading..." : isMember ? "Sign In" : "Sign Up"}
                </Button>
                <div className="flex mt-4 justify-end pr-2">
                  <p className="text-[12px] text-[#333]" id="toggle-setup-user-note">
                    {isMember ? "Not a member yet?" : "Already a member?"}
                  </p>
                  <button
                    id="toggle-endpoint-setup-user-dialog-btn"
                    className="text-[12px] ml-2 text-[#3173B1] bg-none cursor-pointer"
                    onClick={() => {
                      setIsMember(!isMember);
                      dispatch(clearAlert());
                    }}
                  >
                    {isMember ? "SignUp" : "SignIn"}
                  </button>
                </div>
              </div>
            )}
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </div>
  );
}

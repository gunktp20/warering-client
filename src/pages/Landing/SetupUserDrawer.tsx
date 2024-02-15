import { Drawer, Box, Typography, Alert } from "@mui/material";
import { FormRow } from "../../components";
import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  displayAlert,
  clearAlert,
  register,
  login,
  forgetPassword,
} from "../../features/auth/authSlice";
import { Link } from "react-router-dom";

interface IDrawer {
  isDrawerOpen: boolean;
  setIsDrawerOpen: (active: boolean) => void;
  setIsMember: (member: boolean) => void;
  isMember: boolean;
}

interface IValue {
  username: string;
  firstName: string | undefined;
  lastName: string | undefined;
  email: string | undefined;
  password: string;
  confirm_password: string | undefined;
  email_forget_password: string | undefined;
}

const initialState: IValue = {
  username: "",
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirm_password: "",
  email_forget_password: "",
};

function SetupUserDrawer(props: IDrawer) {
  const { isDrawerOpen, setIsDrawerOpen, setIsMember, isMember } = props;
  const { isLoading, showAlert, alertText, alertType } = useAppSelector(
    (state) => state.auth
  );

  const [values, setValues] = useState<IValue>(initialState);
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const onSubmit = async () => {
    const {
      username,
      firstName,
      lastName,
      email,
      password,
      confirm_password,
      email_forget_password,
    } = values;

    if (isForgetPassword) {
      if (!email_forget_password) {
        showDisplayAlert("error", "Please provide an email");
        return;
      }
      await dispatch(forgetPassword(email_forget_password));
      return;
    }

    if (
      !username ||
      !password ||
      (!firstName && !isMember) ||
      (!lastName && !isMember) ||
      (!email && !isMember) ||
      (!confirm_password && !isMember)
    ) {
      showDisplayAlert("error", "Please provide all value");
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
      dispatch(login(values));
      return;
    } else {
      dispatch(register(values));
      return;
    }
  };

  useEffect(() => {
    dispatch(clearAlert());
  }, []);

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
      >
        <Box p={2} width="420px" textAlign="left" role="presentation">
          <Typography variant="h6" component="div" className="p-5 pb-0">
            {isForgetPassword ? (
              <div>
                <h3 className="text-left text-[27px] mt-1 font-bold mb-2 text-[#1D4469]">
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
                  name="email_forget_password"
                  labelText="Email"
                  value={values.email_forget_password}
                  handleChange={handleChange}
                />

                <button
                  className="btn btn-primary text-[12px]"
                  id="forget-pass-submit"
                  onClick={onSubmit}
                  disabled={isLoading}
                >
                  {isLoading ? "Loading..." : "Continue"}
                </button>
              </div>
            ) : (
              <div>
                <h3 className="text-left text-[27px] mt-1 font-bold mb-3 text-[#1D4469]">
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
                  value={values.username}
                  handleChange={handleChange}
                />

                {!isMember && (
                  <FormRow
                    type="text"
                    name="firstName"
                    labelText="firstname"
                    value={values.firstName}
                    handleChange={handleChange}
                  />
                )}
                {!isMember && (
                  <FormRow
                    type="text"
                    name="lastName"
                    labelText="lastname"
                    value={values.lastName}
                    handleChange={handleChange}
                  />
                )}
                {!isMember && (
                  <FormRow
                    type="text"
                    name="email"
                    labelText="email"
                    value={values.email}
                    handleChange={handleChange}
                  />
                )}

                <FormRow
                  type="password"
                  name="password"
                  value={values.password}
                  handleChange={handleChange}
                />

                {!isMember && (
                  <FormRow
                    type="password"
                    name="confirm_password"
                    labelText="confirm password"
                    value={values.confirm_password}
                    handleChange={handleChange}
                  />
                )}

                {!isMember && (
                  <div className="flex items-center">
                    <input
                      id="accept-term-btn"
                      type="checkbox"
                      value=""
                      onClick={() => setIsAcceptTerm(!isAcceptTerm)}
                      checked={isAcceptTerm}
                      className="w-[13px] h-[13px] text-[#2CB1BC] bg-gray-100 border-gray-300 rounded focus:ring-[#fff] dark:focus:ring-[#2CB1BC] dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <label
                      htmlFor="link-checkbox"
                      className="ms-2 text-[11.5px] font-medium text-gray-900 dark:text-gray-300"
                    >
                      I agree with the{" "}
                      <Link
                        to="/term-condition"
                        className="text-[#3173B1] dark:text-[#3173B1] hover:underline"
                      >
                        terms and conditions
                      </Link>
                    </label>
                  </div>
                )}

                {isMember && (
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <input
                        id="link-checkbox"
                        type="checkbox"
                        value=""
                        className="w-[13px] h-[13px] text-[#2CB1BC] bg-gray-100 border-gray-300 rounded focus:ring-[#ffffff00] dark:focus:ring-[#2CB1BC] dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />
                      <label
                        htmlFor="link-checkbox"
                        className="ms-2 text-[11.5px] font-medium text-gray-900 dark:text-gray-300"
                      >
                        Remember me
                      </label>
                    </div>
                    <div className="flex items-center">
                      <div
                        onClick={() => {
                          setIsForgetPassword(true);
                          dispatch(clearAlert());
                        }}
                        className="cursor-pointer ms-2 text-[11.5px] text-[#3173B1] font-bold"
                        id="forget-pass-btn"
                      >
                        Forget Password ?
                      </div>
                    </div>
                  </div>
                )}

                <button
                  onClick={() => {
                    onSubmit();
                  }}
                  className="btn btn-primary text-[14px]"
                  disabled={isLoading}
                  id="setup-user-submit"
                >
                  {isLoading ? "Loading..." : isMember ? "Sign In" : "Sign Up"}
                </button>
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
                    id="toggle-endpoint"
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

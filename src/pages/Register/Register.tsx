import Wrapper from "../../assets/wrappers/Login";
import { useState, FunctionComponent, useEffect } from "react";
import { FormRow } from "../../components";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  register,
  clearAlert,
  displayAlert,
} from "../../features/auth/authSlice";
import { TermAndCondition } from ".";
import { IValue } from "./types";
import { Alert } from "../../components";
import { validateEmail } from "../../utils/validateEmail";

const Register: FunctionComponent = () => {
  const { isLoading, showAlert, alertText, alertType } = useAppSelector(
    (state) => state.auth
  );
  const dispatch = useAppDispatch();

  const initialState: IValue = {
    username: "gunktp14",
    firstName: "kuttapat",
    lastName: "somwang",
    email: "arrliver@gmail.com",
    password: "!Kuttapatz1",
    confirm_password: "!Kuttapatz1",
  };

  const [values, setValues] = useState(initialState);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const clearValue = () => {
    setTimeout(() => {
      dispatch(clearAlert());
    }, 8000);
  };

  const onSubmit = async () => {
    const { username, firstName, lastName, email, password, confirm_password } =
      values;
    if (
      !username ||
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !confirm_password
    ) {
      dispatch(
        displayAlert({
          alertType: "error",
          alertText: "Please provide all value",
        })
      );
      clearValue();
      return;
    }

    await dispatch(register(values));
    clearValue();
  };
  
  useEffect(() => {
    clearValue();
  }, []);

  return (
    <Wrapper>
      <div className="form-main w-[400px] rounded-md">
        <h3 className="text-left text-[27px] mt-1 font-bold mb-3 text-[#1D4469]">
          Sign Up
        </h3>
        {showAlert && alertType === "info" && (
          <Alert alertText={alertText} alertType="info" />
        )}

        {showAlert && alertType === "error" && (
          <Alert alertText={alertText} alertType="error" />
        )}

        {showAlert && alertType === "success" && (
          <Alert alertText={alertText} alertType="success" />
        )}

        <FormRow
          type="text"
          name="username"
          value={values.username}
          handleChange={handleChange}
        />

        <FormRow
          type="text"
          name="firstName"
          labelText="firstname"
          value={values.firstName}
          handleChange={handleChange}
        />

        <FormRow
          type="text"
          name="lastName"
          labelText="lastname"
          value={values.lastName}
          handleChange={handleChange}
        />

        <FormRow
          type="email"
          name="email"
          value={values.email}
          handleChange={handleChange}
        />
        <FormRow
          type="password"
          name="password"
          value={values.password}
          handleChange={handleChange}
        />
        <FormRow
          type="password"
          name="confirm_password"
          value={values.confirm_password}
          handleChange={handleChange}
          labelText="confirm password"
        />

        <TermAndCondition />

        <button
          onClick={onSubmit}
          className="btn btn-primary"
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : "Sign Up"}
        </button>
        <div className="flex mt-5 justify-end pr-2">
          <p className="text-[12px] text-[#333]">Already a member?</p>
          <Link
            to="/login"
            type="button"
            className="text-[12px] ml-2 text-[#3173B1] bg-none"
          >
            SignIn
          </Link>
        </div>
      </div>
    </Wrapper>
  );
};

export default Register;

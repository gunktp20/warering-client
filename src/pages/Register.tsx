import Wrapper from "../assets/wrappers/Login";
import { useState, FunctionComponent, useEffect } from "react";
import { FormRow } from "../components";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  setupUserSuccess,
  setupUserError,
  clearAlert,
} from "../app/features/auth/authSlice";

const Register: FunctionComponent = () => {
  const { showAlert, alertText, alertType } = useAppSelector(
    (state) => state.auth
  );
  const dispatch = useAppDispatch();

  interface IValue {
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirm_password: string;
  }
  const initialState: IValue = {
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirm_password: "",
  };

  const [values, setValues] = useState(initialState);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const clearValue = () => {
    setTimeout(() => {
      dispatch(clearAlert());
    }, 3000);
  };

  const onSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
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
        setupUserError({
          endPoint: "register",
          msg: "Please provide all value",
        })
      );
      clearValue();
      return;
    }
    dispatch(
      setupUserSuccess({
        endPoint: "register",
        msg: "Created your account already",
      })
    );
  };

  useEffect(() => {
    dispatch(clearAlert());
  }, []);

  return (
    <Wrapper>
      <div className="form-main w-[400px] rounded-md">
        <h3 className="text-left text-[27px] mt-1 font-bold mb-3 text-[#1D4469]">
          Sign Up
        </h3>
        {showAlert && alertType === "danger" && (
          <div className="alert alert-danger">{alertText}</div>
        )}
        {showAlert && alertType === "success" && (
          <div className="alert alert-success">{alertText}</div>
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
          type="text"
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

        <div className="flex items-center">
          <input
            id="link-checkbox"
            type="checkbox"
            value=""
            className="w-[13px] h-[13px] text-[#2CB1BC] bg-gray-100 border-gray-300 rounded focus:ring-[#fff] dark:focus:ring-[#2CB1BC] dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
          />
          <label
            htmlFor="link-checkbox"
            className="ms-2 text-[11.5px] font-medium text-gray-900 dark:text-gray-300"
          >
            I agree with the{" "}
            <a
              href="#"
              className="text-[#3173B1] dark:text-[#3173B1] hover:underline"
            >
              terms and conditions
            </a>
            .
          </label>
        </div>

        <button onClick={onSubmit} className="btn btn-primary">
          Sign Up
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

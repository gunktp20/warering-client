import Wrapper from "../assets/wrappers/Login";
import { useState, useEffect, FunctionComponent } from "react";
import { FormRow } from "../components";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { clearAlert } from "../features/auth/authSlice";

const Login: FunctionComponent = () => {

  const dispatch = useAppDispatch();
  interface IValue {
    username: string;
    password: string;
  }

  const initialState: IValue = {
    username: "",
    password: "",
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

  const onSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    const { username, password } = values;
    if (!username || !password) {
      clearValue();
      return;
    }

    clearValue();
    return;
  };

  useEffect(() => {
    dispatch(clearAlert());
  }, []);

  return (
    <Wrapper>
      <div className="form-main w-[400px] rounded-md">
        <h3 className="text-left text-[27px] mt-1 font-bold mb-3 text-[#1D4469]">
          Sign In
        </h3>

        <FormRow
          type="text"
          name="username"
          value={values.username}
          handleChange={handleChange}
        />
        <FormRow
          type="password"
          name="password"
          value={values.password}
          handleChange={handleChange}
        />

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
            <Link
              to="/forget-pass"
              className="ms-2 text-[11.5px] text-[#3173B1] font-bold"
            >
              Forget Password ?
            </Link>
          </div>
        </div>

        <button onClick={onSubmit} className="btn btn-primary">
          Sign In
        </button>
        <div className="flex mt-5 justify-end pr-2">
          <p className="text-[12px] text-[#333]">Not a member yet?</p>
          <Link
            to="/register"
            className="text-[12px] ml-2 text-[#3173B1] bg-none"
          >
            SignUp
          </Link>
        </div>
      </div>
    </Wrapper>
  );
};

export default Login;

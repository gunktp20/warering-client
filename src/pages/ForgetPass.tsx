import Wrapper from "../assets/wrappers/Login";
import React, { useState, FunctionComponent, useEffect } from "react";
import { FormRow } from "../components";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  setupUserError,
  clearAlert,
} from "../app/features/auth/authSlice";

const ForgetPass: FunctionComponent = () => {
  const { isLoading, showAlert, alertText, alertType } = useAppSelector(
    (state) => state.auth
  );
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const clearValue = () => {
    setTimeout(() => {
      dispatch(clearAlert());
    }, 3000);
  };

  const onSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!email) {
      dispatch(
        setupUserError({ endPoint: "login", msg: "Please provide all value" })
      );
      clearValue();
      return;
    }
  };

  useEffect(() => {
    dispatch(clearAlert());
  }, []);

  return (
    <Wrapper>
      <div className="form-main w-[400px] rounded-md">
        <h3 className="text-left text-[27px] mt-1 font-bold mb-3 text-[#1D4469]">
          Forget your password ?
        </h3>
        <div className="text-[12px] text-[#0000009d]">
          Please enter your E-mail address
        </div>
        {showAlert && alertType === "danger" && (
          <div className="alert alert-danger">{alertText}</div>
        )}
        {showAlert && alertType === "success" && (
          <div className="alert alert-success">{alertText}</div>
        )}
        <FormRow
          type="text"
          name="email"
          labelText="Email"
          value={email}
          handleChange={handleChange}
        />

        <button className="btn btn-primary" onClick={onSubmit}>
          Continue
        </button>
      </div>
    </Wrapper>
  );
};

export default ForgetPass;

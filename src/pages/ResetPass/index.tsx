import React, { useState } from "react";
import { Alert } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { FormRow } from "../../components";
import Wrapper from "../../assets/wrappers/ResetPass";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
    resetPassword,
    displayAlert,
    clearAlert,
} from "../../features/auth/authSlice";

interface IValue {
    newPassword: string;
}

const ResetPass = () => {
    const dispatch = useAppDispatch();

    const { isLoading, showAlert, alertText, alertType } = useAppSelector(
        (state) => state.auth
    );

    const navigate = useNavigate();

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

    const backHomePage = () => {
        navigate("/");
    };

    const { token } = useParams();

    const [values, setValues] = useState<IValue>({
        newPassword: "",
    });

    const onSubmit = () => {
        if (!values.newPassword) {
            showDisplayAlert("error", "Please provide a new password");
            return;
        }
        dispatch(resetPassword({ token, newPassword: values.newPassword }));
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValues({ ...values, [e.target.name]: e.target.value });
    };

    return (
        <Wrapper>
            <div className="relative top-[13rem] h-fit p-10 rounded-md w-[400px] bg-white shadow-lg">
                <h3 className="text-left text-[27px] mt-1 font-bold mb-2 text-[#1D4469]">
                    Reset your password
                </h3>
                <div className="text-[12px] text-[#0000009d] mb-2">
                    Please enter your new password
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
                    type="password"
                    labelText="New password"
                    name="newPassword"
                    value={values.newPassword}
                    handleChange={handleChange}
                />
                <button
                    className="btn btn-primary text-[12px]"
                    onClick={onSubmit}
                    id="reset-password-submit"
                >
                    {isLoading ? "Loading..." : "Reset Password"}
                </button>
                <button
                    onClick={backHomePage}
                    className="transition-[0.2s] w-full h-[38px] rounded-md mt-5 text-[12px] border-[#1966fb] border-[1px] text-[#1966fb]"
                    id="back-home-btn"
                >
                    Back to Home Page
                </button>
            </div>
        </Wrapper>
    );
};

export default ResetPass;

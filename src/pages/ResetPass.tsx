import React, { useEffect, useState } from 'react'
import { redirect, useParams } from 'react-router-dom'
import { FormRow } from '../components'
import Wrapper from "../assets/wrappers/ResetPass"
import { useAppDispatch } from '../app/hooks'
import { resetPassword, displayAlert, clearAlert } from '../features/auth/authSlice'

interface IValue {
    newPassword: string
}

const ResetPass = () => {

    const dispatch = useAppDispatch();

    const showDisplayAlert = (alertType: "warning" | "error" | "info" | "success", alertText: string) => {
        dispatch(displayAlert({
            alertType,
            alertText,
        }))
        setTimeout(() => {
            dispatch(clearAlert());
        }, 4000);
    }

    const { token } = useParams();
    
    if (token === undefined) {
        return <div>111q</div>
    }
    
    const [values, setValues] = useState<IValue>({
        newPassword: ""
    })

    const onSubmit = () => {

        if (!values.newPassword) {
            showDisplayAlert("error", "Please provide a new password");
            return;
        }
        dispatch(resetPassword({ token, newPassword: values.newPassword }))
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValues({ ...values, [e.target.name]: e.target.value });
    };


    return (
        <Wrapper>
            <div className="p-10 rounded-md w-[400px] bg-white shadow-lg">
                <h3 className="text-left text-[27px] mt-1 font-bold mb-3 text-[#1D4469]">
                    Reset your password
                </h3>
                <div className="text-[12px] text-[#0000009d]">
                    Please enter your new password
                </div>
                <FormRow
                    type="text"
                    labelText='New password'
                    name="newPassword"
                    value={values.newPassword}
                    handleChange={handleChange}
                />

                <button className="btn btn-primary text-[12px]" onClick={onSubmit}>
                    Reset Password
                </button>
            </div>
        </Wrapper>
    )
}

export default ResetPass

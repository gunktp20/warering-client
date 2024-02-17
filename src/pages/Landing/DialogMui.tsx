import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import { login, register, forgetPassword, clearAlert, displayAlert } from '../../features/auth/authSlice';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { Link } from 'react-router-dom';
import { FormRow } from '../../components';
import { Alert } from "@mui/material";

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

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
}

const initialState: IValue = {
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirm_password: "",
};

export default function AlertDialogSlide(props: IDrawer
) {

    const { isDrawerOpen, setIsDrawerOpen, setIsMember, isMember } = props;
    const { isLoading, showAlert, alertText, alertType } = useAppSelector(
        (state) => state.auth
    );

    const [values, setValues] = useState<IValue>(initialState);
    const [isForgetPassword, setIsForgetPassword] = useState<boolean>(false)
    const [isAcceptTerm, setIsAcceptTerm] = useState<boolean>(false)

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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValues({ ...values, [e.target.name]: e.target.value });
    };

    const onSubmit = async () => {
        const { username, firstName, lastName, email, password, confirm_password } =
            values;

        if (isForgetPassword) {
            if (!email) {
                showDisplayAlert("error", "Please provide an email");
                return;
            }
            await dispatch(forgetPassword(email))
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
            dispatch(login(values))
            return;
        } else {
            dispatch(register(values))
            return;
        }

    };

    const handleClose = () => {
        setIsDrawerOpen(false);
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
                className='m-5 hidden sm:block'
            >
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description" className='p-3 '>
                        <div onClick={handleClose} className="cursor-pointer absolute top-2 right-3 text-[21px]">X</div>
                        {isForgetPassword ? <div>
                            <h3 className="text-left text-[27px] mt-1 font-bold mb-2 text-[#1D4469]">
                                Forget your password ?
                            </h3>
                            <div className="text-[12px] text-[#0000009d] mb-3">
                                Input your e-mail address of your account
                            </div>

                            {(showAlert && alertType) && (
                                <Alert severity={alertType} sx={{ fontSize: "11.8px", alignItems: "center" }}>{alertText}</Alert>
                            )}

                            <FormRow
                                type="text"
                                name="email"
                                labelText="Email"
                                value={values.email}
                                handleChange={handleChange}
                            />

                            <button className="btn btn-primary text-[12px]" onClick={onSubmit} disabled={isLoading}>
                                {isLoading ? "Loading..." : "Continue"}
                            </button>
                        </div> :
                            <div>

                                <h3 className="text-left text-[27px] mt-1 font-bold mb-3 text-[#1D4469]">
                                    {isMember ? "Sign In" : "Sign Up"}
                                </h3>

                                {(showAlert && alertType) && (
                                    <Alert severity={alertType} sx={{ fontSize: "11.8px", alignItems: "center" }}>{alertText}</Alert>
                                )}

                                <FormRow type="text" name="username" value={values.username} handleChange={handleChange} />

                                {!isMember && <FormRow type="text" name="firstName" labelText="firstname" value={values.firstName} handleChange={handleChange} />}
                                {!isMember && <FormRow type="text" name="lastName" labelText="lastname" value={values.lastName} handleChange={handleChange} />}
                                {!isMember && <FormRow type="text" name="email" labelText="email" value={values.email} handleChange={handleChange} />}

                                <FormRow type="password" name="password" value={values.password} handleChange={handleChange} />

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
                                            id="link-checkbox"
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
                                            <div onClick={() => {
                                                setIsForgetPassword(true)
                                                dispatch(clearAlert())
                                            }} className="cursor-pointer ms-2 text-[11.5px] text-[#3173B1] font-bold">
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
                                            dispatch(clearAlert())
                                        }}
                                    >
                                        {isMember ? "SignUp" : "SignIn"}

                                    </button>
                                </div>
                            </div>
                        }
                    </DialogContentText>
                </DialogContent>
            </Dialog >
        </div>
    );
}
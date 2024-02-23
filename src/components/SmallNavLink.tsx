import { Drawer, Box, Typography, Alert, Button } from "@mui/material";
import { FormRow } from "./index.tsx";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PiNotebookBold } from "react-icons/pi";
import { VscGraph } from "react-icons/vsc";
import { NavLink } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
    displayAlert,
    clearAlert,
    register,
    login,
    forgetPassword,
    refreshToken,
} from "../features/auth/authSlice";
import { Link } from "react-router-dom";
import { FiCpu } from "react-icons/fi";

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

function SmallNavLinks(props: IDrawer) {
    const navigate = useNavigate();

    const { isDrawerOpen, setIsDrawerOpen, setIsMember, isMember } = props;
    // const { isLoading, showAlert, alertText, alertType } = useAppSelector(
    //     (state) => state.auth
    // );

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
            const responseLogin = await dispatch(login(values));
            if (responseLogin.meta.requestStatus === "fulfilled") {
                navigate("/");
            }
            return;
        } else {
            await dispatch(register(values));
            return;
        }
    };

    return (
        <div>
            <Drawer
                anchor="left"
                open={isDrawerOpen}
                onClose={() => {
                    setIsDrawerOpen(false);
                    setIsForgetPassword(false);
                }}
                className="hidden sm:block"
                PaperProps={{ id: "setup-user-drawer" }}
            >
                <Box p={2} width="420px" textAlign="left" role="presentation">
                    <Typography variant="h6" component="div" className="p-5 pb-0">
                        <NavLink
                            to="/"
                            key={1}
                            onClick={() => {

                            }}
                            className={({ isActive }) =>
                                `flex pl-10 p-5 items-center text-[14px] ${isActive ? "text-[#1966fb]" : "text-[#1d4469]"}`
                            }
                        >
                            <PiNotebookBold className="mr-3 text-[16px]" />
                            Overview
                        </NavLink>

                        <NavLink
                            to="/dashboard-list"
                            key={1}
                            onClick={() => {

                            }}
                            className={({ isActive }) =>
                                `flex pl-10 p-5 items-center text-[14px] ${isActive ? "text-[#1966fb]" : "text-[#1d4469]"}`
                            }
                        >
                            <VscGraph className="mr-3 text-[16px]" />
                            Dashboard
                        </NavLink>

                        <NavLink
                            to="/device"
                            key={1}
                            onClick={() => {

                            }}
                            className={({ isActive }) =>
                                `flex pl-10 p-5 items-center text-[14px] ${isActive ? "text-[#1966fb]" : "text-[#1d4469]"}`
                            }
                        >
                            <FiCpu className="mr-3 text-[16px]" />
                            Devices
                        </NavLink>
                    </Typography>
                </Box>
            </Drawer>
        </div>
    );
}

export default SmallNavLinks;

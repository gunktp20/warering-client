import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import { FormRow, SnackBar } from "../../components";
import getAxiosErrorMessage from "../../utils/getAxiosErrorMessage";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import useAlert from "../../hooks/useAlert";
import { Alert } from "@mui/material";

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement;
    },
    ref: React.Ref<unknown>
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

interface IDrawer {
    isShowChangePassDialog: boolean;
    setIsShowChangePassDialog: (status: boolean) => void;
    onUpdatedPasswordSuccess: () => void
}

interface IValue {
    current_password: string
    new_password: string
    confirm_new_password: string
}

const initialState: IValue = {
    current_password: "",
    new_password: "",
    confirm_new_password: ""
}

export default function ChangePasswordDialog({
    isShowChangePassDialog,
    setIsShowChangePassDialog,
    onUpdatedPasswordSuccess
}: IDrawer) {
    const axiosPrivate = useAxiosPrivate()
    const [values, setValues] = useState<IValue>(initialState)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const { showAlert, alertText, alertType, displayAlert } = useAlert()

    const handleClose = () => {
        setValues(initialState)
        setIsShowChangePassDialog(false)
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValues({ ...values, [e.target.name]: e.target.value });
    };

    const onSubmit = async () => {
        const { current_password, new_password, confirm_new_password } = values

        if (!current_password || !current_password.trim()) {
            return displayAlert({ msg: "current password is required", type: "error" });
        } else if (!new_password || !new_password.trim()) {
            return displayAlert({ msg: "new password is required", type: "error" });
        } else if (!confirm_new_password || !confirm_new_password.trim()) {
            return displayAlert({ msg: "confirm new password is required", type: "error" });
        }

        if (new_password !== confirm_new_password) {
            return displayAlert({ msg: "confirm password must be the same with new password", type: "error" })
        }

        return changePassword()
    }

    const changePassword = async () => {
        setIsLoading(true)
        try {
            await axiosPrivate.post("/users/reset-password", { passwordNew: values.new_password, passwordOld: values.current_password })
            setIsLoading(false)
            handleClose()
            return onUpdatedPasswordSuccess()
        } catch (err: unknown) {
            const msg = await getAxiosErrorMessage(err)
            setIsLoading(false)
            return displayAlert({ msg, type: "error" })
        }
    }

    return (
        <div>
            <Dialog
                open={isShowChangePassDialog}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                aria-describedby="alert-dialog-slide-description"
                id="change-password-dialog"
            >
                <DialogContent>
                    <DialogContentText
                        id="change-password-dialog-content"
                        className="p-3 "
                        component={"div"}
                        variant={"body2"}
                    >
                        <div className=" w-[100%] relative flex flex-col">
                            <div
                                id="edit-device-title"
                                className="text-[18px] mb-2 font-bold text-[#1D4469]"
                            >
                                <div className="change-password-title">Change password</div>

                            </div>
                            {showAlert && alertType && (
                                <div className="hidden sm:block">
                                    <Alert
                                        id="change-password-alert"
                                        severity={alertType}
                                        sx={{
                                            fontSize: "11.8px",
                                            alignItems: "center",
                                            marginTop: "2rem",
                                        }}
                                    >
                                        {alertText}
                                    </Alert>
                                </div>
                            )}
                            <div className="w-[100%] mt-6">
                                <FormRow
                                    type="password"
                                    name="current_password"
                                    labelText="current password"
                                    value={values.current_password}
                                    handleChange={handleChange}
                                    marginTop="mt-[0.2rem]"
                                    placeHolderSize="12px"
                                />
                            </div>
                            <div className="w-[100%] mt-1">
                                <FormRow
                                    type="password"
                                    name="new_password"
                                    labelText="new password"
                                    value={values.new_password}
                                    handleChange={handleChange}
                                    marginTop="mt-[0.2rem]"
                                    placeHolderSize="12px"
                                />
                            </div>
                            <div className="w-[100%] mt-1">
                                <FormRow
                                    type="password"
                                    name="confirm_new_password"
                                    labelText="Repeat new password"
                                    value={values.confirm_new_password}
                                    handleChange={handleChange}
                                    marginTop="mt-[0.2rem]"
                                    placeHolderSize="12px"
                                />
                            </div>
                            <div className="w-[420px] sm:w-[320px]">
                                <button onClick={onSubmit} disabled={isLoading} className="flex items-center justify-center hover:bg-primary-700 hover:text-white transition-all w-[200px] border-[1px] sm:w-[100%] mt-4 border-primary-500 rounded-md h-[40px] text-[12.3px] text-primary-500">{isLoading ? <div className="loader text-gray-200 w-[20px] h-[20px]"></div> : "Updated Password"}</button>
                            </div>
                        </div>
                        {showAlert && (
                            <div className="block sm:hidden">
                                <SnackBar
                                    id="change-password-snack-bar"
                                    severity={alertType}
                                    showSnackBar={showAlert}
                                    snackBarText={alertText}
                                />
                            </div>
                        )}
                    </DialogContentText>
                </DialogContent>
            </Dialog>
        </div>
    );
}

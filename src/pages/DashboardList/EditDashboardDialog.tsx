import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import { FormRow } from "../../components";
import { Button } from "@mui/material";

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

interface IDrawer {
    isEditDialogOpen: boolean;
    setEditDialogOpen: (active: boolean) => void;
}

interface IValue {
    dashboard_name: string;
    description: string | undefined;
}

const initialState: IValue = {
    dashboard_name: "Smart Home",
    description: "ภายในบ้าน",
};

export default function EditDashboardDialog(props: IDrawer) {
    const { setEditDialogOpen } = props;
    const [values, setValues] = useState<IValue>(initialState);
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValues({ ...values, [e.target.name]: e.target.value });
    };

    const handleClose = () => {
        setEditDialogOpen(false);
    };

    return (
        <div>
            <Dialog
                open={props.isEditDialogOpen}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                aria-describedby="alert-dialog-slide-description"

                className="m-5 "
            >
                <DialogContent>
                    <DialogContentText
                        id="alert-dialog-slide-description"
                        className="p-3 "
                        component={"div"}
                        variant={"body2"}
                    >
                        <div className=" w-[100%] flex flex-col">
                            <div className="text-[18px] font-bold text-[#1D4469]">Edit Dashboard</div>
                            <div className="text-sm text-[#a4a4a4] mt-3">Fill in the information to add a Dashboard from your device.</div>
                        </div>
                        <div className="flex gap-10 mt-9 sm:flex-col sm:gap-0">
                            <div className="w-[350px] sm:w-[100%]">
                                <FormRow
                                    type="text"
                                    name="dashboard_name"
                                    labelText="Dashboard name"
                                    value={values.dashboard_name}
                                    handleChange={handleChange}
                                    marginTop="mt-[0.2rem]"
                                />
                            </div>
                            <div className="w-[350px] sm:w-[100%]">
                                <FormRow
                                    type="text"
                                    name="description"
                                    labelText="description"
                                    value={values.description}
                                    handleChange={handleChange}
                                    marginTop="mt-[0.2rem]"
                                />
                            </div>
                        </div>
                        <div className="w-[250px] sm:w-[100%]">
                            <Button
                                onClick={() => {

                                }}
                                style={{
                                    textTransform: "none",
                                    width: "100%",
                                    height: "39px",
                                    marginTop: "1.5rem",
                                }}
                                sx={{
                                    bgcolor: "#1966fb",
                                    ":hover": {
                                        bgcolor: "#10269C"
                                    },
                                    ":disabled": {
                                        color: "#fff",
                                    }
                                }}
                                variant="contained"
                                id="setup-user-submit"
                            >
                                Add Dashboard
                            </Button>
                        </div>
                    </DialogContentText>
                </DialogContent>
            </Dialog>
        </div>
    );
}

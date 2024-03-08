import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogContentText from "@mui/material/DialogContentText";
import DialogContent from "@mui/material/DialogContent";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import { FormRow, SnackBar } from "../../components";
import { GaugePreview } from "../../components/widgets_preview";
import { Button } from "@mui/material";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { Alert } from "@mui/material";

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

interface IProps {
    isAddWidgetShow: boolean;
    setIsAddWidgetShow: (active: boolean) => void;
    nameDevice: string;
    fetchAllWidgets: () => void;
}

export default function AddWidgetDialog(props: IProps) {
    const [occupation, setOccupation] = useState<string>("");
    const axiosPrivate = useAxiosPrivate();
    const [timeoutIds, setTimeoutIds] = useState<any>([]);
    const [showSnackBar, setShowSnackBar] = useState<boolean>(false);
    const [snackBarText, setSnackBarText] = useState<string>("");
    const [snackBarType, setSnackBarType] = useState<
        "error" | "success" | "info" | "warning"
    >("error");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const handleClose = () => {
        setOccupation("");
        props.setIsAddWidgetShow(false);
    };

    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] =
        useState<boolean>(false);
    const [values, setValues] = useState<any>({
        label: "",
        value: "",
        min: 0,
        max: 100,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValues({ ...values, [e.target.name]: e.target.value });
    };
    // Function to clear all running timeouts
    const clearAllTimeouts = () => {
        timeoutIds.forEach((timeoutId: any) => clearTimeout(timeoutId));
        setTimeoutIds([]); // Clear the timeout IDs from state
    };
    // Function to set a new timeout
    const clearAlert = () => {
        clearAllTimeouts(); // Clear existing timeouts before setting a new one
        const newTimeoutId = setTimeout(() => {
            // Your timeout function logic here
            setShowSnackBar(false);
        }, 3000);
        setTimeoutIds([newTimeoutId]); // Store the new timeout ID in state
    };

    const onSubmit = () => {
        const { label, value, min, max } = values;
        console.log("value", value)
        if (occupation === "Gauge" && (!label || !value || !min || !max)) {
            setShowSnackBar(true);
            setSnackBarType("error");
            setSnackBarText("Please provide all value!");
            clearAlert();
            return;
        }
        createWidget();
    };

    const createWidget = async () => {
        setIsLoading(true);
        try {
            const { data } = await axiosPrivate.post(`/widgets`, {
                nameDevice: props?.nameDevice,
                type: occupation,
                configWidget: {
                    value: values.value,
                    min: Number(values.min),
                    max: Number(values.max)
                },
            });
            console.log(data)
            setShowSnackBar(true);
            setSnackBarType("success");
            setSnackBarText("Created your widget successfully");
            clearAlert();
            setIsLoading(false);
            props.setIsAddWidgetShow(false)
            props.fetchAllWidgets();
        } catch (err: any) {
            const msg =
                typeof err?.response?.data?.message === "object"
                    ? err?.response?.data?.message[0]
                    : err?.response?.data?.message;
            setShowSnackBar(true);
            setSnackBarType("error");
            setSnackBarText(msg);
            clearAlert();
            setIsLoading(false);
        }
    };

    return (
        <div>
            <Dialog
                open={props.isAddWidgetShow}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogContent>
                    <DialogContentText
                        id="alert-dialog-slide-description"
                        className="p-3"
                        component={"div"}
                        variant={"body2"}
                    >
                        <div className="w-[100%] flex flex-col">
                            <div className="text-[17px] font-bold text-[#1D4469]">
                                Add widget
                            </div>
                            <div className="text-[12px] mt-2">
                                Please select widget occupation and provide your values.
                            </div>
                        </div>
                        {showSnackBar && snackBarType && (
                            <div className="hidden sm:block">
                                <Alert
                                    severity={snackBarType}
                                    sx={{
                                        fontSize: "11.8px",
                                        alignItems: "center",
                                        marginTop: "1.5rem",
                                    }}
                                >
                                    {snackBarText}
                                </Alert>
                            </div>
                        )}

                        <div className="pb-2 sm:w-[100%] mt-5">
                            <label className="text-[12px] text-[#000]">Occupation</label>
                            <select
                                id="select_widget"
                                className="bg-gray-50 w-[250px] sm:w-[100%] border border-gray-300 mt-1 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block px-5 py-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                value={occupation}
                                onChange={(e) => {
                                    setOccupation(e?.target.value);
                                }}
                            >
                                <option>select widget</option>
                                <option value="Gauge">Gauge</option>
                            </select>
                        </div>
                        {occupation === "Gauge" && (
                            <>
                                <div className="flex gap-10 mt-11 sm:flex-col sm:gap-0 relative">
                                    <div className="text-[#1d4469] text-[12.3px] font-bold absolute top-[-1.9rem]">
                                        Configuration
                                    </div>
                                    <div className="w-[350px] sm:w-[100%]">
                                        <FormRow
                                            type="text"
                                            name="label"
                                            labelText="Label"
                                            value={values.label}
                                            handleChange={handleChange}
                                            marginTop="mt-[0.2rem]"
                                        />
                                    </div>
                                    <div className="w-[350px] sm:w-[100%] relative">

                                        {/* <div className="text-[#db2f2fb2] text-[10.2px] absolute top-[-0.4rem] right-0">
                        Need to provide min and max.
                      </div> */}

                                        <FormRow
                                            type="text"
                                            name="value"
                                            labelText="value"
                                            value={values.value}
                                            handleChange={handleChange}
                                            marginTop="mt-[0.2rem]"
                                        />
                                    </div>
                                </div>
                                <div className="flex gap-10 mt-3 sm:flex-col sm:gap-0">
                                    <div className="w-[350px] sm:w-[100%]">
                                        <FormRow
                                            type="number"
                                            name="min"
                                            labelText="min"
                                            value={values.min}
                                            handleChange={handleChange}
                                            marginTop="mt-[0.2rem]"
                                        />
                                    </div>
                                    <div className="w-[350px] sm:w-[100%]">
                                        <FormRow
                                            type="number"
                                            name="max"
                                            labelText="max"
                                            value={values.max}
                                            handleChange={handleChange}
                                            marginTop="mt-[0.2rem]"
                                        />
                                    </div>
                                </div>
                                <div className=" w-[100%] flex flex-col">
                                    <div className="font-bold text-[#767676] text-[12px]">
                                        Preview
                                    </div>
                                </div>
                                <div className="flex gap-10 mt-5 sm:flex-col sm:gap-0 w-[100%]">
                                    <GaugePreview
                                        label={values.label}
                                        min={0}
                                        max={100}
                                        value={50}
                                    />
                                </div>

                                <div className="flex">
                                    <div className="w-[250px] sm:w-[100%] mr-5">
                                        <Button
                                            onClick={() => {
                                                handleClose();
                                            }}
                                            style={{
                                                textTransform: "none",
                                                width: "100%",
                                                height: "39px",
                                                marginTop: "1.5rem",
                                            }}
                                            sx={{
                                                // bgcolor: "#1966fb",
                                                ":hover": {
                                                    //   bgcolor: "#10269C",
                                                },
                                                ":disabled": {
                                                    color: "#fff",
                                                },
                                            }}
                                            variant="outlined"
                                            id="setup-user-submit"
                                        >
                                            Cancel
                                        </Button>
                                    </div>
                                    <div className="w-[250px] sm:w-[100%]">
                                        <Button
                                            onClick={() => {
                                                onSubmit();
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
                                                    bgcolor: "#10269C",
                                                },
                                                ":disabled": {
                                                    color: "#fff",
                                                },
                                            }}
                                            variant="contained"
                                            id="setup-user-submit"
                                            disabled={isLoading}
                                        >
                                            Done
                                        </Button>
                                    </div>
                                    {showSnackBar && (
                                        <div className="block sm:hidden">
                                            <SnackBar
                                                severity={snackBarType}
                                                showSnackBar={showSnackBar}
                                                snackBarText={snackBarText}
                                                setShowSnackBar={setShowSnackBar}
                                            />
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                    </DialogContentText>
                </DialogContent>
            </Dialog>
        </div>
    );
}

import React, { useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogContentText from "@mui/material/DialogContentText";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import useAlert from "../../hooks/useAlert";
import { FormRow, SnackBar } from "../../components";
import { Button } from "@mui/material";

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement;
    },
    ref: React.Ref<unknown>
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

interface IProps {
    isSelectDeviceActive: boolean;
    setIsSelectDeviceActive: (active: boolean) => void;
    setSelectedDevice: (device_id: string) => void;
    selectedDevice: string;
    getPayloadsByDeviceId: (device_id: string, payload_key: string) => void;
    hookDeleteSuccess: () => void;
}

export default function SelectDeviceDialog({ isSelectDeviceActive, setIsSelectDeviceActive, setSelectedDevice, selectedDevice, getPayloadsByDeviceId }: IProps) {
    const axiosPrivate = useAxiosPrivate();
    const { showAlert, alertText, alertType, displayAlert } = useAlert()
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const fetchAllDevice = async () => {
        setIsLoading(true);
        try {
            const { data } = await axiosPrivate.get(`/devices?limit=100`);
            setDeivceOptions(data?.data);
            return setIsLoading(false);
        } catch (err: unknown) {
            return setIsLoading(false);
        }
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [values, setValues] = useState<{ [key: string]: any }>({ payload_key: "" });
    const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        setValues({ ...values, [event?.target?.name]: event?.target.value })
    }
    const onSubmit = () => {
        const { payload_key } = values
        if (!selectedDevice) {
            displayAlert({ msg: "Please select a device", type: "error" })
            return;
        }
        if (!payload_key) {
            displayAlert({ msg: "Please provide all value", type: "error" })
            return;
        }

        getPayloadsByDeviceId(selectedDevice, payload_key)
        handleClose()

    }

    const handleClose = () => {
        if (isLoading) {
            return;
        }
        setIsSelectDeviceActive(false);
    };

    const [deivceOptions, setDeivceOptions] = useState<
        { id: string; nameDevice: string }[]
    >([]);

    useEffect(() => {
        fetchAllDevice()
    }, [])

    return (
        <React.Fragment>
            <Dialog
                open={isSelectDeviceActive}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                id="select-device-visualization-dialog"
            >
                <DialogContentText
                    id="select-device-visualization-dialog-content"
                    className="py-7 px-11"
                    component={"div"}
                    variant={"body2"}
                >
                    <div className="w-[100%] flex flex-col">
                        <div
                            className="text-[17px] font-bold text-[#1D4469]"
                            id="select-device-visualization-title"
                        >
                            Visualization
                        </div>

                        <div className="text-[12px] mt-2">
                            select device and pod line chart from payloads
                        </div>
                    </div>
                    <div className="w-[100%]">
                        {/* select device */}
                        <div className=" pb-2 sm:w-[100%] mt-3">
                            <label className="text-[12px] text-[#000]">Device</label>
                            <select
                                id="input-select-device-visualization"
                                disabled={deivceOptions.length === 0 ? true : false}
                                className={`device bg-gray-50 w-[100%] sm:w-[100%] border border-gray-300 mt-1 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block px-5 py-2`}
                                value={selectedDevice}
                                onChange={(e) => {
                                    setSelectedDevice(e?.target.value);
                                }}
                            >
                                <option value={""} disabled>
                                    select device...
                                </option>
                                {deivceOptions.map((device, index) => {
                                    return (
                                        <option key={"device" + index} value={device?.id}>
                                            {device?.nameDevice}
                                        </option>
                                    );
                                })}
                            </select>
                        </div>
                        {/* key of value for pod line chart */}
                        <div className="w-[350px] sm:w-[100%] mt-5">
                            <FormRow
                                type="string"
                                name="payload_key"
                                labelText="Key of payload"
                                value={values.payload_key}
                                handleChange={handleChange}
                                marginTop="mt-[0.2rem]"
                                placeHolderSize="11px"
                            />
                        </div>
                    </div>
                    <button
                        id="insert-label-btn"
                        className="py-1 text-[12px] text-primary-800 border-white rounded-md border-[1px] px-3 hover:border-primary-800 transition-all"
                    >
                        Insert Label +
                    </button>
                    <div className="flex">
                        <div className="w-[100%] sm:w-[100%]">
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
                                    // bgcolor: "#1966fb",
                                    ":hover": {
                                        //   bgcolor: "#10269C",
                                    },
                                    ":disabled": {
                                        color: "#fff",
                                    },
                                }}
                                variant="outlined"
                                id="visualize-submit-btn"
                            >
                                Done
                            </Button>
                        </div>
                    </div>

                    {showAlert && (
                        <div className="block sm:hidden">
                            <SnackBar
                                id="select-device-visualization-snack-bar"
                                severity={alertType}
                                showSnackBar={showAlert}
                                snackBarText={alertText}
                            />
                        </div>
                    )}
                </DialogContentText>
            </Dialog>
        </React.Fragment>
    );
}

import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogContentText from "@mui/material/DialogContentText";
import DialogContent from "@mui/material/DialogContent";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import {
    FormControl,
    InputLabel,
    Select,
    OutlinedInput,
} from "@mui/material";
import FormRow from "../../components/FormRow";
import { Gauge } from "../../components/widgets_device";
import { GaugePreview } from "../../components/widgets_preview"

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
}

// const handleChange = (event: SelectChangeEvent<typeof age>) => {
//     setAge(Number(event.target.value) || '');
//   };

export default function AddWidgetDialog(props: IProps) {

    const handleClose = () => {
        props.setIsAddWidgetShow(false);
    };

    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] =
        useState<boolean>(false);
    const [values, setValues] = useState<any>({
        label: "",
        value: "",
        min: 0,
        max: 100,
    })
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValues({ ...values, [e.target.name]: e.target.value });
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
                        className="p-3 "
                        component={"div"}
                        variant={"body2"}
                    >
                        <div className=" w-[100%] flex flex-col mb-4">
                            <div className="text-[17px] font-bold text-[#1D4469]">
                                Add widget
                            </div>
                            {/* <div className="text-sm text-[#a4a4a4] mt-3">
                                Fill in the information to add a Dashboard from your device.
                            </div> */}
                        </div>
                        <div className="pb-2 sm:w-[100%]">
                            <label className="text-[12px] text-[#000]">Occupation</label>
                            <select
                                id="select_widget"
                                className="bg-gray-50 w-[200px] border border-gray-300 mt-1 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block px-5 py-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                defaultValue={""}
                                onChange={(e) => {

                                }}
                            >
                                <option>select widget</option>
                                <option value="Gauge">Gauge</option>
                            </select>
                        </div>

                        <div className="flex gap-10 mt-11 sm:flex-col sm:gap-0 relative">
                            <div className="text-[#1d4469] text-[12.3px] font-bold absolute top-[-1.9rem]">Configuration</div>
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
                            <div className="w-[350px] sm:w-[100%]">
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
                                    type="text"
                                    name="min"
                                    labelText="min"
                                    value={values.min}
                                    handleChange={handleChange}
                                    marginTop="mt-[0.2rem]"
                                />
                            </div>
                            <div className="w-[350px] sm:w-[100%]">
                                <FormRow
                                    type="text"
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
                        <div className="flex gap-10 mt-5 sm:flex-col sm:gap-0">
                            <div className="w-[300px]">
                                <GaugePreview
                                    label={values.label}
                                    min={values.min}
                                    max={values.max}
                                    value={values.value}
                                />
                            </div>
                        </div>

                        <div className="flex sm:flex-col">
                            <div className="w-[250px] sm:w-[100%] mr-5">

                            </div>
                            <div className="w-[250px] sm:w-[100%]">

                            </div>

                        </div>
                    </DialogContentText>
                </DialogContent>
            </Dialog>
        </div>
    );
}

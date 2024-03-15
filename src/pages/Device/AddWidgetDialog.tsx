import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogContentText from "@mui/material/DialogContentText";
import DialogContent from "@mui/material/DialogContent";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import { FormRow, SnackBar } from "../../components";
import {
  GaugePreview,
  MessageBoxPreview,
  ButtonControlPreview,
  ToggleSwitchPreview,
  RangeSliderPreview,
} from "../../components/widgets_preview";
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

const initialState = {
  label: "",
  value: "",
  min: 0,
  max: 100,
  unit: "",
  payload: '{ "key":value , "key":value }',
  button_label: "",
  on_payload: "",
  off_payload: "",
};

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
    setValues(initialState);
    props.setIsAddWidgetShow(false);
  };
  const [values, setValues] = useState<any>(initialState);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };
  const clearAllTimeouts = () => {
    timeoutIds.forEach((timeoutId: any) => clearTimeout(timeoutId));
    setTimeoutIds([]);
  };
  const clearAlert = () => {
    clearAllTimeouts();
    const newTimeoutId = setTimeout(() => {
      setShowSnackBar(false);
    }, 3000);
    setTimeoutIds([newTimeoutId]);
  };
  const onSubmit = () => {
    const { label, value, min, max, unit, payload, on_payload, off_payload } =
      values;
    const widgetInfo: any = {};
    if (occupation === "Gauge" && (!label || !value || !min || !max || !unit)) {
      setShowSnackBar(true);
      setSnackBarType("error");
      setSnackBarText("Please provide all value!");
      clearAlert();
      return;
    }
    if(occupation === "Gauge" && min > max){
      setShowSnackBar(true);
      setSnackBarType("error");
      setSnackBarText("min value must be < max value");
      clearAlert();
      return;
    }
    if (occupation === "ButtonControl" && (!label || !payload)) {
      setShowSnackBar(true);
      setSnackBarType("error");
      setSnackBarText("Please provide all value!");
      clearAlert();
      return;
    }
    if (
      occupation === "ToggleSwitch" &&
      (!label || !on_payload || !off_payload || !value)
    ) {
      setShowSnackBar(true);
      setSnackBarType("error");
      setSnackBarText("Please provide all value!");
      clearAlert();
      return;
    }
    if (
      occupation === "RangeSlider" &&
      (!label || !value || !min || !max)
    ) {
      setShowSnackBar(true);
      setSnackBarType("error");
      setSnackBarText("Please provide all value!");
      clearAlert();
      return;
    }
    if(occupation === "RangeSlider" && min > max){
      setShowSnackBar(true);
      setSnackBarType("error");
      setSnackBarText("min value must be < max value");
      clearAlert();
      return;
    }
    switch (occupation) {
      case "Gauge":
        widgetInfo.nameDevice = values?.label;
        widgetInfo.type = occupation;
        widgetInfo.configWidget = {
          value: values.value,
          min: Number(values.min),
          max: Number(values.max),
          unit: values.unit,
        };
        createWidget(widgetInfo);
        return;
      case "MessageBox":
        widgetInfo.nameDevice = values?.label;
        widgetInfo.type = occupation;
        widgetInfo.configWidget = {
          value: values.value,
          unit: values.unit,
        };
        createWidget(widgetInfo);
        return;

      case "ButtonControl":
        try {
          const replacedString = values.payload.replace(/'/g, '"');
          JSON.parse(replacedString);
          widgetInfo.nameDevice = values?.label;
          widgetInfo.type = occupation;
          widgetInfo.configWidget = {
            button_label: values.button_label,
            payload: replacedString,
          };
          createWidget(widgetInfo);
          return;
        } catch (err: any) {
          console.log(err);
          setShowSnackBar(true);
          setSnackBarType("error");
          setSnackBarText("Payload must be JSON format");
          clearAlert();
          return;
        }
      case "ToggleSwitch":
        try {
          widgetInfo.nameDevice = values?.label;
          widgetInfo.type = occupation;
          widgetInfo.configWidget = {
            value: values.value,
            on_payload: isNaN(values.on_payload)
              ? values.on_payload
              : parseInt(values.on_payload),
            off_payload: isNaN(values.off_payload)
              ? values.off_payload
              : parseInt(values.off_payload),
          };
          createWidget(widgetInfo);
          return;
        } catch (err: any) {
          console.log(err);
          setShowSnackBar(true);
          setSnackBarType("error");
          setSnackBarText("Payload must be JSON format");
          clearAlert();
          return;
        }
      case "RangeSlider":
        try {
          widgetInfo.nameDevice = values?.label;
          widgetInfo.type = occupation;
          widgetInfo.configWidget = {
            value: values.value,
            min: Number(values.min),
            max: Number(values.max),
          };
          createWidget(widgetInfo);
          return;
        } catch (err: any) {
          console.log(err);
          setShowSnackBar(true);
          setSnackBarType("error");
          setSnackBarText("Payload must be JSON format");
          clearAlert();
          return;
        }
    }
  };
  const createWidget = async (widgetInfo: any) => {
    setIsLoading(true);
    try {
      const { data } = await axiosPrivate.post(`/widgets`, widgetInfo);
      console.log(data);
      setShowSnackBar(true);
      setSnackBarType("success");
      setSnackBarText("Created your widget successfully");
      clearAlert();
      setIsLoading(false);
      props.setIsAddWidgetShow(false);
      props.fetchAllWidgets();
      setValues(initialState);
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
                <option value={""}>select widget</option>
                <option value="Gauge">Gauge</option>
                <option value="MessageBox">MessageBox</option>
                <option value="ButtonControl">Button Control</option>
                <option value="ToggleSwitch">Toggle Switch</option>
                <option value="RangeSlider">Range Slider</option>
              </select>
            </div>
            {occupation && (
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

                {occupation === "ButtonControl" && (
                  <div className="w-[350px] sm:w-[100%]">
                    <FormRow
                      type="string"
                      name="payload"
                      labelText="payload * JSON format"
                      value={values.payload}
                      handleChange={handleChange}
                      marginTop="mt-[0.2rem]"
                    />
                  </div>
                )}

                {(occupation === "Gauge" ||
                  occupation === "MessageBox" ||
                  occupation === "ToggleSwitch" ||
                  occupation === "RangeSlider") && (
                  <div className="w-[350px] sm:w-[100%] relative">
                    <FormRow
                      type="text"
                      name="value"
                      labelText="value"
                      value={values.value}
                      handleChange={handleChange}
                      marginTop="mt-[0.2rem]"
                    />
                  </div>
                )}
              </div>
            )}

            {occupation && (
              <div className="flex gap-10 mt-3 sm:flex-col sm:gap-0">
                {(occupation === "Gauge" || occupation === "RangeSlider") && (
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
                )}
                {(occupation === "Gauge" || occupation === "RangeSlider") && (
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
                )}
                {occupation === "ButtonControl" && (
                  <div className="w-[245px] sm:w-[100%]">
                    <FormRow
                      type="text"
                      name="button_label"
                      labelText="Button Label"
                      value={values.button_label}
                      handleChange={handleChange}
                      marginTop="mt-[0.2rem]"
                    />
                  </div>
                )}
                {occupation === "ToggleSwitch" && (
                  <div className="w-[245px] sm:w-[100%]">
                    <FormRow
                      type="text"
                      name="on_payload"
                      labelText="on payload"
                      value={values.on_payload}
                      handleChange={handleChange}
                      marginTop="mt-[0.2rem]"
                    />
                  </div>
                )}
                {occupation === "ToggleSwitch" && (
                  <div className="w-[245px] sm:w-[100%]">
                    <FormRow
                      type="text"
                      name="off_payload"
                      labelText="off payload"
                      value={values.off_payload}
                      handleChange={handleChange}
                      marginTop="mt-[0.2rem]"
                    />
                  </div>
                )}
              </div>
            )}

            {occupation && (
              <div className="flex gap-10 mt-3 sm:flex-col sm:gap-0">
                {(occupation === "Gauge" || occupation === "MessageBox") && (
                  <div className="w-[240px] sm:w-[100%]">
                    <FormRow
                      type="text"
                      name="unit"
                      labelText="unit"
                      value={values.unit}
                      handleChange={handleChange}
                      marginTop="mt-[0.2rem]"
                    />
                  </div>
                )}
              </div>
            )}

            {occupation && (
              <div className=" w-[100%] flex flex-col">
                <div className="font-bold text-[#767676] text-[12px]">
                  Preview
                </div>
              </div>
            )}

            {occupation === "Gauge" && (
              <div className="flex gap-10 mt-5 sm:flex-col sm:gap-0 w-[100%]">
                <GaugePreview
                  label={values.label}
                  min={0}
                  max={100}
                  value={50}
                />
              </div>
            )}
            {occupation === "MessageBox" && (
              <div className="flex gap-10 mt-5 sm:flex-col sm:gap-0 w-[100%]">
                <MessageBoxPreview
                  label={values.label}
                  value={"550,000"}
                  unit={values.unit}
                />
              </div>
            )}
            {occupation === "ButtonControl" && (
              <div className="flex gap-10 mt-5 sm:flex-col sm:gap-0 w-[100%]">
                <ButtonControlPreview
                  label={values.label}
                  button_label={values.button_label}
                />
              </div>
            )}
            {occupation === "ToggleSwitch" && (
              <div className="flex gap-10 mt-5 sm:flex-col sm:gap-0 w-[100%]">
                <ToggleSwitchPreview label={values.label} />
              </div>
            )}
            {occupation === "RangeSlider" && (
              <div className="flex gap-10 mt-5 sm:flex-col sm:gap-0 w-[100%]">
                <RangeSliderPreview label={values.label} />
              </div>
            )}

            {occupation && (
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
            )}
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </div>
  );
}

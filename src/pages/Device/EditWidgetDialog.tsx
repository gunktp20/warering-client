import React, { useEffect, useState } from "react";
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
  LineChartPreview,
} from "../../components/widgets_preview";
import { Button } from "@mui/material";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { Alert } from "@mui/material";
import getAxiosErrorMessage from "../../utils/getAxiosErrorMessage";
import useAlert from "../../hooks/useAlert";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface IProps {
  widget_id: string | undefined;
  isEditDisplayShow: boolean;
  setIsEditDisplayShow: (active: boolean) => void;
  fetchAllWidgets: () => void;
  setSelectedWidget: (_: string) => void;
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

interface IValue {
  label: string;
  value: string;
  min: number;
  max: number;
  unit: string;
  payload: string;
  button_label: string;
  on_payload: string;
  off_payload: string;
}

interface IConfigWidget {
  value?: string;
  min?: number;
  max?: number;
  unit?: string;
  button_label?: string;
  payload?: string;
  on_payload?: string | number;
  off_payload?: string | number;
}

interface IWidgetInfo {
  label: string;
  type: string;
  configWidget: IConfigWidget;
}

export default function EditWidgetDialog(props: IProps) {
  const [occupation, setOccupation] = useState<string>("");
  const axiosPrivate = useAxiosPrivate();
  const { alertType, alertText, showAlert, displayAlert } = useAlert();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const handleClose = () => {
    setOccupation("");
    setValues(initialState);
    props.setSelectedWidget("");
    props.setIsEditDisplayShow(false);
  };
  const [values, setValues] = useState<IValue>(initialState);

  const fetchWidgetInfo = async () => {
    setIsLoading(true);
    try {
      const { data } = await axiosPrivate.get(
        `/widgets/${props?.widget_id}/widget`
      );
      const deviceValues = { ...data?.configWidget, label: data?.label };
      setOccupation(data.type);
      setValues(deviceValues);
      setIsLoading(false);
    } catch (err: unknown) {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const onSubmit = () => {
    const { label, value, min, max, unit, payload, on_payload, off_payload } =
      values;
    const widgetInfo: IWidgetInfo = {
      label: "",
      type: "",
      configWidget: initialState,
    };
    if (
      occupation === "Gauge" &&
      (!label || !value || min === null || !max || !unit)
    ) {
      displayAlert({
        msg: "Please provide all values",
        type: "error",
      });
      return;
    }
    if (occupation === "Gauge" && min > max) {
      displayAlert({
        msg: "min value must be < max value",
        type: "error",
      });
      return;
    }
    if (occupation === "ButtonControl" && (!label || !payload)) {
      displayAlert({
        msg: "Please provide all values",
        type: "error",
      });
      return;
    }
    if (
      occupation === "ToggleSwitch" &&
      (!label || on_payload === null || off_payload === null || !value)
    ) {
      displayAlert({
        msg: "Please provide all values",
        type: "error",
      });
      return;
    }
    if (
      occupation === "RangeSlider" &&
      (!label || !value || min === null || !max)
    ) {
      displayAlert({
        msg: "Please provide all values",
        type: "error",
      });
      return;
    }
    if (occupation === "RangeSlider" && min > max) {
      displayAlert({
        msg: "min value must be < max value",
        type: "error",
      });
      return;
    }
    switch (occupation) {
      case "Gauge":
        widgetInfo.label = values?.label;
        widgetInfo.type = occupation;
        widgetInfo.configWidget = {
          value: values.value,
          min: Number(values.min),
          max: Number(values.max),
          unit: values.unit,
        };
        editWidget(widgetInfo);
        return;
      case "MessageBox":
        widgetInfo.label = values?.label;
        widgetInfo.type = occupation;
        widgetInfo.configWidget = {
          value: values.value,
          unit: values.unit,
        };
        editWidget(widgetInfo);
        return;

      case "ButtonControl":
        try {
          const replacedString = values.payload.replace(/'/g, '"');
          JSON.parse(replacedString);
          widgetInfo.label = values?.label;
          widgetInfo.type = occupation;
          widgetInfo.configWidget = {
            button_label: values.button_label,
            payload: replacedString,
          };
          editWidget(widgetInfo);
          return;
        } catch (err: unknown) {
          displayAlert({
            msg: "Payload must be JSON format",
            type: "error",
          });
          return;
        }
      case "ToggleSwitch":
        try {
          widgetInfo.label = values?.label;
          widgetInfo.type = occupation;
          widgetInfo.configWidget = {
            value: values.value,
            on_payload: isNaN(Number(values.on_payload))
              ? values.on_payload
              : parseInt(values.on_payload?.toString() || "0"),
            off_payload: isNaN(Number(values.off_payload))
              ? values.off_payload
              : parseInt(values.off_payload?.toString() || "0"),
          };
          editWidget(widgetInfo);
          return;
        } catch (err: unknown) {
          displayAlert({
            msg: "Payload must be JSON format",
            type: "error",
          });
          return;
        }
      case "RangeSlider":
        try {
          widgetInfo.label = values?.label;
          widgetInfo.type = occupation;
          widgetInfo.configWidget = {
            value: values.value,
            min: Number(values.min),
            max: Number(values.max),
          };
          editWidget(widgetInfo);
          return;
        } catch (err: unknown) {
          displayAlert({
            msg: "Payload must be JSON format",
            type: "error",
          });
          return;
        }
    }
  };

  const editWidget = async (widgetInfo: unknown) => {
    setIsLoading(true);
    try {
      await axiosPrivate.patch(`/widgets/${props.widget_id}`, widgetInfo);
      displayAlert({
        msg: "Edited your widget successfully",
        type: "success",
      });
      props.fetchAllWidgets();
      props.setIsEditDisplayShow(false);
      props.setSelectedWidget("");
      setIsLoading(false);
    } catch (err: unknown) {
      const msg = await getAxiosErrorMessage(err);
      displayAlert({
        msg,
        type: "error",
      });
      return setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWidgetInfo();
  }, []);

  return (
    <div>
      <Dialog
        open={props.isEditDisplayShow}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        id="edit-widget-dialog"
      >
        <DialogContent>
          <DialogContentText
            id="edit-widget-dialog-content"
            className="p-3"
            component={"div"}
            variant={"body2"}
          >
            <div className="w-[100%] flex flex-col">
              <div
                id="edit-widget-title"
                className="text-[17px] font-bold text-[#1D4469]"
              >
                Edit widget
              </div>
              <div className="text-[12px] mt-2">
                Please select widget occupation and provide your values.
              </div>
            </div>
            {showAlert && alertType && (
              <div className="hidden sm:block">
                <Alert
                  severity={alertType}
                  sx={{
                    fontSize: "11.8px",
                    alignItems: "center",
                    marginTop: "1.5rem",
                  }}
                  id="edit-widget-alert"
                >
                  {alertText}
                </Alert>
              </div>
            )}

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
                  occupation === "LineChart" ||
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
                {(occupation === "Gauge" || occupation === "RangeSlider" || occupation === "LineChart") && (
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
                {(occupation === "Gauge" || occupation === "RangeSlider" || occupation === "LineChart") && (
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
            {occupation === "LineChart" && (
              <div className="flex gap-10 mt-5 sm:flex-col sm:gap-0 w-[100%]">
                <LineChartPreview
                  label={values.label}
                  min={values.min}
                  max={values.max}
                />
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
                    id="cancel-edit-widget-btn"
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
                    id="edit-widget-submit-btn"
                    disabled={isLoading}
                  >
                    Done
                  </Button>
                </div>
                {showAlert && (
                  <div className="block sm:hidden">
                    <SnackBar
                      id="edit-widget-snackbar"
                      severity={alertType}
                      showSnackBar={showAlert}
                      snackBarText={alertText}
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

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
  LineChartPreview,
} from "../../components/widgets_preview";
import { Button } from "@mui/material";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { Alert } from "@mui/material";
import getAxiosErrorMessage from "../../utils/getAxiosErrorMessage";
import { displayAlert as displayWidgetAlert, clearAlert as clearWidgetAlert } from "../../features/widget/widgetSlice";
import { useAppDispatch } from "../../app/hooks";
import useTimeout from "../../hooks/useTimeout";
import useAlert from "../../hooks/useAlert";
import { IoMdCloseCircle } from "react-icons/io";
import { memo } from "react";

interface IWidget {
  type?: string;
  label?: string;
  configWidget?: IConfigWidget;
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
  value_1?: string,
  value_2?: string,
  value_3?: string,
  value_4?: string,
  keys?: string[];
  colors?: string[];
}
const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface IProps {
  device_id: string | undefined;
  isAddWidgetShow: boolean;
  setIsAddWidgetShow: (active: boolean) => void;
  nameDevice: string;
  fetchAllWidgets: () => void;
}

const initialState: {
  label: string;
  value: string;
  min: 0;
  max: 100;
  unit: string;
  payload: '{ "key":value , "key":value }';
  button_label: string;
  on_payload: string | number | undefined;
  off_payload: string | number | undefined;
  value_1: string,
  value_2: string,
  value_3: string,
  value_4: string,
} = {
  label: "",
  value: "",
  min: 0,
  max: 100,
  unit: "",
  payload: '{ "key":value , "key":value }',
  button_label: "",
  on_payload: "",
  off_payload: "",
  value_1: "",
  value_2: "",
  value_3: "",
  value_4: "",
};

export default memo(function AddWidgetDialog(props: IProps) {
  const dispatch = useAppDispatch()
  const { showAlert, alertText, alertType, displayAlert } = useAlert()
  const [occupation, setOccupation] = useState<string>("");
  const axiosPrivate = useAxiosPrivate();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [chuckLength, setChunkLength] = useState<number>(1);
  // values
  const [colorValue1, setColorValue1] = useState<string>("#1966fb");
  const [colorValue2, setColorValue2] = useState<string>("#19cefb");
  const [colorValue3, setColorValue3] = useState<string>("#e119fb");
  const [colorValue4, setColorValue4] = useState<string>("#fb8e19");

  const handleClose = () => {
    setOccupation("");
    setValues(initialState);
    setChunkLength(1);
    setColorValue1("#1966fb")
    setColorValue2("#19cefb")
    setColorValue3("#e119fb")
    setColorValue4("#fb8e19")
    props.setIsAddWidgetShow(false);
  };

  const [values, setValues] = useState<typeof initialState>(initialState);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const onSubmit = () => {
    const { label, value, min, max, unit, payload, button_label, on_payload, off_payload, value_1, value_2, value_3, value_4 } =
      values;
    const widgetInfo: IWidget = {}
    if (occupation === "Gauge") {

      if (!label.trim()) {
        displayAlert({ msg: "label is required", type: "error" })
        return;
      }
      if (!value.trim()) {
        displayAlert({ msg: "value is required", type: "error" })
        return;
      }
      if (min === null) {
        displayAlert({ msg: "min value is required", type: "error" })
        return;
      }
      if (!max) {
        displayAlert({ msg: "max value is required", type: "error" })
        return;
      }
      if (min > max) {
        displayAlert({ msg: "min value must be < max value", type: "error" })
        return;
      }
    }

    if (occupation === "MessageBox") {
      if (!label.trim()) {
        displayAlert({ msg: "label is required", type: "error" })
        return;
      }
      if (!value.trim()) {
        displayAlert({ msg: "value is required", type: "error" })
        return;
      }
    }

    if (occupation === "ButtonControl") {
      if (!label.trim()) {
        displayAlert({ msg: "label is required", type: "error" })
        return;
      }
      if (!payload.trim()) {
        displayAlert({ msg: "payload is required", type: "error" })
        return;
      }
      if (!button_label.trim()) {
        displayAlert({ msg: "button label is required", type: "error" })
        return;
      }
    }
    if (occupation === "ToggleSwitch") {
      if (!label.trim()) {
        displayAlert({ msg: "label is required", type: "error" })
        return;
      }
      if (!value.trim()) {
        displayAlert({ msg: "value is required", type: "error" })
        return;
      }

      if (on_payload === null) {
        displayAlert({ msg: "on payload is required", type: "error" })
        return;
      }
      if (typeof on_payload === "string") {
        if (!on_payload.trim()) {
          displayAlert({ msg: "on payload is required", type: "error" })
          return;
        }
      }

      if (off_payload === null) {
        displayAlert({ msg: "off payload is required", type: "error" })
        return;
      }
      if (typeof off_payload === "string") {
        if (!off_payload.trim()) {
          displayAlert({ msg: "off payload is required", type: "error" })
          return;
        }
      }

    }

    if (occupation === "RangeSlider") {
      if (!label.trim()) {
        displayAlert({ msg: "label is required", type: "error" })
        return;
      }
      if (!value.trim()) {
        displayAlert({ msg: "value is required", type: "error" })
        return;
      }
      if (min === null) {
        displayAlert({ msg: "min value is required", type: "error" })
        return;
      }
      if (!max) {
        displayAlert({ msg: "max value is required", type: "error" })
        return;
      }
      if (min > max) {
        displayAlert({ msg: "min value must be < max value", type: "error" })
        return;
      }
    }

    if (occupation === "LineChart") {
      if (!label.trim()) {
        displayAlert({ msg: "label is required", type: "error" })
        return;
      }
      if (min === null) {
        displayAlert({ msg: "min value is required", type: "error" })
        return;
      }
      if (!max) {
        displayAlert({ msg: "max value is required", type: "error" })
        return;
      }
      if (!value_1.trim()) {
        displayAlert({ msg: "value 1 is required", type: "error" })
        return;
      }
      if (chuckLength == 2 && !value_2.trim()) {
        displayAlert({ msg: "value 2 is required", type: "error" })
        return;
      }
      if (chuckLength == 3 && !value_3.trim()) {
        displayAlert({ msg: "value 3 is required", type: "error" })
        return;
      }
      if (chuckLength == 4 && !value_4.trim()) {
        displayAlert({ msg: "value 4 is required", type: "error" })
        return;
      }
      if (min > max) {
        displayAlert({ msg: "min value must be < max value", type: "error" })
        return;
      }
    }

    switch (occupation) {
      case "Gauge":
        widgetInfo.label = values?.label;
        widgetInfo.type = occupation;
        widgetInfo.configWidget = {
          value: values.value,
          min: Number(values.min),
          max: Number(values.max),
          unit,
        };
        createWidget(widgetInfo);
        return;
      case "MessageBox":
        widgetInfo.label = values?.label;
        widgetInfo.type = occupation;
        widgetInfo.configWidget = {
          value: values.value,
          unit,
        };
        createWidget(widgetInfo);
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
          createWidget(widgetInfo);
          return;
        } catch (err: unknown) {
          displayAlert({ msg: "Payload must be JSON format", type: "error" })
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
          createWidget(widgetInfo);
          return;
        } catch (err: unknown) {
          displayAlert({ msg: "Payload must be JSON format", type: "error" })
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
          createWidget(widgetInfo);
          return;
        } catch (err: unknown) {
          displayAlert({ msg: "Payload must be JSON format", type: "error" })
          return;
        }
      case "LineChart":
        switch (chuckLength) {
          case 1:
            widgetInfo.configWidget = {
              keys: [value_1],
              colors: [colorValue1]
            };
            break;
          case 2:
            widgetInfo.configWidget = {
              keys: [value_1, value_2],
              colors: [colorValue1, colorValue2]
            };
            break;
          case 3:
            widgetInfo.configWidget = {
              keys: [value_1, value_2, value_3],
              colors: [colorValue1, colorValue2, colorValue3]
            };
            break;
          case 4:
            widgetInfo.configWidget = {
              keys: [value_1, value_2, value_3, value_4],
              colors: [colorValue1, colorValue2, colorValue3, colorValue4]
            };
            break;

        }
        try {
          widgetInfo.label = values?.label;
          widgetInfo.type = occupation;
          widgetInfo.configWidget = {
            ...widgetInfo.configWidget,
            min: Number(values.min),
            max: Number(values.max),
          };
          createWidget(widgetInfo);
          return;
        } catch (err: unknown) {
          displayAlert({ msg: "Payload must be JSON format", type: "error" })
          return;
        }
    }
  };

  const { callHandler: callClearWidgetAlert } = useTimeout({ executeAction: () => dispatch(clearWidgetAlert()), duration: 3000 })

  const createWidget = async (widgetInfo: IWidget) => {
    const { configWidget } = widgetInfo
    setIsLoading(true);
    try {
      await axiosPrivate.post(`/widgets/${props.device_id}`, { ...widgetInfo, configWidget: { ...configWidget, value: configWidget?.value?.trim() } });
      dispatch(displayWidgetAlert({ msg: `Created your ${widgetInfo?.label} widget successfully`, type: "success" }))
      callClearWidgetAlert();
      setIsLoading(false);
      handleClose();
      props.fetchAllWidgets();
      setValues(initialState);
    } catch (err: unknown) {
      setIsLoading(false);
      const msg = await getAxiosErrorMessage(err);
      displayAlert({ msg, type: "error" })
      return;
    }
  };

  const insertLabel = async () => {
    if (chuckLength === 4) {
      return;
    } else {
      setChunkLength((length) => {
        return length + 1;
      })
    }
  }

  const decreaseLabel = async () => {
    if (chuckLength <= 1) {
      return;
    } else {
      setChunkLength(chuckLength - 1)
    }
  }

  return (
    <div>
      <Dialog
        open={props.isAddWidgetShow}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
      >
        <DialogContent>
          <DialogContentText
            id="add-widget-dialog"
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
            {showAlert && alertType && (
              <div className="hidden sm:block">
                <Alert
                  severity={alertType}
                  sx={{
                    fontSize: "11.8px",
                    alignItems: "center",
                    marginTop: "1.5rem",
                  }}
                >
                  {alertText}
                </Alert>
              </div>
            )}

            <div className="pb-2 sm:w-[100%] mt-5">
              <label className="text-[12px] text-[#000]">Occupation</label>
              <select
                id="select_widget"
                className="bg-gray-50 w-[250px] sm:w-[100%] border border-gray-300 mt-1 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block px-5 py-2"
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
                <option value="LineChart">Line Chart</option>
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
                {occupation === "LineChart" && <div className="w-[350px] sm:w-[100%] relative">
                  <FormRow
                    type="text"
                    name="min"
                    labelText="min"
                    value={values.min}
                    handleChange={handleChange}
                    marginTop="mt-[0.2rem]"
                  />
                </div>}
              </div>
            )}

            {occupation && (
              <div className="flex gap-10 mt-3 sm:flex-col sm:gap-0">
                {(occupation === "Gauge" ||
                  occupation === "RangeSlider") && (
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
                {(occupation === "Gauge" ||
                  occupation === "RangeSlider" ||
                  occupation === "LineChart") && (
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
                {occupation === "LineChart" && <div className="w-[350px] sm:w-[100%]">
                  <FormRow
                    type="text"
                    name="value_1"
                    labelText="value 1"
                    value={values.value_1}
                    handleChange={handleChange}
                    marginTop="mt-[0.2rem]"
                  />
                </div>}

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
                {(occupation === "LineChart" && chuckLength >= 2) && <div className="flex relative w-[245px] sm:w-[100%]">
                  <FormRow
                    type="text"
                    name="value_2"
                    labelText="value 2"
                    value={values.value_2}
                    handleChange={handleChange}
                    marginTop="mt-[0.2rem]"
                  />
                  <IoMdCloseCircle onClick={decreaseLabel} className=" cursor-pointer absolute text-[#1d4469] end-0 text-[20px] bottom-[26px] hover:text-red-600" />
                </div>}
                {(occupation === "LineChart" && chuckLength >= 3) && <div className="flex relative w-[245px] sm:w-[100%]">
                  <FormRow
                    type="text"
                    name="value_3"
                    labelText="value 3"
                    value={values.value_3}
                    handleChange={handleChange}
                    marginTop="mt-[0.2rem]"
                  />
                  <IoMdCloseCircle onClick={decreaseLabel} className=" cursor-pointer absolute text-[#1d4469] end-0 text-[20px] bottom-[26px] hover:text-red-600" />
                </div>}
              </div>
            )}

            {occupation && (
              <div className="flex gap-10 mt-3 sm:flex-col sm:gap-0">


                {(occupation === "LineChart" && chuckLength >= 4) && <div className="flex relative w-[245px] sm:w-[100%]">
                  <FormRow
                    type="text"
                    name="value_4"
                    labelText="value 4"
                    value={values.value_4}
                    handleChange={handleChange}
                    marginTop="mt-[0.2rem]"
                  />
                  <IoMdCloseCircle onClick={decreaseLabel} className=" cursor-pointer absolute text-[#1d4469] end-0 text-[20px] bottom-[26px] hover:text-red-600" />
                </div>}
              </div>
            )}

            {/* {occupation === "LineChart" && <button
              id="insert-label-btn"
              className="mb-6 py-[0.4rem] text-nowrap text-[12px] border-[1px] border-primary-500 text-primary-500 hover:bg-primary-500 hover:text-white rounded-md px-6 transition-all"
              onClick={() => {
                insertLabel()
              }}
            >
              Insert Label +
            </button>} */}
            {occupation === "LineChart" && <div className={`w-[100%] flex justify-end items-end mb-5`}>
              {chuckLength < 4 &&
                <button
                  id="insert-label-btn"
                  className=" h-[35px] text-nowrap text-[12px] border-[1px] border-primary-500 text-primary-500 hover:bg-primary-500 hover:text-white rounded-md px-6 transition-all"
                  onClick={() => {
                    insertLabel()
                  }}
                >
                  Insert Label +
                </button>
              }

              <div className={`h-[100%] w-[100%] flex gap-3 ${chuckLength < 4 ? "items-end justify-end" : "justify-start items-start"} `}>
                {/* color picker value 1*/}
                <div className="flex flex-col">
                  <div className={`text-[11px] mb-1`}>color value 1</div>
                  <input value={colorValue1} type="color" onChange={(event) => {
                    setColorValue1(event.target.value)
                  }} className={`h-[35px] w-[85px] relative`}>

                  </input>
                </div>
                {/* color picker value 2 */}
                {chuckLength >= 2 && <div className="flex flex-col">
                  <div className={`text-[11px] mb-1`}>color value 2</div>
                  <input value={colorValue2} type="color" onChange={(event) => {
                    setColorValue2(event.target.value)
                  }} className={`h-[35px] w-[85px] relative`}>
                  </input>
                </div>}
                {/* color picker value 3 */}
                {chuckLength >= 3 && <div className="flex flex-col">
                  <div className={`text-[11px] mb-1`}>color value 3</div>
                  <input value={colorValue3} type="color" onChange={(event) => {
                    setColorValue3(event.target.value)
                  }} className={`h-[35px] w-[85px] relative`}>
                  </input>
                </div>}
                {/* color picker value 4 */}
                {chuckLength >= 4 && <div className="flex flex-col">
                  <div className={`text-[11px] mb-1`}>color value 4</div>
                  <input value={colorValue4} type="color" onChange={(event) => {
                    setColorValue4(event.target.value)
                  }} className={`h-[35px] w-[85px] relative`}>
                  </input>
                </div>}

              </div>
            </div>}


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
                    id="cancel-add-widget-btn"
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
                    id="add-widget-submit-btn"
                    disabled={isLoading}
                  >
                    Done
                  </Button>
                </div>
                {showAlert && (
                  <div className="block sm:hidden">
                    <SnackBar
                      id="add-widget-snackbar"
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
})

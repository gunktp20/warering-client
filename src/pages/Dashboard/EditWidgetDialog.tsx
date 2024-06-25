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
import { useAppSelector } from "../../app/hooks";
import { IoMdCloseCircle } from "react-icons/io";

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
  hookEditSuccess: () => void
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

interface IValue {
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
}

const initialState: IValue = {
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

interface IWidgetInfo {
  label: string;
  type: string;
  configWidget: IConfigWidget;
}

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

export default function EditWidgetDialog(props: IProps) {
  const [occupation, setOccupation] = useState<string>("");
  const axiosPrivate = useAxiosPrivate();
  const { token } = useAppSelector((state) => state.auth)
  const { alertType, alertText, showAlert, displayAlert } = useAlert();
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
      if (data?.type === "LineChart") {
        switch (data?.configWidget.keys.length) {
          case 1:
            setColorValue1(data?.configWidget.colors[0])
            setValues({ ...deviceValues, value_1: data?.configWidget.keys[0] })
            setChunkLength(1)
            break;
          case 2:
            setColorValue1(data?.configWidget.colors[0])
            setColorValue2(data?.configWidget.colors[1])
            setValues({ ...deviceValues, value_1: data?.configWidget.keys[0], value_2: data?.configWidget.keys[1], })
            setChunkLength(2)
            break;
          case 3:
            setColorValue1(data?.configWidget.colors[0])
            setColorValue2(data?.configWidget.colors[1])
            setColorValue3(data?.configWidget.colors[2])
            setValues({ ...deviceValues, value_1: data?.configWidget.keys[0], value_2: data?.configWidget.keys[1], value_3: data?.configWidget.keys[2] })
            setChunkLength(3)
            break;
          case 4:
            setColorValue1(data?.configWidget.colors[0])
            setColorValue2(data?.configWidget.colors[1])
            setColorValue3(data?.configWidget.colors[2])
            setColorValue4(data?.configWidget.colors[3])
            setValues({ ...deviceValues, value_1: data?.configWidget.keys[0], value_2: data?.configWidget.keys[1], value_3: data?.configWidget.keys[2], value_4: data?.configWidget.keys[3] })
            setChunkLength(4)
            break;
        }
      }
      setIsLoading(false);
    } catch (err: unknown) {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const onSubmit = () => {
    const { label, value, min, max, unit, payload, on_payload, off_payload, value_1, value_2, value_3, value_4 } =
      values;
    const widgetInfo: IWidgetInfo = {
      label: "",
      type: "",
      configWidget: initialState,
    };
    if (
      occupation === "Gauge" &&
      (!label || !value || min === null || !max)
    ) {
      displayAlert({
        msg: "Please provide all values",
        type: "error",
      });
      return;
    }
    if (
      occupation === "Gauge" &&
      (min !== undefined ? min : 0) > (max !== undefined ? max : 0)
    ) {
      displayAlert({
        msg: "min value must be < max value",
        type: "error",
      });
      return;
    }
    if (
      occupation === "MessageBox" &&
      (!label || !value)
    ) {
      displayAlert({ msg: "Please provide all values", type: "error" })
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
    if (
      occupation === "RangeSlider" &&
      (min !== undefined ? min : 0) > (max !== undefined ? max : 0)
    ) {
      displayAlert({
        msg: "min value must be < max value",
        type: "error",
      });
      return;
    }
    if (
      occupation === "LineChart" &&
      (!label || !value_1 || min === null || !max || (chuckLength == 2 && !value_2) || (chuckLength == 3 && !value_3) || (chuckLength == 4 && !value_4))
    ) {
      displayAlert({ msg: "Please provide all value", type: "error" })
      return;
    }
    if (occupation === "LineChart" && min > max) {
      displayAlert({ msg: "min value must be < max value", type: "error" })
      return;
    }
    switch (occupation) {
      case "Gauge":
        widgetInfo.label = values?.label !== undefined ? values?.label : "";
        widgetInfo.type = occupation;
        widgetInfo.configWidget = {
          value: values?.value !== undefined ? values?.value : "",
          min: Number(values.min),
          max: Number(values.max),
          unit,
        };
        editWidget(widgetInfo);
        return;
      case "MessageBox":
        widgetInfo.label = values?.label !== undefined ? values?.label : "";
        widgetInfo.type = occupation;
        widgetInfo.configWidget = {
          value: values.value,
          unit,
        };
        editWidget(widgetInfo);
        return;

      case "ButtonControl":
        try {
          const replacedString =
            values.payload !== undefined
              ? values.payload.replace(/'/g, '"')
              : "payload";
          JSON.parse(replacedString);
          widgetInfo.label = values?.label !== undefined ? values?.label : "";
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
          widgetInfo.label = values?.label !== undefined ? values?.label : "";
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
          widgetInfo.label = values?.label !== undefined ? values?.label : "";
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
          editWidget(widgetInfo);
          return;
        } catch (err: unknown) {
          displayAlert({ msg: "Payload must be JSON format", type: "error" })
          return;
        }
    }
  };

  const editWidget = async (widgetInfo: IWidget) => {
    const { configWidget } = widgetInfo
    setIsLoading(true);
    try {
      await axiosPrivate.patch(`/widgets/${props.widget_id}`, { ...widgetInfo, configWidget: { ...configWidget, value: configWidget?.value?.trim() } });
      displayAlert({
        msg: "Edited your widget successfully",
        type: "success",
      });
      props.fetchAllWidgets();
      props.setIsEditDisplayShow(false);
      props.setSelectedWidget("");
      props.hookEditSuccess()
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

  useEffect(() => {
    if (token) {
      fetchWidgetInfo();
    }

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
                className="text-[17px] font-bold text-[#1D4469]"
                id="edit-widget-dialog-title"
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
                  label={values.label !== undefined ? values.label : "label"}
                  min={0}
                  max={100}
                  value={50}
                />
              </div>
            )}
            {occupation === "MessageBox" && (
              <div className="flex gap-10 mt-5 sm:flex-col sm:gap-0 w-[100%]">
                <MessageBoxPreview
                  label={values.label !== undefined ? values.label : "label"}
                  value={"550,000"}
                  unit={values.unit !== undefined ? values.unit : "unit"}
                />
              </div>
            )}
            {occupation === "ButtonControl" && (
              <div className="flex gap-10 mt-5 sm:flex-col sm:gap-0 w-[100%]">
                <ButtonControlPreview
                  label={values.label !== undefined ? values.label : "label"}
                  button_label={
                    values.button_label !== undefined
                      ? values.button_label
                      : "button_label"
                  }
                />
              </div>
            )}
            {occupation === "ToggleSwitch" && (
              <div className="flex gap-10 mt-5 sm:flex-col sm:gap-0 w-[100%]">
                <ToggleSwitchPreview
                  label={values.label !== undefined ? values.label : "label"}
                />
              </div>
            )}
            {occupation === "RangeSlider" && (
              <div className="flex gap-10 mt-5 sm:flex-col sm:gap-0 w-[100%]">
                <RangeSliderPreview
                  label={values.label !== undefined ? values.label : "label"}
                />
              </div>
            )}
            {occupation === "LineChart" && (
              <div className="flex gap-10 mt-5 sm:flex-col sm:gap-0 w-[100%]">
                <LineChartPreview
                  label={values.label !== undefined ? values.label : "label"}
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

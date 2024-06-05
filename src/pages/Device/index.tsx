import {
  BigNavbar,
  NavLinkSidebar,
  NavDialog,
  AccountUserDrawer,
  SnackBar,
} from "../../components";
import { useEffect, useState, useCallback } from "react";
import { IoMdCheckmark } from "react-icons/io";
import { RiMenu2Fill } from "react-icons/ri";
import { IoArrowBackSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { SiMicrosoftexcel } from "react-icons/si";
import { BsFiletypeJson } from "react-icons/bs";
import Wrapper from "../../assets/wrappers/Device";
import { LuEye } from "react-icons/lu";
import { LuEyeOff } from "react-icons/lu";
import mqtt, { MqttClient } from "mqtt";
import {
  ButtonControl,
  Gauge,
  MessageBox,
  ToggleSwitch,
  RangeSlider,
} from "../../components/widgets_device";
import { Button } from "@mui/material";
import { useParams } from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { JsonView, allExpanded, defaultStyles } from "react-json-view-lite";
import "react-json-view-lite/dist/index.css";
import moment from "moment";
import TopicsDialog from "./TopicsDialog";
import AddWidgetDialog from "./AddWidgetDialog";
import EditWidgetDialog from "./EditWidgetDialog";
import getAxiosErrorMessage from "../../utils/getAxiosErrorMessage";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from "chart.js";
import LineChart from "../../components/widgets_device/LineChart";
import { useAppSelector } from "../../app/hooks";
import useAlert from "../../hooks/useAlert";
import * as XLSX from "xlsx"
import useTimeout from "../../hooks/useTimeout";
ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

interface IDevice {
  nameDevice: string;
  qos: 0 | 1 | 2;
  topics: string[];
  description: string;
  createdAt: string;
  usernameDevice: string;
  password: string;
  retain: boolean;
}

interface IWidget {
  id: string;
  type: string;
  label: string;
  configWidget: IConfigWidget;
}

interface IConfigWidget {
  value: string;
  min: number;
  max: number;
  unit: string;
  button_label: string;
  payload: string;
  on_payload: string;
  off_payload: string;
}

function Device() {
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [isEditDisplayShow, setIsEditDisplayShow] = useState<boolean>(false);
  const { showAlert, alertText, alertType } = useAppSelector((state) => state.widget)
  const alert = useAlert()
  const [isAccountUserDrawerOpen, setIsAccountUserDrawerOpen] =
    useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { device_id } = useParams();
  // device information for connect mqtt server
  const [publishTopic, setPublishTopic] = useState<string>("");
  const [subScribeTopic, setSubScribeTopic] = useState<string>("");
  const [qos, setQos] = useState<0 | 1 | 2>(0);
  //
  const [isSidebarShow, setIsSidebarShow] = useState<boolean>(true);
  const [deviceInfo, setDeviceInfo] = useState<IDevice>();
  const [client, setClient] = useState<MqttClient | null>(null);
  const [connectStatus, setConnectStatus] = useState("Connect");
  const [payload, setPayload] = useState({});
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
  const [isTopicsShow, setIsTopicsShow] = useState<boolean>(false);
  const [isAddWidgetShow, setIsAddWidgetShow] = useState<boolean>(false);
  const [selectedWidget, setSelectedWidget] = useState<string>("");

  const [widgets, setWidgets] = useState<IWidget[]>([]);
  const [configWidgetsDevice, setConfigWidgetsDevice] = useState<{
    [key: string]: string | number;
  }>();

  const fetchDeviceById = async () => {
    setIsLoading(true);
    try {
      const { data } = await axiosPrivate.get(`/devices/${device_id}`);
      setDeviceInfo(data);
      setPublishTopic(data?.topics[1]);
      setSubScribeTopic(data?.topics[0]);
      setQos(data?.qos);
      connectEMQX(data);
      setIsLoading(false);
    } catch (err: unknown) {
      const msg = await getAxiosErrorMessage(err);
      alert.displayAlert({ msg, type: "error" })
      setIsLoading(false);
    }
  };

  const fetchAllWidgets = async () => {
    setIsLoading(true);
    try {
      const { data } = await axiosPrivate.get(`/widgets/${device_id}`);
      setWidgets(data);
      setIsLoading(false);
    } catch (err) {
      const msg = await getAxiosErrorMessage(err);
      alert.displayAlert({ msg, type: "error" })
      setIsLoading(false);
    }
  };

  const mqttPublish = (payload: string) => {
    if (client) {
      client.publish(
        publishTopic,
        payload,
        {
          qos: 0,
          retain: true,
        },
        (error) => {
          if (error) {
            console.log("Publish error: ", error);
          }
        }
      );
    }
  };

  const connectEMQX = useCallback(
    async (data: { usernameDevice: string; password: string }) => {
      const _mqtt = await mqtt.connect(import.meta.env.VITE_EMQX_DOMAIN, {
        protocol: import.meta.env.VITE_EMQX_PROTOCAL,
        host: import.meta.env.VITE_EMQX_HOST,
        clientId: "emqx_react_" + Math.random().toString(16).substring(2, 8),
        username: data?.usernameDevice,
        password: data?.password,
      });
      setClient(_mqtt);
    },
    []
  );
  const mqttDisconnect = () => {
    if (client) {
      client.end(() => {
        setConnectStatus("Disconnected");
      });
    }
  };
  useEffect(() => {
    fetchDeviceById();
    fetchAllWidgets();
  }, []);

  useEffect(() => {
    if (client) {
      client.on("connect", () => {
        setConnectStatus("Connected");
        console.log(connectStatus);
        if (client) {
          client.subscribe(
            subScribeTopic,
            {
              qos: qos,
            },
            (err) => {
              console.log("not sub", err);
            }
          );
        }
      });
      client.on("reconnect", () => {
        setConnectStatus("Reconnecting");
      });

      client.on("message", (topic, message) => {
        const payload = { topic, message: message.toString() };
        try {
          const payloadObject = JSON.parse(payload.message.replace(/'/g, '"'));
          setConfigWidgetsDevice(payloadObject);
          setPayload(payloadObject);
        } catch (error) {
          console.log(error);
        }
      });
    }

    return () => {
      mqttDisconnect();
    };
  }, [client]);

  const selectWidget = async (widgetID: string) => {
    setSelectedWidget(widgetID);
    setIsEditDisplayShow(true);
  };

  const getAllPayload = async () => {
    try {
      const { data } = await axiosPrivate.get(`export/${device_id}`)
      return data
    } catch (err: unknown) {
      return err
    }
  }

  const exportJsonFile = async () => {
    try {
      const allPayload = await getAllPayload()
      const link = document.createElement("a")
      const blob = new Blob([JSON.stringify(allPayload)], { type: "text/json" });
      link.download = `${device_id}_${Date.now()}.json`;
      link.href = URL.createObjectURL(blob)
      document.body.appendChild(link)
      link.click();
      document.body.removeChild(link);
    } catch (err: unknown) {
      const msg = await getAxiosErrorMessage(err)
      alert.displayAlert({ msg, type: "error" })
    }
  }

  const exportExcelFile = async () => {
    try {
      const allPayload = await getAllPayload()
      const wb = XLSX.utils.book_new()
      const ws = XLSX.utils.json_to_sheet(allPayload)

      XLSX.utils.book_append_sheet(wb, ws,)

      XLSX.writeFile(wb, `${device_id}_${new Date()}.xlsx`)
    } catch (err) {
      const msg = await getAxiosErrorMessage(err)
      alert.displayAlert({ msg, type: "error" })
    }
  }

  const { callHandler: callExportJsonFile } = useTimeout({ executeAction: exportJsonFile, duration: 1000 })
  const { callHandler: callExportExelFile } = useTimeout({ executeAction: exportExcelFile, duration: 1000 })

  return (
    <Wrapper>
      {deviceInfo?.nameDevice && (
        <AddWidgetDialog
          device_id={device_id}
          isAddWidgetShow={isAddWidgetShow}
          setIsAddWidgetShow={setIsAddWidgetShow}
          nameDevice={deviceInfo?.nameDevice}
          fetchAllWidgets={fetchAllWidgets}
        />
      )}
      {selectedWidget && (
        <EditWidgetDialog
          widget_id={selectedWidget}
          isEditDisplayShow={isEditDisplayShow}
          setIsEditDisplayShow={setIsEditDisplayShow}
          fetchAllWidgets={fetchAllWidgets}
          setSelectedWidget={setSelectedWidget}
        />
      )}

      {deviceInfo?.topics && (
        <TopicsDialog
          isTopicsDialogShow={isTopicsShow}
          setTopicsDialogShow={setIsTopicsShow}
          topics={deviceInfo?.topics}
        />
      )}
      <AccountUserDrawer
        isAccountUserDrawerOpen={isAccountUserDrawerOpen}
        setIsAccountUserDrawerOpen={setIsAccountUserDrawerOpen}
      />
      <BigNavbar
        isAccountUserDrawerOpen={isAccountUserDrawerOpen}
        setIsAccountUserDrawerOpen={setIsAccountUserDrawerOpen}
        setIsSidebarShow={setIsSidebarShow}
        isSidebarShow={isSidebarShow}
      />

      <div className="flex h-[100%]">
        <NavLinkSidebar isSidebarShow={isSidebarShow} />
        <NavDialog
          isDrawerOpen={isDrawerOpen}
          setIsDrawerOpen={setIsDrawerOpen}
        />
        {/* content container */}
        <div className="m-[3rem] top-[5rem] min-h-vh w-[100%] flex flex-col rounded-md sm:m-[1rem] sm:mt-[2.5rem]">
          <div className="flex justify-between">
            <button
              onClick={() => {
                setIsDrawerOpen(true);
              }}
              className="hidden p-1 w-fit h-fit relative sm:block text-[#8f8f8f] mb-6"
              id="toggle-nav-links-dialog-btn"
            >
              <RiMenu2Fill className="text-[23px]" />
            </button>

            <button
              onClick={() => {
                navigate("/device-list");
              }}
              className="flex cursor-pointer text-sm text-[#1D4469] font-bold items-center left-0 mb-10"
              id="back-to-devices-list-btn"
            >
              <IoArrowBackSharp className="text-sm mr-2" />
              Back
            </button>
          </div>
          <div className="flex w-[100%] justify-between sm:hidden">
            <div
              id="title-outlet"
              className="text-[22px] text-[#1d4469] font-bold mb-10"
            >
              {deviceInfo?.nameDevice}
            </div>
          </div>

          {/* Start Device info container */}
          <div className="p-5 w-[100%] border-[1px] grid grid-cols-3 border-[#f1f1f1] rounded-md shadow-sm bg-white sm:grid-cols-2">
            <div className=" w-[100%] text-[#1D4469] font-bold mb-8" id="nameDevice-info">
              Device Name
              <div className="dd font-medium mt-2 text-[#7a7a7a] text-[13.3px] ">
                {deviceInfo?.nameDevice}
              </div>
            </div>
            <div className=" w-[100%] text-[#1D4469] font-bold mb-8" id="description-info">
              Description
              <div className="dd font-medium mt-2 text-[#7a7a7a] text-[13.3px]">
                {deviceInfo?.description}
              </div>
            </div>
            <div className=" w-[100%] text-[#1D4469] font-bold mb-8" id="createdAt-info">
              CreatedAt
              <div className="dd font-medium mt-2 text-[#7a7a7a] text-[13.3px]">
                {moment(deviceInfo?.createdAt)
                  .add(543, "year")
                  .format("DD/MM/YYYY h:mm")}
              </div>
            </div>
            <div className=" w-[100%] text-[#1D4469] font-bold mb-8" id="usernameDevice-info">
              Username Device
              <div className="dd font-medium mt-2 text-[#7a7a7a] text-[13.3px]">
                {deviceInfo?.usernameDevice}
              </div>
            </div>

            <div className=" w-[100%] text-[#1D4469] font-bold mb-8" id="passwordDevice-info">
              Password Device
              <div className="font-medium mt-2 text-[#7a7a7a] text-[13.3px] flex">
                <button
                  className=""
                  onClick={() => {
                    setPasswordVisible(!passwordVisible);
                  }}
                  id="toggle-device-password-visible-btn"
                >
                  {passwordVisible ? <LuEye /> : <LuEyeOff />}
                </button>
                <input
                  className={`ml-2 relative focus:outline-none outline-none focus:border-none w-[100%]`}
                  type={passwordVisible ? "text" : "password"}
                  readOnly={true}
                  value={deviceInfo?.password ? deviceInfo?.password : ""}
                  id="device-password-info-text"
                ></input>
              </div>
            </div>
            <div className=" w-[100%] text-[#1D4469] font-bold mb-8" id="qos-info">
              Qos
              <div className="dd font-medium mt-2 text-[#7a7a7a] text-[13.3px]">
                {deviceInfo?.qos}
              </div>
            </div>

            <div className="flex flex-col">
              <label
                htmlFor="retain-checkbox"
                className="ms-2 text-sm mr-2 font-medium text-[#1D4469]"
                id="retain-viewer"
              >
                Retain
              </label>

              <div className="flex items-center ml-2 mt-2">
                {deviceInfo?.retain ? (
                  <div className="bg-[#0075ff] rounded-sm text-white">
                    <IoMdCheckmark />
                  </div>
                ) : (
                  <div className="w-[15px] h-[15px] border-[#adadad7c] border-[1px] bg-[#f3f3f34d] rounded-sm"></div>
                )}
                <div
                  className={`ml-2 bottom-[0px] relative ${deviceInfo?.retain ? "text-[#0075ff]" : "text-[#7a7a7a]"
                    } text-[13.4px]`}
                  id="retain-text"
                >
                  {deviceInfo?.retain.toString()}
                </div>
              </div>
            </div>
            <div className=" w-[100%] text-[#1D4469] font-bold">
              <button
                onClick={() => {
                  setIsTopicsShow(!isTopicsShow);
                }}
                className="text-[#0075ff] px-3 py-1 border-[1px] text-[12.4px] rounded-md border-[#0075ff] flex font-medium mt-2 "
                id="view-topics-btn"
              >
                View Topics
              </button>
            </div>
          </div>
          {/* End Device info container */}

          <div onClick={exportJsonFile} className="text-[#1d4469] text-[20px] mt-8 font-bold">
            JSON view
          </div>
          <div className="text-[#7a7a7a text-sm text-[13.2px]">
            View JSON data
          </div>
          <div className="w-[100%] text-sm p-5 bg-[#eeeeee] text-[#7a7a7a] shadow-sm mt-7">
            <JsonView
              data={payload}
              shouldExpandNode={allExpanded}
              style={defaultStyles}
            />
          </div>

          <div className="text-[#1d4469] text-[20px] mt-8 font-bold">
            Export
          </div>
          <div className="gap-16 flex mt-4 p-5 border-t-[1px] border-b-[1px] border-[#dadada]" >
            <div className="flex flex-col justify-center items-center cursor-pointer text-nowrap" onClick={callExportJsonFile} id="excel-download">
              <SiMicrosoftexcel className="text-[#1d4469] text-[25px]" />
              <div className="text-[13px] mt-3 text-[#1d4469] font-bold">
                Excel
              </div>
            </div>
            {/* Export JSON */}
            <div className="flex flex-col justify-center items-center cursor-pointer text-nowrap" onClick={callExportExelFile} id="json-dowload">
              <BsFiletypeJson className="text-[#1d4469] text-[25px]" />
              <div className="text-[13px] mt-3 text-[#1d4469] font-bold text-nowrap">
                JSON
              </div>
            </div>
          </div>

          <div className="w-[300px] mt-8 sm:w-[100%]">
            <Button
              onClick={() => {
                setIsAddWidgetShow(true);
              }}
              style={{
                textTransform: "none",
                height: "39px",
                width: "100%",
              }}
              sx={{
                border: 2,
                fontWeight: "bold",
                alignItems: "center",
                fontSize: "12px",
                color: "#1966FB",
                ":hover": {},
                ":disabled": {
                  color: "#fff",
                },
              }}
              variant="outlined"
              id="toggle-add-widget-dialog-btn"
              disabled={isLoading}
            >
              Add widget
            </Button>
          </div>

          {/* start widget container */}
          <div className="grid grid-cols-3 gap-10 mt-8 md:grid-cols-2 sm:grid-cols-1">
            {widgets &&
              widgets.map((widget: IWidget, index: number) => {
                if (widget.type === "Gauge") {
                  return (
                    <Gauge
                      key={index}
                      widgetId={widget?.id}
                      label={widget?.label}
                      value={
                        configWidgetsDevice !== undefined
                          ? configWidgetsDevice?.[widget?.configWidget?.value]
                          : null
                      }
                      min={widget?.configWidget?.min}
                      max={widget?.configWidget?.max}
                      unit={widget?.configWidget?.unit}
                      fetchAllWidgets={fetchAllWidgets}
                      selectWidget={selectWidget}
                    />
                  );
                }
                if (widget.type === "MessageBox") {
                  return (
                    <MessageBox
                      key={index}
                      widgetId={widget?.id}
                      label={widget?.label}
                      value={
                        configWidgetsDevice !== undefined
                          ? configWidgetsDevice?.[widget?.configWidget?.value]
                          : null
                      }
                      unit={widget?.configWidget?.unit}
                      fetchAllWidgets={fetchAllWidgets}
                      selectWidget={selectWidget}
                    />
                  );
                }
                if (widget.type === "ButtonControl") {
                  return (
                    <ButtonControl
                      key={index}
                      widgetId={widget?.id}
                      label={widget?.label}
                      button_label={widget?.configWidget?.button_label}
                      payload={widget?.configWidget?.payload}
                      fetchAllWidgets={fetchAllWidgets}
                      publishMQTT={mqttPublish}
                      selectWidget={selectWidget}
                    />
                  );
                }
                if (widget.type === "ToggleSwitch") {
                  return (
                    <ToggleSwitch
                      key={index}
                      widgetId={widget?.id}
                      label={widget?.label}
                      on_payload={widget?.configWidget?.on_payload}
                      off_payload={widget?.configWidget?.off_payload}
                      value={widget?.configWidget?.value}
                      fetchAllWidgets={fetchAllWidgets}
                      publishMQTT={mqttPublish}
                      selectWidget={selectWidget}
                    />
                  );
                }
                if (widget.type === "RangeSlider") {
                  return (
                    <RangeSlider
                      key={index}
                      widgetId={widget?.id}
                      label={widget?.label}
                      min={widget?.configWidget?.min}
                      max={widget?.configWidget?.max}
                      value={widget?.configWidget?.value}
                      fetchAllWidgets={fetchAllWidgets}
                      publishMQTT={mqttPublish}
                      selectWidget={selectWidget}
                    />
                  );
                }
                if (widget.type === "LineChart") {
                  return (
                    <LineChart
                      key={index}
                      widgetId={widget?.id}
                      label={widget?.label}
                      min={widget?.configWidget?.min}
                      max={widget?.configWidget?.max}
                      fetchAllWidgets={fetchAllWidgets}
                      value={
                        configWidgetsDevice !== undefined
                          ? configWidgetsDevice?.[widget?.configWidget?.value]
                          : null
                      }
                      selectWidget={selectWidget}
                    />
                  );
                }
              })}
          </div>
        </div>
        {showAlert && (
          <div className="block sm:hidden">
            <SnackBar
              id="device-page-snackbar"
              severity={alertType}
              showSnackBar={showAlert}
              snackBarText={alertText}
            />
          </div>
        )}
      </div>
    </Wrapper>
  );
}

export default Device;

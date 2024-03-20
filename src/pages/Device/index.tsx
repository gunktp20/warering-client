import {
  BigNavbar,
  NavLinkSidebar,
  NavDialog,
  AccountUserDrawer,
} from "../../components";
import { useEffect, useState } from "react";
import { IoMdCheckmark } from "react-icons/io";
import { RiMenu2Fill } from "react-icons/ri";
import { IoArrowBackSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { SiMicrosoftexcel } from "react-icons/si";
import { BsFiletypeJson } from "react-icons/bs";
// import { FaClipboardList } from "react-icons/fa";
import Wrapper from "../../assets/wrappers/Device";
import mqtt, { MqttClient } from "mqtt";
import { LuEye } from "react-icons/lu";
import { LuEyeOff } from "react-icons/lu";
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

interface IDevice {
  nameDevice: string;
  qos: 0 | 1 | 2 | any;
  topics: any[];
  description: string;
  createdAt: string;
  usernameDevice: string;
  password: string;
  retain: boolean;
}

function Device() {
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [isEditDisplayShow, setIsEditDisplayShow] = useState<boolean>(false);
  const [isAccountUserDrawerOpen, setIsAccountUserDrawerOpen] =
    useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  let { device_id } = useParams();
  const [isSidebarShow, setIsSidebarShow] = useState<boolean>(true);
  const [deviceInfo, setDeviceInfo] = useState<IDevice>();
  const [client, setClient] = useState<MqttClient | null>(null);
  const [connectStatus, setConnectStatus] = useState("Connect");
  const [payload, setPayload] = useState({});
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
  const [isTopicsShow, setIsTopicsShow] = useState<boolean>(false);
  const [isAddWidgetShow, setIsAddWidgetShow] = useState<boolean>(false);
  const [selectedWidget, setSelectedWidget] = useState<any>(null);
  const [widgets, setWidgets] = useState<any>(null);
  const [configWidgetsDevice, setConfigWidgetsDevice] = useState<any>(null);

  const fetchDeviceById = async () => {
    setIsLoading(true);
    try {
      const { data } = await axiosPrivate.get(`/devices/${device_id}`);
      setDeviceInfo(data);
      connectEMQX(data);
      setIsLoading(false);
    } catch (err: any) {
      setIsLoading(false);
    }
  };
  const fetchAllWidgets = async () => {
    setIsLoading(true);
    try {
      const { data } = await axiosPrivate.get(`/widgets/${device_id}`);
      setWidgets(data);
      setIsLoading(false);
    } catch (err: any) {
      setIsLoading(false);
    }
  };
  const mqttPublish = (payload: any) => {
    if (client) {
      client.publish(
        deviceInfo?.topics[1],
        payload,
        {
          qos: 0,
        },
        (error) => {
          if (error) {
            console.log("Publish error: ", error);
          }
        }
      );
    }
  };
  const connectEMQX = async (data: any) => {
    const _mqtt = await mqtt.connect(import.meta.env.VITE_EMQX_DOMAIN, {
      protocol: "ws",
      host: "localhost",
      clientId: "emqx_react_" + Math.random().toString(16).substring(2, 8),
      port: 8083,
      username: data?.usernameDevice,
      password: data?.password,
    });
    setClient(_mqtt);
  };
  // const mqttDisconnect = () => {
  //   if (client) {
  //     try {
  //       client.end(false, () => {
  //         setConnectStatus("Connect");
  //         // console.log("disconnected successfully");
  //       });
  //     } catch (error) {
  //       // console.log("disconnect error:", error);
  //     }
  //   }
  // };
  useEffect(() => {
    fetchDeviceById();
    fetchAllWidgets();
  }, []);
  useEffect(() => {
    if (client) {
      client.on("connect", () => {
        setConnectStatus("Connected");
        // console.log("connection successful");
        console.log(connectStatus);
        if (client) {
          client.subscribe(
            deviceInfo?.topics[0],
            {
              qos: deviceInfo?.qos,
            },
            (err) => {
              console.log("not sub", err);
            }
          );
        }
      });
      // client.end(() => {
      //   setConnectStatus('Disconnected');
      // });
      // client.on("error", (err) => {
      //   console.error("Connection error: ", err);
      //   client.end();
      // });
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
  }, [client]);

  const selectWidget = async (widgetID: any) => {
    setSelectedWidget(widgetID);
    console.log(widgetID);
    setIsEditDisplayShow(true);
  };

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
        {isLoading && <div className="loader"></div>}
        <div className="m-[3rem] top-[5rem] min-h-vh w-[100%] flex flex-col rounded-md sm:m-[1rem] sm:mt-[2.5rem]">
          <div className="flex justify-between">
            <button
              onClick={() => {
                setIsDrawerOpen(true);
              }}
              className="hidden p-1 w-fit h-fit relative sm:block text-[#8f8f8f] mb-6"
              id="small-open-sidebar-btn"
            >
              <RiMenu2Fill className="text-[23px]" />
            </button>

            <button
              onClick={() => {
                navigate("/device-list");
              }}
              className="flex cursor-pointer text-sm text-[#1D4469] font-bold items-center left-0 mb-10"
            >
              <IoArrowBackSharp className="text-sm mr-2" />
              Back
            </button>
          </div>
          <div className="flex w-[100%] justify-between sm:hidden">
            <div id="title-outlet" className="text-[22px] text-[#1d4469] font-bold mb-10">
              {deviceInfo?.nameDevice}
            </div>
          </div>

          <div className="absolute left-0 top-[-4rem] text-[21px] text-[#1d4469] font-bold">
            {deviceInfo?.nameDevice}
          </div>

          {/* Back button */}

          <button
            onClick={() => {
              navigate("/device-list");
            }}
            className="absolute top-[-6.5rem] flex cursor-pointer text-sm text-[#1D4469] font-bold items-center left-0 sm:left-[90%]"
          >
            <IoArrowBackSharp className="text-sm" />
            Back
          </button>

          {/* Back button
            
          {/* Start Device info container */}
          <div className="p-5 w-[100%] border-[1px] grid grid-cols-3 border-[#f1f1f1] rounded-md shadow-sm bg-white sm:grid-cols-2">
            <div className=" w-[100%] text-[#1D4469] font-bold mb-8">
              Device Name
              <div className="dd font-medium mt-2 text-[#7a7a7a] text-[13.3px] ">
                {deviceInfo?.nameDevice}
              </div>
            </div>
            <div className=" w-[100%] text-[#1D4469] font-bold mb-8">
              Description
              <div className="dd font-medium mt-2 text-[#7a7a7a] text-[13.3px]">
                {deviceInfo?.description}
              </div>
            </div>
            <div className=" w-[100%] text-[#1D4469] font-bold mb-8">
              CreatedAt
              <div className="dd font-medium mt-2 text-[#7a7a7a] text-[13.3px]">
                {moment(deviceInfo?.createdAt)
                  .add(543, "year")
                  .format("DD/MM/YYYY h:mm")}
              </div>
            </div>
            <div className=" w-[100%] text-[#1D4469] font-bold mb-8">
              Username Device
              <div className="dd font-medium mt-2 text-[#7a7a7a] text-[13.3px]">
                {deviceInfo?.usernameDevice}
              </div>
            </div>

            <div className=" w-[100%] text-[#1D4469] font-bold mb-8 ">
              Password Device
              <div className="font-medium mt-2 text-[#7a7a7a] text-[13.3px] flex">
                <button
                  className=""
                  onClick={() => {
                    setPasswordVisible(!passwordVisible);
                  }}
                >
                  {passwordVisible ? <LuEye /> : <LuEyeOff />}
                </button>
                <input
                  className={`ml-2 relative focus:outline-none outline-none focus:border-none w-[100%]`}
                  type={passwordVisible ? "text" : "password"}
                  readOnly={true}
                  value={deviceInfo?.password ? deviceInfo?.password : ""}
                ></input>
              </div>
            </div>
            <div className=" w-[100%] text-[#1D4469] font-bold mb-8">
              Qos
              <div className="dd font-medium mt-2 text-[#7a7a7a] text-[13.3px]">
                {deviceInfo?.qos}
              </div>
            </div>

            <div className="flex flex-col">
              <label
                htmlFor="retain-checkbox"
                className="ms-2 text-sm mr-2 font-medium text-[#1D4469]"
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
                  className={`ml-2 bottom-[0px] relative ${
                    deviceInfo?.retain ? "text-[#0075ff]" : "text-[#7a7a7a]"
                  } text-[13.4px]`}
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

          <div className="text-[#1d4469] text-[20px] mt-8 font-bold">
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
          <div className="gap-16 flex mt-4 p-5 border-t-[1px] border-b-[1px] border-[#dadada]">
            <div className="flex flex-col justify-center items-center">
              <SiMicrosoftexcel className="text-[#1d4469] text-[25px]" />
              <div className="text-[13px] mt-3 text-[#1d4469] font-bold">
                Excel
              </div>
            </div>
            <div className="flex flex-col justify-center items-center">
              <BsFiletypeJson className="text-[#1d4469] text-[25px]" />
              <div className="text-[13px] mt-3 text-[#1d4469] font-bold">
                JSON
              </div>
            </div>
            {/* <div className="flex flex-col justify-center items-center">
              <FaClipboardList className="text-[#1d4469] text-[25px]" />
              <div className="text-[13px] mt-3 text-[#1d4469] font-bold">
                Clip Board
              </div>
            </div> */}
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
              id="add-widget-btn"
            >
              Add widget
            </Button>
          </div>

          {/* start widget container */}

          <div className="grid grid-cols-3 gap-10 mt-8 md:grid-cols-2 sm:grid-cols-1">
            {widgets &&
              widgets.map((widget: any, index: number) => {
                // console.log(`${[widget.nameDevice]}`, widget);
                // console.log(`unit`, widget?.configWidget?.unit);
                // console.log(widget)
                // console.log(widget?.configWidget);
                if (widget.type === "Gauge") {
                  return (
                    <Gauge
                      key={index}
                      widgetId={widget?.id}
                      label={widget?.label}
                      value={configWidgetsDevice?.[widget?.configWidget?.value]}
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
                      value={configWidgetsDevice?.[widget?.configWidget?.value]}
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
              })}
            {/* <Gauge
              isDeleteConfirmOpen={isDeleteConfirmOpen}
              setIsDeleteConfirmOpen={setIsDeleteConfirmOpen}
            />
            <MessageBox
              isDeleteConfirmOpen={isDeleteConfirmOpen}
              setIsDeleteConfirmOpen={setIsDeleteConfirmOpen}
            />
            <RangeSlider
              isDeleteConfirmOpen={isDeleteConfirmOpen}
              setIsDeleteConfirmOpen={setIsDeleteConfirmOpen}
            />
            <ToggleSwitch
              isDeleteConfirmOpen={isDeleteConfirmOpen}
              setIsDeleteConfirmOpen={setIsDeleteConfirmOpen}
            />
            <ButtonControl
              isDeleteConfirmOpen={isDeleteConfirmOpen}
              setIsDeleteConfirmOpen={setIsDeleteConfirmOpen}
            /> */}
          </div>
          {/* end widget container */}
        </div>
        {/* content container */}
      </div>
    </Wrapper>
  );
}

export default Device;

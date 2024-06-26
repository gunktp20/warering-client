import {
  BigNavbar,
  NavLinkSidebar,
  NavDialog,
  AccountUserDrawer,
  SnackBar,
} from "../../components";
import { useEffect, useState, useCallback, useRef } from "react";
import { IoMdCheckmark } from "react-icons/io";
import { RiMenu2Fill } from "react-icons/ri";
import { IoArrowBackSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { SiMicrosoftexcel } from "react-icons/si";
import { BsFiletypeJson } from "react-icons/bs";
import { LuEye } from "react-icons/lu";
import { LuEyeOff } from "react-icons/lu";
import { MqttClient } from "mqtt";
import { FaRegCopy } from "react-icons/fa";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
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
import connectEMQX from "../../utils/connectEMQX";
import copy from "copy-to-clipboard";
import Tooltip from "../../components/ToolTip";
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
  keys: string[]
  colors: string[]
}

function Device() {
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [isEditDisplayShow, setIsEditDisplayShow] = useState<boolean>(false);
  const { token } = useAppSelector((state) => state.auth)
  const widgetState = useAppSelector((state) => state.widget)
  const { showAlert, alertText, alertType, displayAlert } = useAlert()
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
  // const [connectStatus, setConnectStatus] = useState("Connect");
  const [payload, setPayload] = useState({});
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
  const [isTopicsShow, setIsTopicsShow] = useState<boolean>(false);
  const [isAddWidgetShow, setIsAddWidgetShow] = useState<boolean>(false);
  const [selectedWidget, setSelectedWidget] = useState<string>("");
  const [widgets, setWidgets] = useState<IWidget[]>([]);
  const [configWidgetsDevice, setConfigWidgetsDevice] = useState<{
    [key: string]: string | number;
  }>();
  const [visualizationWidgets, setVisualizationWidgets] = useState<IWidget[]>([])
  const sliderRef = useRef<Slider | null>(null);

  // Function to handle mouse wheel
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      sliderRef.current?.slickPrev(); // Use optional chaining
    } else {
      sliderRef.current?.slickNext();
    }
  };

  // Function to disable scroll
  const disableScroll = () => {
    document.body.classList.add('no-scroll');
  };

  // Function to enable scroll
  const enableScroll = () => {
    callRefuteExe()
    document.body.classList.remove('no-scroll');
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 900,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 1150,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 1300,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ]
  };

  const fetchDeviceById = async () => {
    setIsLoading(true);
    try {
      const { data } = await axiosPrivate.get(`/devices/${device_id}`);
      setDeviceInfo(data);
      setPublishTopic(data?.topics[1]);
      setSubScribeTopic(data?.topics[0]);
      setQos(data?.qos);
      connectMQTTServer(data);
      setIsLoading(false);
    } catch (err: unknown) {
      const msg = await getAxiosErrorMessage(err);
      displayAlert({ msg, type: "error" })
      setIsLoading(false);
    }
  };

  const fetchAllWidgets = async () => {
    setIsLoading(true);
    try {
      const { data } = await axiosPrivate.get(`/widgets/${device_id}`);
      setWidgets(data.filter((widget: { type: string; }) => widget.type !== "LineChart"));
      // new update 
      setVisualizationWidgets(data.filter((widget: IWidget) => {
        if (widget.type === "LineChart") {
          return widget;
        }
      }))
      setIsLoading(false);
    } catch (err) {
      const msg = await getAxiosErrorMessage(err);
      displayAlert({ msg, type: "error" })
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
            // console.log("Publish error: ", error);
          }
        }
      );
    }
  };

  const connectMQTTServer = useCallback(
    async (data: { usernameDevice: string; password: string }) => {
      const client = await connectEMQX(data.usernameDevice, data.password)
      setClient(client);
    },
    []
  );

  const mqttDisconnect = () => {
    if (client) {
      client.end(() => {
        // setConnectStatus("Disconnected");
      });
    }
  };
  useEffect(() => {
    if (token) {
      fetchDeviceById();
      fetchAllWidgets();
    }
  }, []);

  useEffect(() => {
    if (token) {
      if (client) {
        client.on("connect", () => {
          // setConnectStatus("Connected");
          // console.log(connectStatus);
          if (client) {
            client.subscribe(
              subScribeTopic,
              {
                qos: qos,
              },
              (err) => {
                if (err) {
                  // console.log(err);
                }
              }
            );
          }
        });
        client.on("reconnect", () => {
          // setConnectStatus("Reconnecting");
        });

        client.on("message", (topic, message) => {
          const payload = { topic, message: message.toString() };
          try {
            const payloadObject = JSON.parse(payload.message.replace(/'/g, '"'));
            setConfigWidgetsDevice(payloadObject);
            setPayload(payloadObject);
          } catch (error) {
            // console.log(error);
          }
        });
      }
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

  const hookEditSuccess = () => {
    displayAlert({ msg: "Your widget was updated", type: "success" })
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
      displayAlert({ msg: "JSON file is downloading...", type: "success" })
    } catch (err: unknown) {
      const msg = await getAxiosErrorMessage(err)
      displayAlert({ msg, type: "error" })
    }
  }

  const { callHandler: callDisableScroll, callRefuteExe } = useTimeout({
    executeAction: disableScroll,
    duration: 250,
  });

  const exportExcelFile = async () => {
    try {
      const allPayload = await getAllPayload()
      const wb = XLSX.utils.book_new()
      const ws = XLSX.utils.json_to_sheet(allPayload)

      XLSX.utils.book_append_sheet(wb, ws,)

      XLSX.writeFile(wb, `${device_id}_${new Date()}.xlsx`)
      displayAlert({ msg: "Excel file is downloading...", type: "success" })
    } catch (err) {
      const msg = await getAxiosErrorMessage(err)
      displayAlert({ msg, type: "error" })
    }
  }

  const { callHandler: callExportJsonFile } = useTimeout({ executeAction: exportJsonFile, duration: 1000 })
  const { callHandler: callExportExcelFile } = useTimeout({ executeAction: exportExcelFile, duration: 1000 })

  return (
    <div className='flex-col flex '>
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
          hookEditSuccess={hookEditSuccess}
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
      {/* Container content and sidebar*/}
      <div className='flex'>
        {/*  sidebar*/}
        <NavLinkSidebar isSidebarShow={isSidebarShow} />
        <NavDialog
          isDrawerOpen={isDrawerOpen}
          setIsDrawerOpen={setIsDrawerOpen}
        />
        {/* Content Y axis */}
        <div className='m-[3rem] top-[4rem] w-[100%] flex h-fit flex-col sm:m-0 sm:my-[3rem] sm:mx-[1rem]'>
          {/* menu top content container */}
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
            {/* name device */}

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
              <div className="dd font-medium mt-2 text-[#7a7a7a] text-[13.3px] sm:text-[12px]">
                {deviceInfo?.nameDevice}
              </div>
            </div>
            <div className=" w-[100%] text-[#1D4469] font-bold mb-8" id="description-info">
              Description
              <div className="dd font-medium mt-2 text-[#7a7a7a] text-[13.3px] sm:text-[12px]">
                {deviceInfo?.description}
              </div>
            </div>
            <div className=" w-[100%] text-[#1D4469] font-bold mb-8" id="createdAt-info">
              CreatedAt
              <div className="dd font-medium mt-2 text-[#7a7a7a] text-[13.3px] sm:text-[12px]">
                {moment(deviceInfo?.createdAt)
                  .add(543, "year")
                  .format("DD/MM/YYYY h:mm")}
              </div>
            </div>
            <div className=" w-[100%] text-[#1D4469] font-bold mb-8" id="usernameDevice-info">
              Username Device
              <div className="dd font-medium mt-2 text-[#7a7a7a] text-[13.3px] sm:text-[12px]">
                {deviceInfo?.usernameDevice}
              </div>
            </div>

            <div className=" w-[100%] text-[#1D4469] font-bold mb-8" id="passwordDevice-info">
              Password Device
              <div className="font-medium mt-2 text-[#7a7a7a] text-[13.3px] sm:text-[12px] flex">
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

            {/* Domain */}
            <div className=" w-[100%] text-[#1D4469] font-bold mb-8" id="qos-info">
              Mqtt-Domain
              <div className="flex gap-3 font-medium mt-2 text-[#7a7a7a] text-[13.3px] sm:text-[12px]">
                <Tooltip text="copy to clipboard">
                  <FaRegCopy className="cursor-pointer hover:text-primary-500 transition-all" onClick={() => {
                    copy(import.meta.env.VITE_MQTT_DOMAIN);
                    displayAlert({ msg: "copied to clipboard", type: "success" })
                  }} />
                </Tooltip>
                {import.meta.env.VITE_MQTT_DOMAIN}
              </div>
            </div>
            {/* Qos */}
            <div className=" w-[100%] text-[#1D4469] font-bold mb-8" id="qos-info">
              Qos
              <div className="dd font-medium mt-2 text-[#7a7a7a] text-[13.3px] sm:text-[12px]">
                {deviceInfo?.qos}
              </div>
            </div>
            {/* Retain */}
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
                className="text-[#0075ff] px-3 py-1 border-[1px] text-[12.4px] rounded-md border-[#0075ff] flex font-medium mt-2 hover:bg-[#0075ff] hover:text-[#fff] "
                id="view-topics-btn"
              >
                View Topics
              </button>
            </div>
          </div>
          {/* End Device info container */}
          {/* Start JSON viewer */}
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
          {/* End JSON viewer */}
          {/* Exports alternatives */}
          <div className="text-[#1d4469] text-[20px] mt-8 font-bold">
            Export
          </div>
          <div className="mb-1 flex mt-4 px-5 py-4 border-t-[1px] border-b-[1px] border-[#dadada] " >
            <div className="w-[80px] h-[80px] rounded-md hover:border-[2px] hover:border-primary-100 transition-all flex flex-col justify-center items-center cursor-pointer text-nowrap mr-5" onClick={callExportExcelFile} id="excel-download">
              <SiMicrosoftexcel className="text-[#1d4469] text-[25px]" />
              <div className="text-[13px] mt-3 text-[#1d4469] font-bold">
                Excel
              </div>
            </div>
            {/* Export JSON */}
            <div className="w-[80px] h-[80px] rounded-md hover:border-[2px] hover:border-primary-100 transition-all flex flex-col justify-center items-center cursor-pointer text-nowrap" onClick={callExportJsonFile} id="json-dowload">
              <BsFiletypeJson className="text-[#1d4469] text-[25px]" />
              <div className="text-[13px] mt-3 text-[#1d4469] font-bold text-nowrap">
                JSON
              </div>
            </div>
          </div>
          {/* Exports alternatives End */}
          {/* Widget menu options start */}
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
          {/* {/* Widget menu options */}


          {/* {widgets.length <= 0 && (
            <div className="flex justify-center items-center w-[100%] py-4 pt-12 text-[#c0c0c0] ">

              <MdSearchOff className="text-[30px] mr-4" />

              <div className="text-sm">
                your have not any widget
              </div>
            </div>
          )} */}

          {/* start widget container */}
          {widgets.length > 0 && <div className="border-b-[#1d446931] mt-5 border-b-[1px] pb-3 text-[14px] font-bold text-[#1d4469]">widgets</div>}
          <div className="grid grid-cols-3 gap-5 mt-8 md:grid-cols-2 sm:grid-cols-1">
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
              })}
          </div>
          {/* Widgets container end */}

          {/* widget visualization container */}
          {visualizationWidgets.length >= 1 && <div className="border-b-[#1d446931] mt-9 border-b-[1px] pb-3 text-[14px] font-bold text-[#1d4469]">visualization</div>}
          {visualizationWidgets.length > 1 && <div className="w-[100%] flex justify-center relative h-[70vh]">
            <div
              onMouseEnter={callDisableScroll}
              onMouseLeave={enableScroll}
              onWheel={handleWheel}
              className="w-[100%] shadow-md rounded-md mt-8 absolute">
              <Slider ref={sliderRef} {...settings}>
                {visualizationWidgets.length > 1 && visualizationWidgets.map((widget, index) => {
                  return <LineChart
                    key={index}
                    widgetId={widget?.id}
                    label={widget?.label}
                    min={widget?.configWidget?.min}
                    max={widget?.configWidget?.max}
                    fetchAllWidgets={fetchAllWidgets}
                    keys={widget.configWidget.keys}
                    colors={widget.configWidget.colors}
                    payload={configWidgetsDevice !== undefined ? configWidgetsDevice : null}
                    selectWidget={selectWidget}
                  />
                })}
              </Slider>
            </div>
          </div>}
          {/* if length is 1 */}
          {visualizationWidgets.length === 1 && visualizationWidgets.map((widget, index) => {
            return (<div className="w-[100%] shadow-md rounded-md mt-8">
              <LineChart
                key={index + 1}
                widgetId={widget?.id}
                id={widget?.id + "single"}
                label={widget?.label}
                min={widget?.configWidget?.min}
                max={widget?.configWidget?.max}
                fetchAllWidgets={fetchAllWidgets}
                keys={widget.configWidget.keys}
                colors={widget.configWidget.colors}
                payload={configWidgetsDevice !== undefined ? configWidgetsDevice : null}
                selectWidget={selectWidget}
              />
            </div>)
          })}
          {/* widget visualization container end */}
        </div>
      </div>
      {/* Container content and sidebar*/}
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
      {widgetState.showAlert && (
        <div className="block sm:hidden">
          <SnackBar
            id="device-state-snackbar"
            severity={widgetState.alertType}
            showSnackBar={widgetState.showAlert}
            snackBarText={widgetState.alertText}
          />
        </div>
      )}

    </div >
  )
}

export default Device

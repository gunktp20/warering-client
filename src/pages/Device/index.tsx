import {
  BigNavbar,
  NavLinkSidebar,
  NavDialog,
  AccountUserDrawer,
} from "../../components";
import { useEffect, useState } from "react";
import { RiMenu2Fill } from "react-icons/ri";
import { IoArrowBackSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { SiMicrosoftexcel } from "react-icons/si";
import { BsFiletypeJson } from "react-icons/bs";
import { FaClipboardList } from "react-icons/fa";
import Wrapper from "../../assets/wrappers/Device";
import mqtt, { MqttClient } from "mqtt";
import {
  ButtonControl,
  Gauge,
  MessageBox,
  ToggleSwitch,
  RangeSlider,
} from "../../components/widgets_device";
import { Button } from "@mui/material";
import AddDisplayDialog from "./AddDisplayDialog";
import ConfirmDelete from "./ConfirmDelete";
import { useParams } from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import {
  JsonView,
  allExpanded,
  defaultStyles,
} from "react-json-view-lite";
import "react-json-view-lite/dist/index.css";
import moment from "moment";

function Device() {
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [isAddDisplayShow, setIsAddDisplayShow] = useState<boolean>(false);
  const [isAccountUserDrawerOpen, setIsAccountUserDrawerOpen] =
    useState<boolean>(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] =
    useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  let { device_id } = useParams();
  const [isSidebarShow, setIsSidebarShow] = useState<boolean>(true);
  const [deviceInfo, setDeviceInfo] = useState<any>(null);
  const [client, setClient] = useState<MqttClient | null>(null);
  const [connectStatus, setConnectStatus] = useState("Connect");
  const [payload, setPayload] = useState({});

  const jsonData = {
    data: "HelloWorld",
    username: "gunktp14",
    password: "71567****",
    description: "สวัดดีครับท่านผู้ชม",
  };

  const fetchDeviceById = async () => {
    setIsLoading(true);
    try {
      const { data } = await axiosPrivate.get(`/devices/${device_id}`);
      setDeviceInfo(data);
      setIsLoading(false);
    } catch (err: any) {
      setIsLoading(false);
    }
  };

  const mqttDisconnect = () => {
    if (client) {
      try {
        client.end(false, () => {
          setConnectStatus("Connect");
          console.log("disconnected successfully");
        });
      } catch (error) {
        console.log("disconnect error:", error);
      }
    }
  };

  useEffect(() => {
    fetchDeviceById();
  }, []);

  useEffect(() => {
    (() => {
      const _mqtt = mqtt.connect("ws://localhost:8083/mqtt", {
        protocol: "ws",
        host: "localhost",
        clientId: "emqx_react_" + Math.random().toString(16).substring(2, 8),
        port: 8083,
        username: "TestMQTT",
        password: "TestMQTT",
      });
      setClient(_mqtt);
    })();
  }, []);

  useEffect(() => {
    if (client) {
      client.on("connect", () => {
        setConnectStatus("Connected");
        console.log("connection successful");
        if (client) {
          client.subscribe(
            "65e2e2e1946718f317756f47/TestMQTT/publish",
            {
              qos: deviceInfo.qos,
            },
            (err) => {
              console.log("not sub", err);
            }
          );
        }
      });

      // https://github.com/mqttjs/MQTT.js#event-error
      client.on("error", (err) => {
        console.error("Connection error: ", err);

        client.end();
      });

      // https://github.com/mqttjs/MQTT.js#event-reconnect
      client.on("reconnect", () => {
        setConnectStatus("Reconnecting");
      });

      // https://github.com/mqttjs/MQTT.js#event-message
      client.on("message", (topic, message) => {
        const payload = { topic, message: message.toString() };
        console.log(payload.message);
        try {
          const payloadObject = JSON.parse(payload.message.replace(/'/g, '"'));
          console.log(payloadObject);

          setPayload(payloadObject);
        } catch (error) {
          console.log(error);
        }
      });
    }
  }, [client]);

  return (
    <Wrapper>
      <ConfirmDelete
        isDeleteConfirmOpen={isDeleteConfirmOpen}
        setIsDeleteConfirmOpen={setIsDeleteConfirmOpen}
      />
      <AddDisplayDialog
        isAddDisplayShow={isAddDisplayShow}
        setIsAddDisplayShow={setIsAddDisplayShow}
      />
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
        <div className="m-[3rem] top-[5rem] min-h-vh w-[100%] flex flex-col rounded-md sm:m-[3rem]">
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
            <div className="text-[23px] text-[#1d4469] font-bold mb-10">
              การเกษตรรวม
            </div>
          </div>
          {/* <button
            onClick={() => {
              setIsDrawerOpen(true);
            }}
            className="hidden p-1 w-fit h-fit left-[0rem] sm:block top-[-7rem] text-[#8f8f8f]"
            id="small-open-sidebar-btn"
          >
            <RiMenu2Fill className="text-[23px]" />
          </button>
          <div className="absolute left-0 top-[-4rem] text-[23px] text-[#1d4469] font-bold">
            การเกษตรรวม
          </div>  */}

          {/* Back button */}

          {/* <button
            onClick={() => {
              navigate("/device-list");
            }}
            className="absolute top-[-6.5rem] flex cursor-pointer text-sm text-[#1D4469] font-bold items-center left-0 sm:left-[90%]"
          >
            <IoArrowBackSharp className="text-sm" />
            Back
          </button> */}

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

            <div className=" w-[100%] text-[#1D4469] font-bold mb-8">
              Password Device
              <div className="dd font-medium mt-2 text-[#7a7a7a] text-[13.3px]">
                *********516
              </div>
            </div>
            <div className=" w-[100%] text-[#1D4469] font-bold mb-8">
              Qos
              <div className="dd font-medium mt-2 text-[#7a7a7a] text-[13.3px]">
                {deviceInfo?.qos}
              </div>
            </div>
            <div className="flex items-center">
              <label
                htmlFor="link-checkbox"
                className="ms-2 text-sm mr-2 font-medium text-[#1D4469] dark:text-gray-300"
              >
                Retain
              </label>
              <input
                checked={deviceInfo?.retain}
                id="link-checkbox"
                type="checkbox"
                value=""
                className=" w-[15px] h-[15px] text-[#2CB1BC] bg-gray-100 border-gray-300 rounded focus:ring-[#ffffff00] dark:focus:ring-[#2CB1BC] dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
          </div>
          {/* End Device info container */}

          <div className="text-[#1d4469] text-[20px] mt-8 font-bold">
            JSON view
          </div>
          <div className="text-[#7a7a7a text-sm text-[13.2px]" >
            View JSON data
          </div>
          <div className="w-[100%] text-sm p-5 bg-[#f2f2f2] text-[#7a7a7a] shadow-sm mt-7">
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
            <div className="flex flex-col justify-center items-center">
              <FaClipboardList className="text-[#1d4469] text-[25px]" />
              <div className="text-[13px] mt-3 text-[#1d4469] font-bold">
                Clip Board
              </div>
            </div>
          </div>

          <div className="w-[300px] mt-8 sm:w-[100%]">
            <Button
              onClick={() => {
                setIsAddDisplayShow(true);
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
              id="setup-user-submit"
            >
              Add widget
            </Button>
          </div>

          {/* start widget container */}
          <div className="grid grid-cols-3 gap-10 mt-8 md:grid-cols-2 sm:grid-cols-1">
            <Gauge
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
            />
          </div>
          {/* end widget container */}
        </div>
        {/* content container */}
      </div>
    </Wrapper>
  );
}

export default Device;

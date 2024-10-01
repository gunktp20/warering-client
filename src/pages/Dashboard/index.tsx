import { useEffect, useRef, useState } from 'react'
import { AccountUserDrawer, BigNavbar, NavDialog, NavLinkSidebar, SnackBar } from '../../components'
import { motion } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { useNavigate, useParams } from 'react-router-dom';
import connectEMQX from '../../utils/connectEMQX';
import { RiDragDropLine, RiMenu2Fill } from 'react-icons/ri';
import { Button } from "@mui/material";
import { IoArrowBackSharp } from 'react-icons/io5';
import { toggleEditMode } from '../../features/dashboard/dashboardSlice';
import { ButtonControl, Gauge, MessageBox, RangeSlider, ToggleSwitch, } from '../../components/widgets_dashboard';
import getAxiosErrorMessage from '../../utils/getAxiosErrorMessage';
import useAlert from '../../hooks/useAlert';
import AddDisplayDialog from '../Dashboard/AddDisplayDialog';
import LineChart from '../../components/widgets_dashboard/LineChart';
import Slider from 'react-slick';
import useTimeout from '../../hooks/useTimeout';
import { MdSearchOff } from 'react-icons/md';
import EditWidgetDialog from '../Dashboard/EditWidgetDialog';
import DropIndicator from './DropIndicator';
import { MqttClient } from 'mqtt';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

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

interface IWidget {
  widget: { _id: string, id: string };
  _id: string;
  widgetPositionId: string;
  configWidget: IConfigWidget;
  createdAt: string;
  deviceId: string;
  id: string;
  label: string;
  type: string;
  updatedAt: string;
  column: "column-1" | "column-2" | "column-3" | string
}

const clients: MqttClient[] = [];

const MqttDisconnect = () => {
  if (clients.length > 0) {
    clients.map((client) => {
      client.end()
    })
  }
}

function Dashboard() {
  const navigate = useNavigate()
  const axiosPrivate = useAxiosPrivate()
  const dispatch = useAppDispatch()
  const { editMode } = useAppSelector((state) => state.dashboard);
  const { showAlert, alertText, alertType, displayAlert } = useAlert()
  const [selectedWidget, setSelectedWidget] = useState<string>("");
  const [isEditDisplayShow, setIsEditDisplayShow] = useState<boolean>(false);
  useState<boolean>(false);
  const [isAddDisplayShow, setIsAddDisplayShow] = useState<boolean>(false)
  const [isAccountUserDrawerOpen, setIsAccountUserDrawerOpen] =
    useState<boolean>(false);
  const [isSidebarShow, setIsSidebarShow] = useState<boolean>(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [dashboardInfo, setDashboardInfo] = useState<{
    id?: string;
    nameDashboard: string;
    description: string;
  }>({ nameDashboard: "", description: "" });
  const { dashboard_id } = useParams()
  const [currentWidgets, setCurrentWidgets] = useState<IWidget[] | []>([]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [widgets, setWidgets] = useState<IWidget[]>([]);
  const { token } = useAppSelector((state) => state.auth)
  const [payloadDevices, setPayloadDevices] = useState<
    { deviceId: string; mqttPublish: (payload: string) => void }[]
  >([]);

  const fetchDashboardById = async () => {
    setIsLoading(true);
    try {
      const { data } = await axiosPrivate.get(`/dashboards/${dashboard_id}`);
      setIsLoading(false);
      setDashboardInfo(data);

      const formattedWidgets = await data?.widgets.map(
        (element: {
          _id: string;
          widget: { _id: string; label: string; type: string };
        }) => {
          const mergedWidget = {
            ...element.widget,
            ...element,
            id: element.widget?._id,
            widgetPositionId: element?._id,
          };
          return mergedWidget;
        }
      );
      setCurrentWidgets(formattedWidgets);
      setWidgets(formattedWidgets);
      // new update 
      const filteredVisualWidgets = await data?.widgets.filter((widget: { widget: IWidget }) => {
        if (widget.widget.type === "LineChart") {
          return widget;
        }
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setVisualizationWidgets(filteredVisualWidgets.map((widget: { widget: IWidget; }) => {
        return { ...widget.widget, id: widget.widget._id }
      }))

      const initialPayloadDevices = data?.devices.map(
        (device: { _id: string }) => {
          return { deviceId: device._id };
        }
      );

      setPayloadDevices(initialPayloadDevices);

      await data?.devices.map(
        async (device: {
          _id: string;
          usernameDevice: string;
          password_law: string;
          topics: string[];
        }) => {
          const { usernameDevice, password_law } = device;

          const client = await connectEMQX(usernameDevice, password_law)

          clients.push(client);

          const mqttPublish = (payload: string): void => {
            if (client) {
              client.publish(
                device?.topics[1],
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

          setPayloadDevices((prevPayloadDevices) => {
            const mergedMqttPublisherDevices = prevPayloadDevices.map(
              (payload) => {
                if (payload.deviceId === device._id) {
                  return { ...payload, mqttPublish };
                }
                return payload;
              }
            );
            return mergedMqttPublisherDevices;
          });

          client.on("connect", () => {
            if (client) {
              client.subscribe(
                device?.topics[0],
                {
                  qos: 0,
                },
                (err) => {
                  if (err) {
                    // console.log("not sub", err);
                  }
                }
              );
            }
          });
          client.on("reconnect", () => { });

          client.on("message", async (topic, message) => {
            const payload = { topic, message: message.toString() };
            const payloadObject = JSON.parse(
              payload.message.replace(/'/g, '"')
            );
            setPayloadDevices((prevPayloadDevices) => {
              const mergedPayloadDevices = prevPayloadDevices.map((payload) => {
                if (payload.deviceId === device._id) {
                  return { ...payload, ...payloadObject };
                }
                return payload;
              });
              return mergedPayloadDevices;
            });
          });
        }
      );
    } catch (err: unknown) {
      setIsLoading(false);
    }
  };

  const [visualizationWidgets, setVisualizationWidgets] = useState<IWidget[]>([])
  const sliderRef = useRef<Slider | null>(null);

  // Function to handle mouse wheel
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    // e.preventDefault();
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

  const { callHandler: callDisableScroll, callRefuteExe } = useTimeout({
    executeAction: disableScroll,
    duration: 250,
  });

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

  const fetchWidgetsInDashboard = async () => {
    setIsLoading(true);
    try {
      const { data } = await axiosPrivate.get(`/dashboards/${dashboard_id}`);

      const formattedWidgets = await data?.widgets.map(
        (element: {
          _id: string;
          widget: { _id: string; label: string; type: string };
        }) => {
          const mergedWidget = {
            ...element.widget,
            ...element,
            id: element.widget?._id,
            widgetPositionId: element?._id,
          };
          return mergedWidget;
        }
      );
      setWidgets(formattedWidgets);
      const filteredVisualWidgets = await data?.widgets.filter((widget: { widget: IWidget }) => {
        if (widget.widget.type === "LineChart") {
          return widget;
        }
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setVisualizationWidgets(filteredVisualWidgets.map((widget: { widget: IWidget; }) => {
        return { ...widget.widget, id: widget.widget._id }
      }))
      return setIsLoading(false);
    } catch (err: unknown) {
      const msg = await getAxiosErrorMessage(err)
      displayAlert({ msg, type: "error" })
      return setIsLoading(false);
    }
  };

  const onDeleteSuccess = () => {
    displayAlert({
      msg: "Deleted 1 widget",
      type: "error",
    });
  };
  const onUpdateSuccess = () => {
    displayAlert({
      msg: "Your widget was updated",
      type: "success",
    });
  };

  const pushWidgetsPosition = async () => {
    if (currentWidgets === widgets) {
      return dispatch(toggleEditMode());
    }
    setIsLoading(true);
    const mergedWidgetsPosition = await widgets?.map((widget) => {
      const mergedWidget = {
        widget: widget?.widget?._id,
        column: widget?.column,
        _id: widget?.widgetPositionId,
      };
      return mergedWidget;
    });
    try {
      await axiosPrivate.put(`/dashboards/${dashboard_id}/position`, {
        widgets: mergedWidgetsPosition,
      });
      displayAlert({
        msg: "Updated widgets position",
        type: "success",
      });
      setIsLoading(false);
      dispatch(toggleEditMode());
    } catch (err: unknown) {
      const msg = await getAxiosErrorMessage(err);
      setIsLoading(false);
      displayAlert({
        msg,
        type: "success",
      });
      dispatch(toggleEditMode());
    }
  };

  const selectWidget = async (widgetID: string) => {
    setSelectedWidget(widgetID);
    setIsEditDisplayShow(true);
  };

  useEffect(() => {
    if (token) {
      fetchDashboardById()
    }

  }, [])

  useEffect(() => {
    return () => {
      MqttDisconnect()
    };
  }, [])

  const onAddWidgetSuccess = async () => {
    await fetchDashboardById();
    displayAlert({
      msg: "Added your widget in dashboard",
      type: "success",
    });
  };


  return (
    <div className='flex-col flex '>
      <AccountUserDrawer
        isAccountUserDrawerOpen={isAccountUserDrawerOpen}
        setIsAccountUserDrawerOpen={setIsAccountUserDrawerOpen}
      />
      <AddDisplayDialog
        isEditDialogOpen={isAddDisplayShow}
        setEditDialogOpen={setIsAddDisplayShow}
        selectedDashboard={dashboardInfo?.id}
        dashboard_id={dashboard_id}
        hookAddSuccess={onAddWidgetSuccess}
      />
      <BigNavbar
        isAccountUserDrawerOpen={isAccountUserDrawerOpen}
        setIsAccountUserDrawerOpen={setIsAccountUserDrawerOpen}
        setIsSidebarShow={setIsSidebarShow}
        isSidebarShow={isSidebarShow}
      />
      {selectedWidget && (
        <EditWidgetDialog
          widget_id={selectedWidget}
          isEditDisplayShow={isEditDisplayShow}
          setIsEditDisplayShow={setIsEditDisplayShow}
          fetchAllWidgets={fetchWidgetsInDashboard}
          setSelectedWidget={setSelectedWidget}
          hookEditSuccess={onUpdateSuccess}
        />
      )}

      <div className="flex h-[100%]">
        <NavLinkSidebar isSidebarShow={isSidebarShow} />
        <NavDialog
          isDrawerOpen={isDrawerOpen}
          setIsDrawerOpen={setIsDrawerOpen}
        />
        <div className="m-[3rem] top-[5rem] min-h-vh w-[100%] flex flex-col rounded-md sm:m-[1rem] sm:mt-[2.5rem]">
          {/* top bar  */}
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
                navigate("/dashboard-list");
              }}
              className="flex cursor-pointer text-sm text-[#1D4469] font-bold items-center left-0 mb-10"
              id="back-to-dashboards-list-btn"
            >
              <IoArrowBackSharp className="text-sm mr-2" />
              Back
            </button>
          </div>
          <div className="flex w-[100%] justify-between">
            <div
              id="title-outlet"
              className="text-[22px] text-[#1d4469] font-bold w-[100%] truncate sm:w-[150px]"
            >
              {dashboardInfo?.nameDashboard}
            </div>
            <div className="flex gap-6">

              {!editMode && (
                <button
                  onClick={() => {
                    dispatch(toggleEditMode());
                  }}
                  className="text-[14px] flex items-center gap-2 text-[#1D4469] h-[39px] bg-[#ebebeb] w-[39px] justify-center rounded-md border-[1px]"
                  id="switch-to-edit-mode-btn"
                >
                  <RiDragDropLine className="text-[23px]" />
                </button>
              )}
              {editMode && (
                <button
                  onClick={pushWidgetsPosition}
                  className="text-[14px] flex items-center gap-2 h-[39px] bg-[#1D4469] w-[130px] justify-center rounded-md text-white font-semibold"
                  id="save-widgets-position-btn"
                >
                  {isLoading ? (
                    <div className="loader w-[20px] h-[20px]"></div>
                  ) : (
                    "Save"
                  )}
                </button>
              )}

              <Button
                onClick={() => {
                  setIsAddDisplayShow(true);
                }}
                style={{
                  textTransform: "none",
                  width: "185px",
                  height: "39px",
                }}
                sx={{
                  border: 2,
                  fontWeight: "bold",
                  alignItems: "center",
                  fontSize: "12px",
                  color: "#1D4469",
                  ":hover": {},
                  ":disabled": {
                    color: "#fff",
                  },
                }}
                variant="outlined"
                id="add-widget-to-dashboard-btn"
              >
                Add Widget
              </Button>

            </div>
          </div>

          <div className="absolute left-0 top-[-4rem] text-[21px] text-[#1d4469] font-bold" id="dashboard-name">
            {dashboardInfo?.nameDashboard}
          </div>

          {widgets.length === 0 && <div className="w-[100%] h-[100vh] mt-9 flex justify-center flex-col items-center border-dashed border-[1px] bg-[#f9f9f9] rounded-lg border-gray-200">
            {widgets.length === 0 && !isLoading && (
              <div className="text-[80px] flex justify-center w-[100%] my-5 text-[#c0c0c0]">
                {" "}
                <MdSearchOff />
              </div>
            )}
            {widgets.length === 0 && !isLoading && (
              <div className="text-md text-center w-[100%] my-5 text-[#c0c0c0]" id="not-found-widgets-note">
                {" "}
                Not found any widget
              </div>
            )}

            {isLoading && widgets.length <= 0 && (
              <div className="w-[100%] flex justify-center  h-[165px] items-center">
                <div className="loader w-[50px] h-[50px] border-blue-200 border-b-transparent"></div>
              </div>
            )}
          </div>}

          {/* Column container */}
          {widgets.length > 0 && <div className=" gap-2 w-[100%] grid grid-cols-3 md:grid-cols-2 sm:grid-cols-1 mt-5">
            <Column
              column="column-1"
              payloadDevices={payloadDevices}
              fetchAllWidgets={fetchWidgetsInDashboard}
              widgets={widgets}
              setWidgets={setWidgets}
              onDeleteSuccess={onDeleteSuccess}
              dashboard_id={dashboard_id ? dashboard_id : ""}
              selectWidget={selectWidget}
            />
            <Column
              column="column-2"
              payloadDevices={payloadDevices}
              fetchAllWidgets={fetchWidgetsInDashboard}
              widgets={widgets}
              setWidgets={setWidgets}
              onDeleteSuccess={onDeleteSuccess}
              dashboard_id={dashboard_id ? dashboard_id : ""}
              selectWidget={selectWidget}
            />
            <Column
              column="column-3"
              payloadDevices={payloadDevices}
              fetchAllWidgets={fetchWidgetsInDashboard}
              widgets={widgets}
              setWidgets={setWidgets}
              onDeleteSuccess={onDeleteSuccess}
              dashboard_id={dashboard_id ? dashboard_id : ""}
              selectWidget={selectWidget}
            />
          </div>}
          {visualizationWidgets.length <= 0 && <div className='w-[100%] h-[40vh]'></div>}
          {/*  */}
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

                  const matchedPayload = payloadDevices?.find(
                    (payload) => payload?.deviceId === widget?.deviceId
                  );

                  return <LineChart
                    key={index}
                    widgetId={widget?.id}
                    label={widget?.label}
                    min={widget?.configWidget?.min}
                    max={widget?.configWidget?.max}
                    fetchAllWidgets={fetchWidgetsInDashboard}
                    keys={widget.configWidget.keys}
                    colors={widget.configWidget.colors}
                    payload={matchedPayload}
                    selectWidget={selectWidget}
                    dashboardId={dashboard_id ? dashboard_id : ""}
                    onDeleteSuccess={onDeleteSuccess} />
                })}
              </Slider>
            </div>
          </div>}
          {/* if length is 1 */}
          {visualizationWidgets.length === 1 && visualizationWidgets.map((widget, index) => {

            const matchedPayload = payloadDevices?.find(
              (payload) => payload?.deviceId === widget?.deviceId
            );
            return (<div className="w-[100%] shadow-md rounded-md mt-8">
              <LineChart
                key={index}
                widgetId={widget?.id}
                label={widget?.label}
                min={widget?.configWidget?.min}
                max={widget?.configWidget?.max}
                fetchAllWidgets={fetchWidgetsInDashboard}
                keys={widget.configWidget.keys}
                colors={widget.configWidget.colors}
                payload={matchedPayload}
                selectWidget={selectWidget}
                dashboardId={dashboard_id ? dashboard_id : ""}
                onDeleteSuccess={onDeleteSuccess} />
            </div>)
          })}

          {/* end--- */}
        </div>
      </div>
      {
        showAlert && (
          <div className="block sm:hidden">
            <SnackBar
              id="dashboard-snackbar"
              severity={alertType}
              showSnackBar={showAlert}
              snackBarText={alertText}
            />
          </div>
        )
      }
    </div>

  )
}

type MqttPublish = (payload: string) => void;

interface IColumn {
  widgets: IWidget[]
  column: "column-1" | "column-2" | "column-3" | string
  setWidgets: (widgets: IWidget[]) => void
  onDeleteSuccess: () => void;
  payloadDevices: {
    deviceId: string;
    [key: string]: string | number | MqttPublish;
  }[];
  selectWidget: (widget_id: string) => void;
  fetchAllWidgets: () => void;
  dashboard_id: string
}

interface Indicator {
  style: {
    opacity: string;
  };
  dataset: {
    before?: string;
  };
  getBoundingClientRect: () => DOMRect;
}

const Column = ({ widgets, column, setWidgets, payloadDevices, fetchAllWidgets, onDeleteSuccess, dashboard_id, selectWidget }: IColumn) => {

  const urgentMqttPublisher = (payload: string): string => {
    return payload
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, widget: { id: string }) => {
    e.dataTransfer.setData("widgetId", widget.id);
  };

  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    const cardId = e.dataTransfer.getData("widgetId");
    clearHighlights();

    const indicators = getIndicators();
    const { element } = getNearestIndicator(e, indicators);

    const before = element.dataset.before || "-1";

    if (before !== cardId) {
      let copy = [...widgets];
      let cardToTransfer = copy.find((c) => c.id === cardId);
      if (!cardToTransfer) return;
      cardToTransfer = { ...cardToTransfer, column };

      copy = copy.filter((c) => c.id !== cardId);

      const moveToBack = before === "-1";
      if (moveToBack) {
        copy.push(cardToTransfer);
      } else {
        const insertAtIndex = copy.findIndex((el) => el.id === before);
        if (insertAtIndex === -1) return;
        copy.splice(insertAtIndex, 0, cardToTransfer);
      }
      setWidgets(copy);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    highlightIndicator(e);
  };

  const clearHighlights = (els?: Indicator[]) => {
    const indicators = els || getIndicators();
    indicators.forEach((i) => {
      i.style.opacity = "0";
    });
  };

  const highlightIndicator = (e: React.DragEvent<HTMLDivElement>) => {
    const indicators = getIndicators();
    clearHighlights(indicators);
    const el = getNearestIndicator(e, indicators);
    el.element.style.opacity = "1";
  };

  const getNearestIndicator = (
    e: React.DragEvent<HTMLDivElement>,
    indicators: Indicator[]
  ) => {
    const DISTANCE_OFFSET = 50;

    const el = indicators.reduce(
      (closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = e.clientY - (box.top + DISTANCE_OFFSET);
        if (offset < 0 && offset > closest.offset) {
          return { offset: offset, element: child };
        } else {
          return closest;
        }
      },
      {
        offset: Number.NEGATIVE_INFINITY,
        element: indicators[indicators.length - 1],
      }
    );

    return el;
  };

  const getIndicators = (): Indicator[] => {
    return Array.from(document.querySelectorAll(`[data-column="${column}"]`)) as unknown as HTMLElement[];
  };

  const handleDragLeave = () => {
    clearHighlights();
  };

  const filteredCards = widgets.filter((widget) => widget.column === column);

  return (
    <div className="w-[100%] h-fit p-2">
      <div
        onDrop={handleDragEnd}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`h-full w-full transition-colors`}
      >
        {filteredCards.map((widget, index) => {
          if (widget.type === "Gauge") {
            const matchedPayload = payloadDevices?.find(
              (payload) => payload?.deviceId === widget?.deviceId
            );

            return (
              <Gauge
                key={index}
                widget={widget}
                onDeleteSuccess={onDeleteSuccess}
                widgetId={widget?.id}
                label={widget?.label}
                value={
                  matchedPayload !== undefined
                    ? matchedPayload?.[widget?.configWidget?.value]
                    : null
                }
                min={widget?.configWidget?.min}
                max={widget?.configWidget?.max}
                unit={widget?.configWidget?.unit}
                fetchAllWidgets={fetchAllWidgets}
                selectWidget={selectWidget}
                dashboardId={dashboard_id}
                handleDragStart={handleDragStart}
                column={widget.column}
              />
            );
          }
          if (widget.type === "MessageBox") {
            const matchedPayload = payloadDevices?.find(
              (payload) => payload?.deviceId === widget?.deviceId
            );

            return (
              <MessageBox
                key={index}
                widget={widget}
                onDeleteSuccess={onDeleteSuccess}
                widgetId={widget?.id}
                label={widget?.label}
                value={
                  matchedPayload !== undefined
                    ? matchedPayload?.[widget?.configWidget?.value]
                    : null
                }
                unit={widget?.configWidget?.unit}
                fetchAllWidgets={fetchAllWidgets}
                selectWidget={selectWidget}
                dashboardId={dashboard_id}
                handleDragStart={handleDragStart}
                column={widget.column}
              />
            );
          }
          if (widget.type === "ButtonControl") {
            const matchedPayload = payloadDevices?.find(
              (payload) => payload?.deviceId === widget?.deviceId
            );

            return (
              <ButtonControl
                key={index}
                widget={widget}
                onDeleteSuccess={onDeleteSuccess}
                widgetId={widget?.id}
                label={widget?.label}
                button_label={widget?.configWidget?.button_label}
                payload={widget?.configWidget?.payload}
                fetchAllWidgets={fetchAllWidgets}
                publishMQTT={
                  typeof matchedPayload?.mqttPublish === "function"
                    ? matchedPayload?.mqttPublish
                    : urgentMqttPublisher
                }
                selectWidget={selectWidget}
                dashboardId={dashboard_id}
                handleDragStart={handleDragStart}
                column={widget.column}

              />
            );
          }
          if (widget.type === "ToggleSwitch") {
            const matchedPayload = payloadDevices?.find(
              (payload) => payload?.deviceId === widget?.deviceId
            );

            return (
              <ToggleSwitch
                widget={widget}
                onDeleteSuccess={onDeleteSuccess}
                key={index}
                widgetId={widget?.id}
                label={widget?.label}
                on_payload={widget?.configWidget?.on_payload}
                off_payload={widget?.configWidget?.off_payload}
                value={widget?.configWidget?.value}
                fetchAllWidgets={fetchAllWidgets}
                publishMQTT={
                  typeof matchedPayload?.mqttPublish === "function"
                    ? matchedPayload?.mqttPublish
                    : urgentMqttPublisher
                }
                selectWidget={selectWidget}
                dashboardId={dashboard_id}
                handleDragStart={handleDragStart}
                column={widget.column}
              />
            );
          }
          if (widget.type === "RangeSlider") {
            const matchedPayload = payloadDevices?.find(
              (payload) => payload?.deviceId === widget?.deviceId
            );

            return (
              <RangeSlider
                widget={widget}
                onDeleteSuccess={onDeleteSuccess}
                key={index}
                widgetId={widget?.id}
                label={widget?.label}
                min={widget?.configWidget?.min}
                max={widget?.configWidget?.max}
                value={widget?.configWidget?.value}
                fetchAllWidgets={fetchAllWidgets}
                publishMQTT={
                  typeof matchedPayload?.mqttPublish === "function"
                    ? matchedPayload?.mqttPublish
                    : urgentMqttPublisher
                }
                selectWidget={selectWidget}
                dashboardId={dashboard_id}
                handleDragStart={handleDragStart}
                column={widget.column}
              />
            );
          }
        })}
        <DropIndicator beforeId={null} column={column} />
        <AddCard />
      </div>

    </div>

  );
};



const AddCard = () => {

  return (
    <>
      <motion.form>
      </motion.form>
    </>
  );
};

export default Dashboard

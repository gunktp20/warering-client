import { useEffect, useMemo, useState } from "react";
import { Column } from "./types";
import ColumnContainer from "./ColumnContainer";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import TaskCard from "./TaskCard";
import { MdSearchOff } from "react-icons/md";
import {
  AccountUserDrawer,
  BigNavbar,
  NavDialog,
  NavLinkSidebar,
  SnackBar,
} from "../../components";
import Wrapper from "../../assets/wrappers/Dashboard";
import { useNavigate, useParams } from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { IoArrowBackSharp } from "react-icons/io5";
import { RiMenu2Fill } from "react-icons/ri";
import { Button } from "@mui/material";
import AddDisplayDialog from "./AddDisplayDialog";
import { toggleEditMode } from "../../features/dashboard/dashboardSlice";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { RiDragDropLine } from "react-icons/ri";
import EditWidgetDialog from "./EditWidgetDialog";
import useAlert from "../../hooks/useAlert";
import getAxiosErrorMessage from "../../utils/getAxiosErrorMessage";
import connectEMQX from "../../utils/connectEMQX";

interface ConfigWidget {
  value: string;
  min: number;
  max: number;
  unit: string;
}

interface Widget {
  configWidget: ConfigWidget;
  createdAt: string;
  deviceId: string;
  id: string;
  label: string;
  type: string;
  updatedAt: string;
}

interface WidgetObject {
  column: string;
  widget: Widget;
  widgetPositionId: string;
  __v: number;
  _id: string;
  id: string;
}

const defaultCols: Column[] = [
  {
    id: "column-1",
    title: "Column 1",
  },
  {
    id: "column-2",
    title: "Colum 2",
  },
  {
    id: "column-3",
    title: "Colum 3",
  },
];

interface IWidget {
  id: string;
  widget: {
    _id: string;
  };
  widgetId: string;
  _id: string;
  type: string;
  label: string;
  configWidget: IConfigWidget;
  column: "column-1" | "column-2" | "column-3" | string;
  widgetPositionId: string;
  dashboardId: string;
  deviceId: string;
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

function KanbanBoard() {
  const [columns, setColumns] = useState<Column[]>(defaultCols);
  const columnsId = useMemo(() => columns.map((col) => col.id), [columns]);
  const { editMode } = useAppSelector((state) => state.dashboard);
  const { displayAlert, showAlert, alertText, alertType } = useAlert();
  const { dashboard_id } = useParams();
  const [dashboardInfo, setDashboardInfo] = useState<{
    id?: string;
    nameDashboard: string;
    description: string;
  }>({ nameDashboard: "", description: "" });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedWidget, setSelectedWidget] = useState<string>("");
  const dispatch = useAppDispatch();

  const axiosPrivate = useAxiosPrivate();
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [isEditDialogOpen, setEditDialogOpen] = useState<boolean>(false);
  const [currentWidgets, setCurrentWidgets] = useState<IWidget[] | []>([]);
  const [widgets, setWidgets] = useState<IWidget[] | []>([]);
  const [payloadDevices, setPayloadDevices] = useState<
    { deviceId: string; mqttPublish: (payload: string) => void }[]
  >([]);

  const onDeleteSuccess = () => {
    displayAlert({
      msg: "Deleted 1 widget",
      type: "error",
    });
  };

  const onAddWidgetSuccess = async () => {
    await fetchDashboardById();
    displayAlert({
      msg: "Added your widget in dashboard",
      type: "success",
    });
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
      return setIsLoading(false);
    } catch (err: unknown) {
      const msg = await getAxiosErrorMessage(err)
      displayAlert({ msg, type: "error" })
      return setIsLoading(false);
    }
  };

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
                    console.log("Publish error: ", error);
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
                (err: unknown) => {
                  console.log("not sub", err);
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

  useEffect(() => {
    fetchDashboardById();
  }, []);

  const [activeColumn, setActiveColumn] = useState<Column | null>(null);

  const [activeTask, setActiveTask] = useState<WidgetObject | null>(null);
  const [isAccountUserDrawerOpen, setIsAccountUserDrawerOpen] =
    useState<boolean>(false);
  const [isSidebarShow, setIsSidebarShow] = useState<boolean>(true);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    })
  );

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

  const navigate = useNavigate();
  const [isEditDisplayShow, setIsEditDisplayShow] = useState<boolean>(false);
  useState<boolean>(false);

  const selectWidget = async (widgetID: string) => {
    setSelectedWidget(widgetID);
    setIsEditDisplayShow(true);
  };

  return (
    <Wrapper>
      <AccountUserDrawer
        isAccountUserDrawerOpen={isAccountUserDrawerOpen}
        setIsAccountUserDrawerOpen={setIsAccountUserDrawerOpen}
      />
      <AddDisplayDialog
        isEditDialogOpen={isEditDialogOpen}
        setEditDialogOpen={setEditDialogOpen}
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
        />
      )}
      <div className="flex h-[100%]">
        <NavLinkSidebar isSidebarShow={isSidebarShow} />
        <NavDialog
          isDrawerOpen={isDrawerOpen}
          setIsDrawerOpen={setIsDrawerOpen}
        />
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
                  setEditDialogOpen(true);
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


          {widgets.length > 0 && <DndContext
            sensors={sensors}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            onDragOver={onDragOver}
          >
            <div className=" flex gap-4 ">
              <div className="flex gap-4 w-[100%] h-[100vh]">
                <SortableContext items={columnsId}>
                  <div className="grid grid-cols-3 w-[100%] gap-2 md:grid-cols-2 sm:grid-cols-1 h-fit mt-9">
                    {columns.map((col) => (
                      <ColumnContainer
                        key={col.id}
                        column={col}
                        payloadDevices={payloadDevices}
                        onDeleteSuccess={onDeleteSuccess}
                        dashboard_id={
                          dashboard_id !== undefined ? dashboard_id : ""
                        }
                        selectWidget={selectWidget}
                        fetchAllWidgets={fetchWidgetsInDashboard}
                        widgets={widgets.filter(
                          (widget) => widget.column === col.id
                        )}
                      />
                    ))}
                  </div>
                </SortableContext>
              </div>
            </div>

            {createPortal(
              <DragOverlay>
                {activeColumn && (
                  <ColumnContainer
                    column={activeColumn}
                    payloadDevices={payloadDevices}
                    onDeleteSuccess={onDeleteSuccess}
                    dashboard_id={
                      dashboard_id !== undefined ? dashboard_id : ""
                    }
                    selectWidget={selectWidget}
                    fetchAllWidgets={fetchWidgetsInDashboard}
                    widgets={widgets.filter(
                      (widget) => widget.column === activeColumn.id
                    )}
                  />
                )}
                {activeTask && <TaskCard task={activeTask} />}
              </DragOverlay>,
              document.body
            )}
          </DndContext>}
        </div>
      </div>
      {showAlert && (
        <div className="block sm:hidden">
          <SnackBar
            id="dashboard-snackbar"
            severity={alertType}
            showSnackBar={showAlert}
            snackBarText={alertText}
          />
        </div>
      )}
    </Wrapper>
  );

  function onDragStart(event: DragStartEvent) {
    if (event.active.data.current?.type === "Column") {
      setActiveColumn(event.active.data.current.column);
      return;
    }

    if (event.active.data.current?.type === "Task") {
      setActiveTask(event.active.data.current.widget);
      return;
    }
  }

  function onDragEnd(event: DragEndEvent) {
    setActiveColumn(null);
    setActiveTask(null);

    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveAColumn = active.data.current?.type === "Column";
    if (!isActiveAColumn) return;

    setColumns((columns) => {
      const activeColumnIndex = columns.findIndex((col) => col.id === activeId);
      const overColumnIndex = columns.findIndex((col) => col.id === overId);
      return arrayMove(columns, activeColumnIndex, overColumnIndex);
    });
  }

  async function onDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveATask = active.data.current?.type === "Task";
    const isOverATask = over.data.current?.type === "Task";

    if (!isActiveATask) return;

    if (isActiveATask && isOverATask) {
      setWidgets((widgets) => {
        const activeIndex = widgets.findIndex((t) => t.id === activeId);
        const overIndex = widgets.findIndex((t) => t.id === overId);

        if (widgets[activeIndex].column != widgets[overIndex].column) {
          widgets[activeIndex].column = widgets[overIndex].column;
          return arrayMove(widgets, activeIndex, overIndex - 1);
        }
        localStorage.setItem(
          "widgets",
          JSON.stringify(arrayMove(widgets, activeIndex, overIndex))
        );
        return arrayMove(widgets, activeIndex, overIndex);
      });
    }

    const isOverAColumn = over.data.current?.type === "Column";

    if (isActiveATask && isOverAColumn) {
      setWidgets((widgets) => {
        const activeIndex = widgets.findIndex((t) => t.id === activeId);

        widgets[activeIndex].column = overId as string;
        return arrayMove(widgets, activeIndex, activeIndex);
      });
    }
  }
}

export default KanbanBoard;

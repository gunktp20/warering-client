import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { Column } from "./types";
import { CSS } from "@dnd-kit/utilities";
import { useEffect, useMemo, useState } from "react";

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

type MqttPublish = (payload: string) => void;

interface Props {
  column: Column;
  dashboard_id: string;
  widgets: IWidget[];
  onDeleteSuccess: () => void;
  payloadDevices: {
    deviceId: string;
    [key: string]: string | number | MqttPublish;
  }[];
  selectWidget: (widget_id: string) => void;
  fetchAllWidgets: () => void;
}

import {
  ButtonControl,
  Gauge,
  MessageBox,
  RangeSlider,
  ToggleSwitch,
} from "../../components/widgets_dashboard";
import LineChart from "../../components/widgets_dashboard/LineChart";
import { useAppSelector } from "../../app/hooks";

function ColumnContainer({
  column,
  dashboard_id,
  widgets,
  payloadDevices,
  selectWidget,
  fetchAllWidgets,
  onDeleteSuccess,
}: Props) {
  const { editMode } = useAppSelector((state) => state.dashboard);
  const [renderedWidgets, setRenderedWidgets] = useState<JSX.Element[]>([]);

  const urgentMqttPublisher = (payload: string): void => {
    console.log(payload);
  };

  const processWidgets = async (widgets: IWidget[]): Promise<JSX.Element[]> => {
    const widgetPromises = widgets.map(async (widget, index: number) => {
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
            editMode={editMode}
            id={""}
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
            editMode={editMode}
            id={""}
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
            editMode={editMode}
            id={""}
          />
        );
      }
      if (widget.type === "ToggleSwitch") {
        const matchedPayload = payloadDevices?.find(
          (payload) => payload?.deviceId === widget?.deviceId
        );

        console.log(typeof matchedPayload?.mqttPublish);

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
            editMode={editMode}
            id={""}
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
            editMode={editMode}
            id={""}
          />
        );
      }
      if (widget.type === "LineChart") {
        const matchedPayload = payloadDevices?.find(
          (payload) => payload?.deviceId === widget?.deviceId
        );

        return (
          <LineChart
            widget={widget}
            onDeleteSuccess={onDeleteSuccess}
            key={index}
            widgetId={widget?.id}
            label={widget?.label}
            min={widget?.configWidget?.min}
            max={widget?.configWidget?.max}
            fetchAllWidgets={fetchAllWidgets}
            value={
              matchedPayload !== undefined
                ? matchedPayload?.[widget?.configWidget?.value]
                : null
            }
            selectWidget={selectWidget}
            dashboardId={dashboard_id}
            editMode={editMode}
            id={""}
          />
        );
      }
    });
    const resolvedWidgets = await Promise.all(widgetPromises);
    return resolvedWidgets.filter(
      (element): element is JSX.Element => element !== undefined
    );
  };

  const tasksIds = useMemo(() => {
    return widgets.map((widget) => widget.id);
  }, [widgets]);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    data: {
      type: "Column",
      column,
    },
    disabled: false,
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  useEffect(() => {
    const renderWidgets = async () => {
      const widgetsToRender = await processWidgets(widgets);
      setRenderedWidgets(widgetsToRender);
    };

    renderWidgets();
  }, [widgets]);

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="
      bg-columnBackgroundColor
      opacity-40
      border-[30px]
     
      w-[500px]
      h-[100vh]
      rounded-md
      flex
      flex-col
      "
      ></div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="
w-[100%]
h-fit
rounded-md
flex
flex-col
"
    >
      <div
        {...attributes}
        {...listeners}
        className="
      text-md
      cursor-grab
      rounded-md
      rounded-b-none
      font-bold
    
      flex
      items-center
      justify-between
      text-black
      "
      >
        <div className="flex gap-2">
          <div
            className="
      flex
      justify-center
      items-center
      px-2
      py-1
      text-sm
      rounded-full
      text-white
      "
          ></div>
        </div>
      </div>
      <div className="flex grow flex-col gap-4 p-2 overflow-x-hidden overflow-y-auto ">
        <SortableContext items={tasksIds}>{renderedWidgets}</SortableContext>
      </div>
    </div>
  );
}

export default ColumnContainer;

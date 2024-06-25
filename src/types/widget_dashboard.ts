type MqttPublish = (payload: string) => void;
export type SelectWidget = (widget_id: string) => void;
export type FetchAllWidgets = () => void;

interface IWidget {
  id: string;
}

export interface IWidgetProp {
  widgetId: string;
  label: string;
  column?: "column-1" | "column-2" | "column-3" | string;
  widgetPositionId?: string;
  dashboardId: string;
  onDeleteSuccess: () => void;
  handleDragStart: (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    e: any,
    widget: { id: string; column: string }
  ) => void;
}

export interface IWidgetControlProp {
  fetchAllWidgets: FetchAllWidgets;
  publishMQTT: MqttPublish;
  selectWidget: SelectWidget;
}

export interface IWidgetDisplayProp {
  fetchAllWidgets: FetchAllWidgets;
  selectWidget: SelectWidget;
}

export interface IToggleSwitchDashboardProp
  extends IWidgetProp,
    IWidgetControlProp {
  widget: IWidget;
  label: string;
  widgetId: string;
  value: number | null | string | MqttPublish;
  on_payload: string | number;
  off_payload: string | number;
}

export interface IButtonControlDashboardProp
  extends IWidgetProp,
    IWidgetControlProp {
  widget: IWidget;
  button_label: string;
  payload: string;
}

export interface IGaugeDashboardProp extends IWidgetProp, IWidgetDisplayProp {
  widget: IWidget;
  label: string;
  value: number | null | string | MqttPublish;
  min: number;
  max: number;
  unit: string;
}

export interface ILineChartDashboardProp extends IWidgetDisplayProp {
  min: number;
  max: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload: any;
  keys: string[];
  colors: string[];
  id?: string;
  widgetId: string;
  label: string;
  column?: "column-1" | "column-2" | "column-3" | string;
  widgetPositionId?: string;
  dashboardId: string;
  onDeleteSuccess: () => void;
}

export interface IMessageBoxDashboardProp
  extends IWidgetProp,
    IWidgetDisplayProp {
  widget: IWidget;
  label: string;
  value: number | null | string | MqttPublish;
  unit?: string;
}

export interface IRangeSliderDashboardProp
  extends IWidgetProp,
    IWidgetControlProp {
  widget: IWidget;
  widgetId: string;
  min: number;
  max: number;
  value: number | null | string | MqttPublish;
}

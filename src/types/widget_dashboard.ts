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
  editMode: boolean;
}

export interface IButtonControlDashboardProp
  extends IWidgetProp,
    IWidgetControlProp {
  widget: IWidget;
  button_label: string;
  payload: string;
  editMode: boolean;
}

export interface IGaugeDashboardProp extends IWidgetProp, IWidgetDisplayProp {
  widget: IWidget;
  label: string;
  value: number | null | string | MqttPublish;
  min: number;
  max: number;
  unit: string;
  editMode: boolean;
}

export interface ILineChartDashboardProp
  extends IWidgetProp,
    IWidgetDisplayProp {
  widget: IWidget;
  value: number | null | string | MqttPublish;
  min: number;
  max: number;
  editMode: boolean;
}

export interface IMessageBoxDashboardProp
  extends IWidgetProp,
    IWidgetDisplayProp {
  widget: IWidget;
  label: string;
  value: number | null | string | MqttPublish;
  unit?: string;
  editMode: boolean;
}

export interface IRangeSliderDashboardProp
  extends IWidgetProp,
    IWidgetControlProp {
  widget: IWidget;
  widgetId: string;
  min: number;
  max: number;
  value: number | null | string | MqttPublish;
  editMode: boolean;
}

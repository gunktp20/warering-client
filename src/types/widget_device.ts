export type PublishMQTT = (payload: string) => void;
export type SelectWidget = (widget_id: string) => void;
export type FetchAllWidgets = () => void;

export interface IWidgetProp {
  label: string;
  widgetId: string;
}

export interface IWidgetControlProp {
  fetchAllWidgets: FetchAllWidgets;
  publishMQTT: PublishMQTT;
  selectWidget: SelectWidget;
}

export interface IWidgetDisplayProp {
  fetchAllWidgets: FetchAllWidgets;
  selectWidget: SelectWidget;
}

export interface IToggleSwitchDeviceProp
  extends IWidgetControlProp,
    IWidgetProp {
  value: string;
  on_payload: string | number;
  off_payload: string | number;
}

export interface IButtonControlDeviceProp
  extends IWidgetControlProp,
    IWidgetProp {
  label: string;
  widgetId: string;
  button_label: string;
  payload: string;
}

export interface IGaugeDeviceProp extends IWidgetDisplayProp, IWidgetProp {
  value: string | number | null;
  min: number;
  max: number;
  unit: string;
}

export interface ILineChartDeviceProp extends IWidgetDisplayProp, IWidgetProp {
  id?: string;
  colors:string[];
  min: number;
  max: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  keys: string[];
}

export interface IRangeSliderDeviceProp
  extends IWidgetControlProp,
    IWidgetProp {
  value: string;
  unit?: string;
  min: number;
  max: number;
}

export interface IMessageBoxDeviceProp extends IWidgetDisplayProp, IWidgetProp {
  value: string | number | null;
  unit?: string;
}

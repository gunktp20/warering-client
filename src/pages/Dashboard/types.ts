export type Id = string | number;

export type Column = {
  id: Id;
  title: string;
};

export interface IWidget {
  _id: string;
  type: string;
  label: string;
  configWidget: IConfigWidget;
  column?: "column-1" | "column-2" | "column-3";
}

export interface IConfigWidget {
  value: string;
  min: number;
  max: number;
  unit: string;
  button_label: string;
  payload: string;
  on_payload: string;
  off_payload: string;
}

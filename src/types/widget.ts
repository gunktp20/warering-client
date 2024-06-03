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

export interface IWidget {
  _id: string;
  deviceId: string;
  label: string;
  type: string;
  configWidget: IConfigWidget;
  createdAt: string;
  updatedAt: string;
}

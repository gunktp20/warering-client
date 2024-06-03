import { IDevice } from "../../../types/device";

export interface IDeviceState {
  deviceOffline: number;
  deviceOnline: number;
  totalDevice: number;
  totalDeviceDeny: number;
  devices: IDevice[];
  selectedDevice: string;
}

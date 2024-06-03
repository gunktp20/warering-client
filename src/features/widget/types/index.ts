import { IWidget } from "../../../types/widget";

export interface IWidgetState {
  selectedWidget: string;
  selectedWidgetInfo: null | IWidget;
  showAlert: boolean;
  alertType: "error" | "success" | "info" | "warning";
  alertText: "";
}

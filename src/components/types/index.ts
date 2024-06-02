export interface ISnackBarProp {
  id: string;
  severity: "error" | "success" | "warning" | "info";
  showSnackBar: boolean;
  snackBarText: string;
}

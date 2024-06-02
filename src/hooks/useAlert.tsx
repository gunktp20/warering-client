import { useState } from "react";
import useTimeout from "./useTimeout";

function useAlert() {
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alertText, setAlertText] = useState<string>("");
  const [alertType, setAlertType] = useState<
    "error" | "success" | "info" | "warning"
  >("error");

  const closeAlert = (): void => {
    setShowAlert(false);
  };

  const { callHandler } = useTimeout({
    executeAction: closeAlert,
  });

  const displayAlert = ({
    msg,
    type,
  }: {
    msg: string;
    type: "error" | "success" | "info" | "warning";
  }) => {
    setShowAlert(true);
    setAlertText(msg);
    setAlertType(type);
    return callHandler();
  };

  return {
    showAlert,
    setShowAlert,
    alertText,
    setAlertText,
    alertType,
    setAlertType,
    displayAlert,
  };
}

export default useAlert;

import AlertMui from "@mui/material/Alert";

interface IProp {
  alertText: string;
  alertType: "error" | "success" | "info" | "warning";
}

function Alert(props: IProp) {
  return (
    <AlertMui
      severity={props.alertType}
      sx={{
        fontSize: "11.5px",
        alignItems: "center",
        marginTop: "1.6rem",
      }}
    >
      {props.alertText}
    </AlertMui>
  );
}

export default Alert;

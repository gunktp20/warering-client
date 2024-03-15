import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

interface IProp {
  severity: "error" | "success" | "warning" | "info";
  showSnackBar: boolean;
  snackBarText: string;
  setShowSnackBar: (active: boolean) => void;
}

export default function SnackBar({
  severity,
  showSnackBar,
  snackBarText,
}: IProp) {
  const vertical = "top";
  const horizontal = "right";

  return (
    <div>
      <Snackbar
        open={showSnackBar}
        autoHideDuration={6000}
        anchorOrigin={{ vertical, horizontal }}
      >
        <Alert
          severity={severity}
          sx={{
            width: "100%",
            fontSize: "12px",
            alignItems: "center",
            paddingX: "2rem",
            border:severity === "error" ? 1:0,
            borderColor:severity === "error" ? "#d7414128":null,
          }}
        >
          {snackBarText}
        </Alert>
      </Snackbar>
    </div>
  );
}

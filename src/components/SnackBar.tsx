import { Snackbar, Button } from "@mui/material";
import { useState } from "react";

function MuiSnackBar() {
  const [open, setOpen] = useState(false);
  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };
  return (
    <div>
      <Button onClick={() => setOpen(true)}>Submit</Button>
      <Snackbar
        message="Form submitted successfully!"
        autoHideDuration={4000}
        open={open}
        onClose={handleClose}
      />
    </div>
  );
}

export default MuiSnackBar;

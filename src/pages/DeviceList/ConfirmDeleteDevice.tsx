import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogContentText from "@mui/material/DialogContentText";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useAppSelector } from "../../app/hooks";
import getAxiosErrorMessage from "../../utils/getAxiosErrorMessage";
import useAlert from "../../hooks/useAlert";
import { SnackBar } from "../../components";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface IProps {
  isDeleteConfirmOpen: boolean;
  setIsDeleteConfirmOpen: (active: boolean) => void;
  hookDeleteSuccess: () => void
}

export default function ConfirmDelete({ isDeleteConfirmOpen, setIsDeleteConfirmOpen, hookDeleteSuccess }: IProps) {

  const axiosPrivate = useAxiosPrivate();
  const { selectedDevice } = useAppSelector((state) => state.device)
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { showAlert, alertText, alertType, displayAlert } = useAlert()

  const deleteDevice = async () => {
    setIsLoading(true);
    try {
      await axiosPrivate.delete(`/devices/${selectedDevice}`);
      setIsLoading(false);
      setIsDeleteConfirmOpen(false);
      hookDeleteSuccess();
    } catch (err: unknown) {
      const msg = await getAxiosErrorMessage(err)
      setIsLoading(false);
      displayAlert({ msg, type: "error" })
    }
  };

  const handleClose = () => {
    if (isLoading) {
      return;
    }
    setIsDeleteConfirmOpen(false);
  };

  return (
    <React.Fragment>
      <Dialog
        open={isDeleteConfirmOpen}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        id="confirm-delete-device-dialog"
      >
        <DialogContentText
          id="confirm-delete-device-dialog-content"
          className="py-7 px-11"
          component={"div"}
          variant={"body2"}
        >
          <div className="text-[#dc3546] text-[15.5px] text-center">
            Are you sure you want to delete?
          </div>
          <div className="mt-4 flex justify-center gap-3 w-[100%]">
            <button
              onClick={handleClose}
              disabled={isLoading}
              id="cancel-delete-device"
              className="text-black text-[12.5px] border-[1px] border-[#000] rounded-sm px-10 py-[0.4rem]"
            >
              Cancel
            </button>
            <button onClick={() => {
              deleteDevice()
            }}
              id="confirm-delete-device"
              disabled={isLoading} className="bg-[#dc3546] text-[12.5px] text-white px-10 py-[0.4rem] rounded-sm">
              Delete
            </button>
          </div>
          {showAlert && (
            <div className="block sm:hidden">
              <SnackBar
                id="confirm-delete-snackbar"
                severity={alertType}
                showSnackBar={showAlert}
                snackBarText={alertText}
              />
            </div>
          )}
        </DialogContentText>
      </Dialog>
    </React.Fragment>
  );
}

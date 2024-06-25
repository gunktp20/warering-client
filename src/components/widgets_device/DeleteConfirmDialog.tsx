import { useState } from "react";
import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogContentText from "@mui/material/DialogContentText";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import getAxiosErrorMessage from "../../utils/getAxiosErrorMessage";
import useAlert from "../../hooks/useAlert";
import SnackBar from "../SnackBar";
import useTimeout from "../../hooks/useTimeout";
import { clearAlert, displayAlert as displayWidgetAlert } from "../../features/widget/widgetSlice";

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
  fetchAllWidgets: () => void;
}

function DeleteConfirmDialog({
  isDeleteConfirmOpen,
  setIsDeleteConfirmOpen,
  fetchAllWidgets,
}: IProps) {

  const axiosPrivate = useAxiosPrivate();
  const dispatch = useAppDispatch()
  const { selectedWidget } = useAppSelector((state) => state.widget)
  const { showAlert, alertType, alertText } = useAlert()
  const { displayAlert } = useAlert()
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleClose = () => {
    setIsDeleteConfirmOpen(false);
  };

  const { callHandler: clearWidgetAlert } = useTimeout({ executeAction: () => dispatch(clearAlert()), duration: 3000 })

  const deleteWidget = async () => {
    setIsLoading(true);
    try {
      const { data } = await axiosPrivate.get(`/widgets/${selectedWidget}/widget`);
      await axiosPrivate.delete(`/widgets/${selectedWidget}/device/${data?.deviceId}`);
      setIsLoading(false);
      setIsDeleteConfirmOpen(false);
      fetchAllWidgets();
      dispatch(displayWidgetAlert({ msg: "Your widget was deleted", type: "error" }))
      document.body.classList.remove('no-scroll');
      clearWidgetAlert()
    } catch (err) {
      const msg = await getAxiosErrorMessage(err)
      setIsLoading(false);
      displayAlert({ msg, type: "error" })
    }
  };

  return (
    <React.Fragment>
      <Dialog
        open={isDeleteConfirmOpen}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
        id={`confirm-delete-widget-device-dialog`}
      >
        <DialogContentText
          id={`confirm-delete-widget-device-dialog-content`}
          className="py-7 px-11"
          component={"div"}
          variant={"body2"}
        >
          <div className="text-[#dc3546] text-[15.5px] text-center">
            Are you sure you want to delete this widget?
          </div>
          <div className="mt-4 flex justify-center gap-3 w-[100%]">
            <button
              onClick={handleClose}
              className="text-black text-[12.5px] border-[1px] border-[#000] rounded-sm px-10 py-[0.4rem]"
              id="cancel-delete-widget-device-btn"
            >
              Cancel
            </button>
            <button
              disabled={isLoading}
              onClick={() => {
                deleteWidget();
              }}
              id="delete-submit-widget-device-btn"
              className="bg-[#dc3546] text-[12.5px] text-white px-10 py-[0.4rem] rounded-sm"
            >
              Delete
            </button>
          </div>
          {showAlert && (
            <div className="block sm:hidden">
              <SnackBar
                id="delete-widget-device-snackbar"
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

export default DeleteConfirmDialog
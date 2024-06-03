import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogContentText from "@mui/material/DialogContentText";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import { useAppDispatch } from "../../app/hooks";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { logout } from "../../features/auth/authSlice";
import useAlert from "../../hooks/useAlert";
import getAxiosErrorMessage from "../../utils/getAxiosErrorMessage";
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
}

export default function ConfirmDeleteAccount(props: IProps) {
  const axiosPrivate = useAxiosPrivate();
  const dispatch = useAppDispatch()
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const { showAlert, alertText, alertType, displayAlert } = useAlert()
  const handleClose = () => {
    props.setIsDeleteConfirmOpen(false);
  };

  const deleteUser = async () => {
    setIsLoading(true)
    try {
      await axiosPrivate.delete("/users")
      setIsLoading(false)
      return signOut()
    } catch (err) {
      setIsLoading(false)
      const msg = await getAxiosErrorMessage(err)
      displayAlert({ msg, type: "error" })
    }
  }

  const signOut = async () => {
    dispatch(logout());
    await axiosPrivate.post(
      `/auth/logout`,
      {},
    );
  };

  return (
    <React.Fragment>
      <Dialog
        open={props.isDeleteConfirmOpen}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogContentText
          id="confirm-delete-dashboard-dialog"
          className="py-7 px-11"
          component={"div"}
          variant={"body2"}
        >
          <div className="text-[#dc3546] text-[15.5px] text-center">
            Delete account
          </div>
          <div className="mt-[1.3rem] text-[#000]">
            We are sorry to see you go. When your account is deleted All of your
            content will be permanently lost. including profile
          </div>
          <div className="mt-[1.3rem] text-[#000]">
            To confirm deletion, type “delete” below:
          </div>
          <div className="mt-6 flex justify-end gap-3 w-[100%] text-[#000]">
            <button
              onClick={handleClose}
              className="text-[#DC3546] text-[12.5px] border-[1px] border-[#DC3546] rounded-sm px-10 py-[0.5rem]"
            >
              Cancel
            </button>
            <button onClick={deleteUser} className="bg-[#f1aeb5] hover:bg-[#DC3546] text-[12.5px] text-white px-10 py-[0.5rem] rounded-sm">
              {isLoading ? "Loading..." : "Delete Account"}
            </button>
          </div>
          {showAlert && (
            <div className="block sm:hidden">
              <SnackBar
                id="edit-widget-snackbar"
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

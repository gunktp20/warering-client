import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogContentText from "@mui/material/DialogContentText";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
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
  const handleClickOpen = () => {
    props.setIsDeleteConfirmOpen(true);
  };

  const handleClose = () => {
    props.setIsDeleteConfirmOpen(false);
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
            <button className="bg-[#f1aeb5] text-[12.5px] text-white px-10 py-[0.5rem] rounded-sm">
              Delete Account
            </button>
          </div>
        </DialogContentText>
      </Dialog>
    </React.Fragment>
  );
}

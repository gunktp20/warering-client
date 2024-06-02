import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogContentText from "@mui/material/DialogContentText";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";

interface IProps {
  widgetId: string;
  isDeleteConfirmOpen: boolean;
  setIsDeleteConfirmOpen: (active: boolean) => void;
  fetchAllWidgets: () => void;
}

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function ConfirmDelete({
  widgetId,
  isDeleteConfirmOpen,
  setIsDeleteConfirmOpen,
  fetchAllWidgets,
}: IProps) {
  const axiosPrivate = useAxiosPrivate();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const handleClose = () => {
    setIsDeleteConfirmOpen(false);
  };

  const onDelete = async () => {
    setIsLoading(true);
    try {
      const { data } = await axiosPrivate.delete(`/widgets/${widgetId}`);
      console.log(data);
      setIsLoading(false);
      setIsDeleteConfirmOpen(false);
      fetchAllWidgets();
    } catch (err) {
      setIsLoading(false);
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
      >
        <DialogContentText
          id="confirm-delete-dashboard-dialog"
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
            >
              Cancel
            </button>
            <button
              disabled={isLoading}
              onClick={() => {
                onDelete();
              }}
              className="bg-[#dc3546] text-[12.5px] text-white px-10 py-[0.4rem] rounded-sm"
            >
              Delete
            </button>
          </div>
        </DialogContentText>
      </Dialog>
    </React.Fragment>
  );
}

export default ConfirmDelete;

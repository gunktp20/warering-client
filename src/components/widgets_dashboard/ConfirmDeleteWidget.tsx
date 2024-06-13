import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogContentText from "@mui/material/DialogContentText";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import useAlert from "../../hooks/useAlert";
import getAxiosErrorMessage from "../../utils/getAxiosErrorMessage";
import SnackBar from "../SnackBar";

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement;
    },
    ref: React.Ref<unknown>
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

interface IProps {
    widgetId: string;
    isDeleteConfirmOpen: boolean;
    setIsDeleteConfirmOpen: (active: boolean) => void;
    fetchAllWidgets: () => void;
    dashboardId: string;
    onDeleteSuccess: () => void;
}

function ConfirmDelete({
    widgetId,
    isDeleteConfirmOpen,
    setIsDeleteConfirmOpen,
    fetchAllWidgets,
    dashboardId,
    onDeleteSuccess,
}: IProps) {
    const axiosPrivate = useAxiosPrivate();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { showAlert, alertText, alertType, displayAlert } = useAlert()

    const handleClose = () => {
        setIsDeleteConfirmOpen(false);
    };

    const onDelete = async () => {
        setIsLoading(true);
        try {
            await axiosPrivate.delete(
                `/dashboards/${dashboardId}/widget/${widgetId}`
            );
            setIsLoading(false);
            setIsDeleteConfirmOpen(false);
            fetchAllWidgets();
            return onDeleteSuccess();
        } catch (err) {
            const msg = await getAxiosErrorMessage(err)
            displayAlert({ msg, type: "error" })
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
                id="confirm-delete-widget-dashboard-dialog"
            >
                <DialogContentText
                    id="confirm-delete-dashboard-dialog-content"
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
                            id="cancel-delete-widget-dashboard-btn"
                        >
                            Cancel
                        </button>
                        <button
                            disabled={isLoading}
                            onClick={() => {
                                onDelete();
                            }}
                            id="submit-delete-widget-dashboard-btn"
                            className="bg-[#dc3546] text-[12.5px] text-white px-10 py-[0.4rem] rounded-sm"
                        >
                            Delete
                        </button>
                    </div>
                    {showAlert && (
                        <div className="block sm:hidden">
                            <SnackBar
                                id="delete-widget-dashboard-snackbar"
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

export default ConfirmDelete;

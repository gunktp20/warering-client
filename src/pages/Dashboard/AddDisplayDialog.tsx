import React, { useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import { SnackBar } from "../../components";
import { Button, Alert } from "@mui/material";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import useAlert from "../../hooks/useAlert";
import getAxiosErrorMessage from "../../utils/getAxiosErrorMessage";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface IDrawer {
  isEditDialogOpen: boolean;
  setEditDialogOpen: (active: boolean) => void;
  selectedDashboard: string | undefined;
  hookAddSuccess: () => void;
  dashboard_id: string | undefined;
}

export default function AddDisplayDialog({
  isEditDialogOpen,
  setEditDialogOpen,
  hookAddSuccess,
  dashboard_id,
}: IDrawer) {
  const axiosPrivate = useAxiosPrivate();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { alertType, alertText, showAlert, displayAlert } = useAlert();

  const fetchAllDevice = async () => {
    setIsLoading(true);
    try {
      const { data } = await axiosPrivate.get(`/devices?limit=100`);
      setDeivceOptions(data?.data);
      return setIsLoading(false);
    } catch (err: unknown) {
      return setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllDevice();
  }, []);

  const onSubmit = async () => {
    if (!selectedDevice || !selectedWidget) {
      displayAlert({
        msg: "Please provide all values",
        type: "error",
      });
      return;
    }
    await AddDisplay();
  };

  const [deivceOptions, setDeivceOptions] = useState<
    { id: string; nameDevice: string }[]
  >([]);
  const [widgetOptions, setWidgetOptions] = useState<
    { id: string; label: string }[]
  >([]);
  const [selectedDevice, setSelectedDevice] = useState<string>("");
  const [selectedWidget, setSelectedWidget] = useState<string>("");

  const handleClose = () => {
    if (isLoading) {
      return;
    }
    setEditDialogOpen(false);
  };

  const fetchWidgetByDeviceId = async (deviceId: string) => {
    setIsLoading(true);
    try {
      const { data } = await axiosPrivate.get(`/widgets/${deviceId}`);
      console.log(data);
      setSelectedWidget("");
      setWidgetOptions(data);
      return setIsLoading(false);
    } catch (err: unknown) {
      return setIsLoading(false);
    }
  };

  const AddDisplay = async () => {
    setIsLoading(true);
    try {
      await axiosPrivate.post(
        `/dashboards/${dashboard_id}/widget/${selectedWidget}`
      );
      displayAlert({
        msg: "Added your widget to dashboard",
        type: "success",
      });
      setEditDialogOpen(false);
      setIsLoading(false);
      return hookAddSuccess();
    } catch (err: unknown) {
      const msg = await getAxiosErrorMessage(err);
      displayAlert({
        msg: msg,
        type: "error",
      });
      return setIsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedDevice) {
      fetchWidgetByDeviceId(selectedDevice);
    }
  }, [selectedDevice]);

  return (
    <div>
      <Dialog
        open={isEditDialogOpen}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        className="flex items-center justify-center"
      >
        <DialogContent>
          <DialogContentText
            id="alert-dialog-slide-description"
            className="p-3 "
            component={"div"}
            variant={"body2"}
          >
            <div className="w-[100%] flex flex-col">
              <div className="top-0 left-0 absolute w-[100%] h-[48px] bg-primary-500 flex justify-center items-center text-white text-[16px] font-medium">
                Add Display
              </div>
              <div className="text-[12px] text-nowrap text-transparent z-0 h-[0px] sm:mb-7">
                -----------------------------------------------------------------------------.
              </div>
              {showAlert && alertType && (
                <div className="hidden sm:block mb-0 mt-3">
                  <Alert
                    severity={alertType}
                    sx={{
                      fontSize: "11.8px",
                      alignItems: "center",
                    }}
                  >
                    {alertText}
                  </Alert>
                </div>
              )}
              <div className="flex sm:flex-col gap-7 mt-7 sm:gap-2 sm:mt-0">
                <div className=" pb-2 sm:w-[100%] mt-3">
                  <label className="text-[12px] text-[#000]">Device</label>
                  <select
                    id="select_widget"
                    disabled={deivceOptions.length === 0 ? true : false}
                    className={`device bg-gray-50 w-[250px] sm:w-[100%] border border-gray-300 mt-1 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block px-5 py-2`}
                    value={selectedDevice}
                    onChange={(e) => {
                      setSelectedDevice(e?.target.value);
                    }}
                  >
                    <option value={""} disabled>
                      null
                    </option>
                    {deivceOptions.map((device, index) => {
                      return (
                        <option key={index} value={device?.id}>
                          {device?.nameDevice}
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div className="pb-2 sm:w-[100%] mt-3 sm:mt-2">
                  <label className="text-[12px] text-[#000]">Widget</label>
                  <select
                    disabled={widgetOptions.length === 0 ? true : false}
                    id="select_widget"
                    className={`device bg-gray-50 w-[250px] sm:w-[100%] border border-gray-300 mt-1 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block px-5 py-2 text-gray-900`}
                    value={selectedWidget}
                    aria-placeholder=""
                    onChange={(e) => {
                      setSelectedWidget(e?.target.value);
                    }}
                  >
                    <option value={""} disabled>
                      null
                    </option>
                    {widgetOptions.length !== 0 &&
                      widgetOptions.map((widget, index) => {
                        return (
                          <option key={index} value={widget?.id}>
                            {widget?.label}
                          </option>
                        );
                      })}
                  </select>
                </div>
              </div>
            </div>
            <div className=" sm:w-[100%] flex justify-between sm:flex-col">
              <div className="w-[250px] sm:w-[100%]">
                <Button
                  onClick={() => {
                    handleClose();
                  }}
                  style={{
                    textTransform: "none",
                    width: "100%",
                    height: "39px",
                    marginTop: "1.5rem",
                  }}
                  sx={{
                    borderColor: "#dc3546",
                    color: "#dc3546",
                    ":hover": {
                      bgcolor: "#dc3546",
                      color: "#fff",
                      border: "#dc3546",
                    },
                    ":disabled": {
                      color: "#fff",
                    },
                  }}
                  variant="outlined"
                  id="setup-user-submit"
                >
                  Cancel
                </Button>
              </div>
              <div className="w-[250px] sm:w-[100%]">
                <Button
                  onClick={() => {
                    onSubmit();
                  }}
                  style={{
                    textTransform: "none",
                    width: "100%",
                    height: "39px",
                    marginTop: "1.5rem",
                  }}
                  sx={{
                    bgcolor: "#1966fb",
                    ":hover": {
                      bgcolor: "#10269C",
                    },
                    ":disabled": {
                      color: "#fff",
                    },
                  }}
                  variant="contained"
                  id="setup-user-submit"
                >
                  Add Display
                </Button>
              </div>
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
        </DialogContent>
      </Dialog>
    </div>
  );
}

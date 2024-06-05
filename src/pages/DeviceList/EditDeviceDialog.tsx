import React, { useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import { FormRow, FormSelect, SnackBar } from "../../components";
import { Button } from "@mui/material";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { Alert } from "@mui/material";
import getAxiosErrorMessage from "../../utils/getAxiosErrorMessage";
import useAlert from "../../hooks/useAlert";
import { useAppSelector } from "../../app/hooks";

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
  hookEditSuccess: () => void;
}

interface IValue {
  nameDevice: string;
  usernameDevice: string;
  password?: string;
  description: string;
  topics: string;
  qos?: number;
  retain?: boolean;
  isSaveData: boolean;
}

const initialState: IValue = {
  nameDevice: "",
  usernameDevice: "",
  password: "",
  description: "",
  topics: "",
  isSaveData: true,
};

export default function EditDeviceDialog({ isEditDialogOpen, setEditDialogOpen, hookEditSuccess }: IDrawer) {

  const axiosPrivate = useAxiosPrivate();
  const { selectedDevice } = useAppSelector((state) => state.device)
  const { showAlert, alertText, alertType, displayAlert } = useAlert();
  const [values, setValues] = useState<IValue>(initialState);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const options = [0, 1, 2];
  const [qos, setQos] = useState<number | string>(options[0]);
  const [retain, setRetain] = useState<boolean>(true);

  const [currentDeviceInfo, setCurrentDeviceInfo] =
    useState<IValue>(initialState);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleClose = () => {
    if (isLoading) {
      return;
    }
    setValues(currentDeviceInfo);
    setEditDialogOpen(false);
  };

  const fetchDeviceInfo = async () => {
    setIsLoading(true);
    try {
      const { data } = await axiosPrivate.get(
        `/devices/${selectedDevice}`
      );
      const {
        nameDevice,
        usernameDevice,
        description,
        topics,
        password,
        qos,
        retain,
        isSaveData,
      } = data;

      setValues({
        nameDevice,
        usernameDevice,
        description,
        password,
        topics: topics[0].split("/")[1],
        isSaveData,
      });
      setCurrentDeviceInfo({
        nameDevice,
        usernameDevice,
        description,
        password,
        topics: topics[0].split("/")[1],
        qos,
        retain,
        isSaveData,
      });
      setQos(qos);
      setRetain(retain);
      setIsLoading(false);
    } catch (err: unknown) {
      setIsLoading(false);
    }
  };

  const onSubmit = async () => {
    const { nameDevice, usernameDevice, password, description, topics } =
      values;
    if (
      !nameDevice ||
      !usernameDevice ||
      !description ||
      !password ||
      !topics
    ) {
      displayAlert({
        msg: "Please provide all value!",
        type: "error",
      });
      return;
    }
    const deviceInfo = {
      ...values,
      nameDevice:
        nameDevice === currentDeviceInfo.nameDevice ? undefined : nameDevice,
      usernameDevice:
        usernameDevice === currentDeviceInfo.usernameDevice
          ? undefined
          : usernameDevice,
      password: password === "" ? undefined : password,
      description,
      topics: topics === currentDeviceInfo.topics ? undefined : topics,
      retain: retain === currentDeviceInfo.retain ? undefined : retain,
      qos: Number(qos),
    };
    await editDevice(deviceInfo);
  };
  const editDevice = async (deviceInfo: unknown) => {
    setIsLoading(true);
    try {
      await axiosPrivate.put(`/devices/${selectedDevice}`, deviceInfo);
      setIsLoading(false);
      setEditDialogOpen(false)
      hookEditSuccess();

    } catch (err: unknown) {
      setValues(currentDeviceInfo);
      const msg = await getAxiosErrorMessage(err);
      displayAlert({
        msg,
        type: "error",
      });
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedDevice) {
      fetchDeviceInfo();
    }
  }, [selectedDevice]);

  return (
    <div>
      <Dialog
        open={isEditDialogOpen}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
        id="edit-device-dialog"
      >
        <DialogContent>
          <DialogContentText
            id="edit-device-dialog-content"
            className="p-3 "
            component={"div"}
            variant={"body2"}
          >
            <div className=" w-[100%] flex flex-col">
              <div
                id="edit-device-title"
                className="text-[17px] font-bold text-[#1D4469]"
              >
                Edit Device
              </div>
              <div className="text-sm text-[#a4a4a4] mt-3">
                Fill in the information to add a Dashboard from your device.
              </div>
            </div>
            {showAlert && alertType && (
              <div className="hidden sm:block">
                <Alert
                  id="edit-device-alert"
                  severity={alertType}
                  sx={{
                    fontSize: "11.8px",
                    alignItems: "center",
                    marginTop: "2rem",
                  }}
                >
                  {alertText}
                </Alert>
              </div>
            )}

            <div className="flex gap-10 mt-9 sm:flex-col sm:gap-0">
              <div className="w-[350px] sm:w-[100%]">
                <FormRow
                  type="text"
                  name="nameDevice"
                  labelText="Device name"
                  value={values.nameDevice}
                  handleChange={handleChange}
                  marginTop="mt-[0.2rem]"
                />
              </div>
              <div className="w-[350px] sm:w-[100%]">
                <FormRow
                  type="text"
                  name="usernameDevice"
                  labelText="username device"
                  value={values.usernameDevice}
                  handleChange={handleChange}
                  marginTop="mt-[0.2rem]"
                />
              </div>
            </div>
            <div className="flex gap-10 mt-3 sm:flex-col sm:gap-0">
              <div className="w-[350px] sm:w-[100%]">
                <FormRow
                  type="password"
                  name="password"
                  labelText="password"
                  value={values.password}
                  handleChange={handleChange}
                  marginTop="mt-[0.2rem]"
                />
              </div>
              <div className="w-[350px] sm:w-[100%]">
                <FormRow
                  type="text"
                  name="description"
                  labelText="description"
                  value={values.description}
                  handleChange={handleChange}
                  marginTop="mt-[0.2rem]"
                />
              </div>
            </div>
            <div className=" w-[100%] flex flex-col">
              <div className="text-[17px] font-bold text-[#1D4469]">
                Publish Detail
              </div>
            </div>
            <div className="flex gap-10 mt-5 sm:flex-col sm:gap-0">
              <div className="w-[350px] sm:w-[100%]">
                <FormRow
                  type="text"
                  name="topics"
                  labelText="topics"
                  value={values.topics}
                  handleChange={handleChange}
                  marginTop="mt-[0.2rem]"
                />
              </div>
              <div className="w-[350px] sm:w-[100%]">
                <FormSelect
                  labelText="Qos"
                  name="Qos"
                  options={options}
                  setValue={setQos}
                  value={qos}
                  marginTop="mt-[0.2rem]"
                />
              </div>
            </div>
            <div className="flex items-center">
              <label
                htmlFor="retain-edit-checkbox"
                className="ms-2 text-sm mr-2 font-medium text-[#1D4469] dark:text-gray-300"
              >
                Retain
              </label>
              <input
                id="link-checkbox"
                type="checkbox"
                name="retain"
                onChange={() => {
                  setRetain(!retain);
                }}
                checked={retain}
                className=" w-[15px] h-[15px] text-[#2CB1BC] bg-gray-100 border-gray-300 rounded focus:ring-[#ffffff00] dark:focus:ring-[#2CB1BC] dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
            <div className="flex sm:flex-col">
              <div className="w-[250px] sm:w-[100%] mr-5">
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
                    // bgcolor: "#1966fb",
                    ":hover": {
                      //   bgcolor: "#10269C",
                    },
                    ":disabled": {
                      color: "#fff",
                    },
                  }}
                  variant="outlined"
                  id="cancel-edit-device-btn"
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
                  id="edit-device-submit-btn"
                  disabled={isLoading}
                >
                  Save
                </Button>
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
            </div>
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </div>
  );
}

import React, { useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import { FormRow, SnackBar } from "../../components";
import { Button } from "@mui/material";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import useAlert from "../../hooks/useAlert";
import getAxiosErrorMessage from "../../utils/getAxiosErrorMessage";
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
  nameDashboard: string;
  description: string;
}

const initialState: IValue = {
  nameDashboard: "",
  description: "",
};

export default function EditDashboardDialog({ isEditDialogOpen, setEditDialogOpen, hookEditSuccess }: IDrawer) {
  const { selectedDashboard } = useAppSelector((state) => state.dashboard)
  const axiosPrivate = useAxiosPrivate();
  const [values, setValues] = useState<IValue>(initialState);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentDashboardInfo, setCurrentDashboardInfo] = useState<IValue>(initialState);
  const { alertType, alertText, showAlert, displayAlert } =
    useAlert();

  const onSubmit = async () => {
    const { nameDashboard, description } = values;
    if (!nameDashboard || !description) {
      displayAlert({
        msg: "Please provide all values",
        type: "error",
      });
      return;
    }
    await editDashboard(values);
  };

  const editDashboard = async (
    dashboardInfo:
      | {
        nameDashboard: string;
        description: string;
      }
      | undefined
  ) => {
    setIsLoading(true);
    try {
      await axiosPrivate.patch(
        `/dashboards/${selectedDashboard}`,
        dashboardInfo
      );
      setIsLoading(false);
      displayAlert({
        msg: "Updated your dashboard successfully",
        type: "success",
      });
      setEditDialogOpen(false)
      hookEditSuccess();
      return;
    } catch (err: unknown) {
      setValues(currentDashboardInfo);
      const msg = await getAxiosErrorMessage(err);
      displayAlert({
        msg,
        type: "error",
      });
      setIsLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleClose = () => {
    if (isLoading) {
      return;
    }
    setValues(currentDashboardInfo);
    setEditDialogOpen(false);
  };

  const fetchDashboardInfo = async () => {
    setIsLoading(true);
    try {
      const { data } = await axiosPrivate.get(
        `/dashboards/${selectedDashboard}`
      );
      const { nameDashboard, description } = data;
      setValues({ nameDashboard, description });
      setCurrentDashboardInfo({
        nameDashboard,
        description,
      });
      setIsLoading(false);
    } catch (err: unknown) {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedDashboard) {
      fetchDashboardInfo();
    }
  }, [selectedDashboard]);

  return (
    <div>
      <Dialog
        open={isEditDialogOpen}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
        className="m-5 "
      >
        <DialogContent>
          <DialogContentText
            id="alert-dialog-slide-description"
            className="p-3 "
            component={"div"}
            variant={"body2"}
          >
            <div className=" w-[100%] flex flex-col">
              <div className="text-[18px] font-bold text-[#1D4469]">
                Edit Dashboard
              </div>
              <div className="text-sm text-[#a4a4a4] mt-3">
                Fill in the information to add a Dashboard from your device.
              </div>
            </div>
            <div className="flex gap-10 mt-9 sm:flex-col sm:gap-0 md:flex-col md:gap-0">
              <div className="w-[350px] sm:w-[100%]">
                <FormRow
                  type="text"
                  name="nameDashboard"
                  labelText="Dashboard name"
                  value={values?.nameDashboard}
                  handleChange={handleChange}
                  marginTop="mt-[0.2rem]"
                />
              </div>
              <div className="w-[350px] sm:w-[100%]">
                <FormRow
                  type="text"
                  name="description"
                  labelText="description"
                  value={values?.description}
                  handleChange={handleChange}
                  marginTop="mt-[0.2rem] sm:hidden md:hidden"
                />
                <div className="w-100% hidden sm:block md:block mt-[1.2rem]">
                  <div className="relative w-full min-w-[200px]">
                    <textarea
                      onChange={handleChange}
                      value={values?.description}
                      name="description"
                      className="peer h-full min-h-[100px] w-full resize-none rounded-[7px] border border-gray-200 px-3 py-2.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-[1px] focus:border-second focus:border-t-transparent focus:outline-0 disabled:resize-none text-[13.5px] disabled:border-0 disabled:bg-blue-gray-50 text-[#000]"
                      placeholder=" "
                    ></textarea>
                    <label className="before:content[' '] after:content[' '] flex pointer-events-none absolute left-0 -top-1.5 h-full w-full select-none text-[11px] font-normal leading-tight text-gray-500 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block  after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-second peer-focus:before:border-t-[1px] peer-focus:before:border-l-2 peer-focus:after:border-t-1  peer-focus:after:border-second peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-second">
                      <div className="h-fit flex relative">Description</div>
                    </label>
                  </div>
                </div>
              </div>
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
                Edit Dashboard
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
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </div>
  );
}

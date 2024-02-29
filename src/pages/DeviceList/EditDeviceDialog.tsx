import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import { FormRow } from "../../components";
import { Button } from "@mui/material";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface IDrawer {
  isEditDialogOpen: boolean;
  setEditDialogOpen: (active: boolean) => void;
}

interface IValue {
  device_name: string;
  username_device: string;
  password: string;
  description: string;
  topic_device: string;
  Qos: string;
}

const initialState: IValue = {
  device_name: "device name",
  username_device: "username device",
  password: "password",
  description: "description",
  topic_device: "topic device",
  Qos: "Qos",
};

export default function EditDeviceDialog(props: IDrawer) {
  const { setEditDialogOpen } = props;
  const [values, setValues] = useState<IValue>(initialState);

  // const showDisplayAlert = (
  //   alertType: "warning" | "error" | "info" | "success",
  //   alertText: string
  // ) => {
  //   dispatch(
  //     displayAlert({
  //       alertType,
  //       alertText,
  //     })
  //   );
  //   setTimeout(() => {
  //     dispatch(clearAlert());
  //   }, 4000);
  // };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleClose = () => {
    setEditDialogOpen(false);
  };

  return (
    <div>
      <Dialog
        open={props.isEditDialogOpen}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogContent>
          <DialogContentText
            id="alert-dialog-slide-description"
            className="p-3 "
            component={"div"}
            variant={"body2"}
          >
            <div className=" w-[100%] flex flex-col">
              <div className="text-[17px] font-bold text-[#1D4469]">
                Edit Device
              </div>
              <div className="text-sm text-[#a4a4a4] mt-3">
                Fill in the information to add a Dashboard from your device.
              </div>
            </div>
            <div className="flex gap-10 mt-9 sm:flex-col sm:gap-0">
              <div className="w-[350px] sm:w-[100%]">
                <FormRow
                  type="text"
                  name="device_name"
                  labelText="Device name"
                  value={values.device_name}
                  handleChange={handleChange}
                  marginTop="mt-[0.2rem]"
                />
              </div>
              <div className="w-[350px] sm:w-[100%]">
                <FormRow
                  type="text"
                  name="username_device"
                  labelText="username device"
                  value={values.username_device}
                  handleChange={handleChange}
                  marginTop="mt-[0.2rem]"
                />
              </div>
            </div>
            <div className="flex gap-10 mt-3 sm:flex-col sm:gap-0">
              <div className="w-[350px] sm:w-[100%]">
                <FormRow
                  type="text"
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
                  name="topic_device"
                  labelText="topic device"
                  value={values.topic_device}
                  handleChange={handleChange}
                  marginTop="mt-[0.2rem]"
                />
              </div>
              <div className="w-[350px] sm:w-[100%]">
                <FormRow
                  type="text"
                  name="Qos"
                  labelText="Qos"
                  value={values.Qos}
                  handleChange={handleChange}
                  marginTop="mt-[0.2rem]"
                />
              </div>
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
                  id="setup-user-submit"
                >
                  Cancel
                </Button>
              </div>
              <div className="w-[250px] sm:w-[100%]">
                <Button
                  onClick={() => {}}
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
                  Save
                </Button>
              </div>
            </div>
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </div>
  );
}

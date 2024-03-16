import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import { NavLink } from "react-router-dom";
import { PiNotebookBold } from "react-icons/pi";
import { VscGraph } from "react-icons/vsc";
import { FiCpu } from "react-icons/fi";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface INavDialog {
  isDrawerOpen: boolean;
  setIsDrawerOpen: (active: boolean) => void;
}

export default function SmallNavLinks(props: INavDialog) {
  const { isDrawerOpen, setIsDrawerOpen } = props;

  const handleClose = () => {
    setIsDrawerOpen(false);
  };

  return (
    <div>
      <Dialog
        open={isDrawerOpen}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
        fullScreen
        className="m-5 hidden sm:block"
      >
        <DialogContent>
          <DialogContentText
            className="p-3 relative "
            component={"div"}
            variant={"body2"}
          >
            <div
              onClick={handleClose}
              className="cursor-pointer absolute top-2 right-3 text-[21px]"
              id="close-navlink-dialog"
            >
              X
            </div>
            <NavLink
              to="/"
              key={1}
              id="overview-navlink-dialog"
              onClick={() => {}}
              className={({ isActive }) =>
                `flex pl-10 p-5 items-center text-[14px] ${
                  isActive ? "text-[#1966fb]" : "text-[#1d4469]"
                }`
              }
            >
              <PiNotebookBold className="mr-3 text-[16px]" />
              Overview
            </NavLink>

            <NavLink
              to="/dashboard-list"
              key={2}
              id="dashboard-navlink-dialog"
              onClick={() => {}}
              className={({ isActive }) =>
                `flex pl-10 p-5 items-center text-[14px] ${
                  isActive ? "text-[#1966fb]" : "text-[#1d4469]"
                }`
              }
            >
              <VscGraph className="mr-3 text-[16px]" />
              Dashboard
            </NavLink>

            <NavLink
              to="/device-list"
              key={3}
              id="device-navlink-dialog"
              onClick={() => {}}
              className={({ isActive }) =>
                `flex pl-10 p-5 items-center text-[14px] ${
                  isActive ? "text-[#1966fb]" : "text-[#1d4469]"
                }`
              }
            >
              <FiCpu className="mr-3 text-[16px]" />
              Devices
            </NavLink>
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </div>
  );
}

import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import { NavLink } from "react-router-dom";
import { FaUserFriends } from "react-icons/fa";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
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
        className="m-5 hidden sm:block md:block"
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
              to="/admin"
              key={3}
              id="user-list-navlink-sidebar"
              onClick={() => {}}
              className={({ isActive }) =>
                `flex pl-10 p-5 items-center text-[14px] ransition-all ${
                  isActive ? "text-[#1966fb]" : "text-[#1966fb]"
                }`
              }
            >
              <FaUserFriends className="mr-3 text-[16px]" />
              User List
            </NavLink>
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </div>
  );
}

import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import { NavLink } from "react-router-dom";
import { FaKey } from "react-icons/fa";
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
        id="nav-links-dialog-admin"
        className="m-5 hidden sm:block md:block"
      >
        <DialogContent id="nav-links-content-dialog-admin">
          <DialogContentText
            className="p-3 relative"
            component={"div"}
            variant={"body2"}
          >
            <div
              onClick={handleClose}
              className="cursor-pointer absolute top-2 right-3 text-[21px]"
              id="close-nav-link-admin-dialog"
            >
              X
            </div>
            <NavLink
              to="/admin"
              key={1}
              id="user-list-nav-link-sidebar"
              onClick={() => { }}
              className={({ isActive }) =>
                `flex pl-10 p-5 items-center text-[14px] transition-all ${isActive ? "text-[#1966fb]" : "text-[#8e8e8e]"
                }`
              }
              end
            >
              <FaUserFriends className="mr-3 text-[16px]" />
              User List
            </NavLink>
            <NavLink
              to="/admin/api-key"
              key={2}
              id="api-keys-nav-link-sidebar"
              onClick={() => { }}
              className={({ isActive }) =>
                `flex pl-10 p-5 items-center text-[14px] transition-all ${isActive ? "text-[#1966fb]" : "text-[#8e8e8e]"
                }`
              }
            >
              <FaKey className="mr-3 text-[16px]" />
              API Keys
            </NavLink>
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </div>
  );
}

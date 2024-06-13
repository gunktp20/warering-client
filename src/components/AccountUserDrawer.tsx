import { Drawer, Box, Typography } from "@mui/material";
import { NavLink, useNavigate } from "react-router-dom";
import { FaRegUser } from "react-icons/fa6";
import { FiEdit3 } from "react-icons/fi";
import { CiLogout } from "react-icons/ci";
import { useAppDispatch } from "../app/hooks";
import { axiosPrivate } from "../services/api";
import { logout } from "../features/auth/authSlice";

interface IDrawer {
  isAccountUserDrawerOpen: boolean;
  setIsAccountUserDrawerOpen: (active: boolean) => void;
}

function AccountUserDrawer({ isAccountUserDrawerOpen, setIsAccountUserDrawerOpen }: IDrawer) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate()

  const signOut = async () => {
    setIsAccountUserDrawerOpen(false);
    dispatch(logout());
    await axiosPrivate.post("/auth/logout");
    return navigate("/home")
  };

  return (
    <div>
      <Drawer
        anchor="right"
        open={isAccountUserDrawerOpen}
        onClose={() => {
          setIsAccountUserDrawerOpen(false);
        }}
        className=""
        PaperProps={{ id: "account-user-drawer" }}
        id="account-user-drawer"
      >
        <Box p={2} width="250px" textAlign="left" role="presentation">
          <Typography
            component="div"
            className="h-[95vh] p-5 pb-0 flex flex-col justify-between"
          >
            <div>
              <NavLink
                to="/account"
                key={4}
                id="account-user-drawer-nav-link"
                onClick={() => { }}
                className="flex pl-10 p-5 items-center text-[13px] text-[#1d4469]"
              >
                <FaRegUser className="mr-3 text-[16px]" />
                Account
              </NavLink>

              <NavLink
                to="/edit-profile"
                id="edit-profile-drawer-nav-link"
                key={5}
                onClick={() => { }}
                className="flex pl-10 p-5 items-center text-[13px] text-[#1d4469]"
              >
                <FiEdit3 className="mr-3 text-[16px]" />
                Edit Profile
              </NavLink>
            </div>

            <button
              key={6}
              onClick={() => {
                signOut();
              }}
              className="flex pl-10 p-5 items-center text-[13px] text-[#962e39]"
              id="logout-user-btn"
            >
              <CiLogout className="mr-3 text-[16px]" />
              Logout
            </button>
          </Typography>
        </Box>
      </Drawer>
    </div>
  );
}

export default AccountUserDrawer;

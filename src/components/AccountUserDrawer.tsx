import { Drawer, Box, Typography } from "@mui/material";
import { NavLink } from "react-router-dom";
import { FaRegUser } from "react-icons/fa6";
import { FiEdit3 } from "react-icons/fi";
import { CiLogout } from "react-icons/ci";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { axiosPrivate } from "../services/api";
import { logout } from "../features/auth/authSlice";

interface IDrawer {
  isAccountUserDrawerOpen: boolean;
  setIsAccountUserDrawerOpen: (active: boolean) => void;
}

function AccountUserDrawer(props: IDrawer) {
  const dispatch = useAppDispatch();
  const { token } = useAppSelector((state) => state.auth);
  const { isAccountUserDrawerOpen, setIsAccountUserDrawerOpen } = props;

  const signOut = async () => {
    dispatch(logout());
    await axiosPrivate.post(
      `/auth/logout`,
      {},
      
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
  };

  return (
    <div>
      <Drawer
        anchor="right"
        open={isAccountUserDrawerOpen}
        onClose={() => {
          setIsAccountUserDrawerOpen(false);
        }}
        className="sm:hidden"
        PaperProps={{ id: "setup-user-drawer" }}
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
                onClick={() => {}}
                className="flex pl-10 p-5 items-center text-[13px] text-[#1d4469]"
              >
                <FaRegUser className="mr-3 text-[16px]" />
                Account
              </NavLink>

              <NavLink
                to="/edit-profile"
                key={5}
                onClick={() => {}}
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

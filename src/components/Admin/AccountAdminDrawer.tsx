import { Drawer, Box, Typography } from "@mui/material";
import { CiLogout } from "react-icons/ci";
import { useAppDispatch } from "../../app/hooks";
import { axiosPrivate } from "../../services/api";
import { logout } from "../../features/auth/authSlice";
import { useNavigate } from "react-router-dom";

interface IDrawer {
  isAccountUserDrawerOpen: boolean;
  setIsAccountUserDrawerOpen: (active: boolean) => void;
}

function AccountAdminDrawer(props: IDrawer) {
  const navigate = useNavigate()
  const dispatch = useAppDispatch();
  const { isAccountUserDrawerOpen, setIsAccountUserDrawerOpen } = props;

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
        PaperProps={{ id: "account-admin-drawer" }}
      >
        <Box p={2} width="250px" textAlign="left" role="presentation">
          <Typography
            component="div"
            className="h-[95vh] p-5 pb-0 flex flex-col justify-end"
          >
            <button
              key={6}
              onClick={() => {
                signOut();
              }}
              className="flex pl-10 p-5 items-center text-[13px] text-[#962e39]"
              id="admin-logout-btn"
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

export default AccountAdminDrawer;

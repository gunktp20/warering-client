import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { RequireAdmin, RequireUser } from "./components";
import Landing from "./pages/Landing";
import ResetPass from "./pages/ResetPass";
import TermAndCondition from "./pages/TermAndCondition";
import Overview from "./pages/Overview";
import Unauthorized from "./pages/Unauthorized";
import NotFound from "./pages/NotFound";
import DashboardList from "./pages/DashboardList";
import Dashboard from "./pages/Dashboard";
import AddDashboard from "./pages/AddDashboard";
import DeviceList from "./pages/DeviceList";
import Device from "./pages/Device";
import AddDevice from "./pages/AddDevice";
import Account from "./pages/Account";
import EditProfile from "./pages/EditProfile";
import SendVerifyEmail from "./pages/SendVerifyEmail";
import UserManagement from "./pages/UserManagement";
import { useEffect } from "react";
import getAxiosErrorMessage from "./utils/getAxiosErrorMessage";
import useAxiosPrivate from "./hooks/useAxiosPrivate";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import { AccessTokenPayload } from "./features/auth/types";
import { jwtDecode } from "jwt-decode";
import { setProfileImg, setAuthLoading } from "./features/auth/authSlice";

function App() {
  const axiosPrivate = useAxiosPrivate();
  const dispatch = useAppDispatch();
  const { token } = useAppSelector((state) => state.auth);
  const decoded: AccessTokenPayload | undefined = token
    ? jwtDecode(token)
    : undefined;

  const getUserInfo = async () => {
    dispatch(setAuthLoading(true));
    try {
      const { data } = await axiosPrivate.get(`/users/${decoded?.sub}`);
      dispatch(setProfileImg(data?.profileUrl));
      dispatch(setAuthLoading(false));
    } catch (err: unknown) {
      const msg = await getAxiosErrorMessage(err);
      console.log(msg);
      dispatch(setAuthLoading(false));
    }
  };

  useEffect(() => {
    getUserInfo();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/home" element={<Landing />} />
        <Route path="/reset-password/:token" element={<ResetPass />} />
        <Route path="/term-condition" element={<TermAndCondition />} />
        <Route element={<RequireUser />}>
          <Route path="/" element={<Overview />} />
          <Route path="/dashboard-list" element={<DashboardList />} />
          <Route path="/dashboard/:dashboard_id" element={<Dashboard />} />
          <Route path="/add-dashboard" element={<AddDashboard />} />
          <Route path="/device-list" element={<DeviceList />} />
          <Route path="/device/:device_id" element={<Device />} />
          <Route path="/add-device" element={<AddDevice />} />
          <Route path="/account" element={<Account />} />
          <Route path="/edit-profile" element={<EditProfile />} />
        </Route>
        <Route path="/admin" element={<RequireAdmin />}>
          <Route index element={<UserManagement />} />
        </Route>
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route
          path="/request-verify-email/:token"
          element={<SendVerifyEmail />}
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

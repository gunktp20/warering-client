import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { RequireAdmin, RequireUser } from "./components";
import Landing from "./pages/Landing";
import ResetPass from "./pages/ResetPass";
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
import ApiKeys from "./pages/ApiKey";
import ApiKeyInformation from "./pages/ApiKey/ApiKeyInformation";
import SessionExpired from "./pages/SessionExpired";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/home" element={<Landing />} />
          <Route path="/reset-password/:token" element={<ResetPass />} />
          <Route element={<RequireUser />}>
            <Route path="/" element={<Overview />} />
            <Route path="/dashboard-list" element={<DashboardList />} />
            <Route path="/api-keys" element={<DashboardList />} />
            <Route path="/dashboard/:dashboard_id" element={<Dashboard />} />
            <Route path="/add-dashboard" element={<AddDashboard />} />
            <Route path="/device-list" element={<DeviceList />} />
            <Route path="/device/:device_id" element={<Device />} />
            <Route path="/add-device" element={<AddDevice />} />
            <Route path="/account" element={<Account />} />
            <Route path="/edit-profile" element={<EditProfile />} />
          </Route>
          <Route path="admin" element={<RequireAdmin />}>
            <Route index element={<UserManagement />} />
            <Route path="user-management" element={<UserManagement />} />
            <Route path="api-key/:api_key_id" element={<ApiKeyInformation />} />
            <Route path="api-key/" element={<ApiKeys />} />
          </Route>
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="/session-expired" element={<SessionExpired />} />
          <Route
            path="/request-verify-email/:token"
            element={<SendVerifyEmail />}
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { RequireAdmin, RequireUser } from "./components";
import Landing from "./pages/Landing";
import ResetPass from "./pages/ResetPass";
import TermAndCondition from "./pages/TermAndCondition";
import Overview from "./pages/Overview";
import AdminDashboard from "./pages/AdminDashboard";
import Unauthorized from "./pages/Unauthorized";
import NotFound from "./pages/NotFound";
import DashboardList from "./pages/DashboardList";
import AddDashboard from "./pages/AddDashboard";
import DeviceList from "./pages/DeviceList";
import AddDevice from "./pages/AddDevice";
import Account from "./pages/Account";
import EditProfile from "./pages/EditProfile";
import Device from "./pages/Device/Device";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/home" element={<Landing />} />
        <Route path="/reset-password/:token" element={<ResetPass />} />
        <Route path="/term-condition" element={<TermAndCondition />} />
        <Route element={<RequireUser />}>
          <Route path="/" element={<Overview />} />
          <Route path="/dashboard-list" element={<DashboardList />} />
          <Route path="/add-dashboard" element={<AddDashboard />} />
          <Route path="/device-list" element={<DeviceList />} />
          <Route path="/device/:device_id" element={<Device />} />
          <Route path="/add-device" element={<AddDevice />} />
          <Route path="/account" element={<Account />} />
          <Route path="/edit-profile" element={<EditProfile />} />
        </Route>
        <Route element={<RequireAdmin />}>
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

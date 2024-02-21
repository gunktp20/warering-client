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
import Dashboard from "./pages/Dashboard";
import Device from "./pages/Device";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/home" element={<Landing />} />
        <Route path="/reset-password/:token" element={<ResetPass />} />
        <Route path="/term-condition" element={<TermAndCondition />} />
        <Route element={<RequireUser />}>
          <Route path="/" element={<Overview />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/device" element={<Device />} />
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

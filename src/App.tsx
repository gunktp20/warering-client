import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Landing from "./pages/Landing";
import ResetPass from "./pages/ResetPass";
import RequireAuth from "./components/RequireAuth";
import Overview from "./pages/Overview";
import { ROLES } from "./constant/enums/RoleEnum";
import Unauthorized from "./pages/Unauthorized";
import Missing from "./pages/Missing";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/landing" element={<Landing />} />
        <Route path="/reset-password/:token" element={<ResetPass />} />
        <Route path="unauthorized" element={<Unauthorized />} />

        <Route element={<RequireAuth allowedRoles={[ROLES.USER]} />}>
          <Route path="/" element={<Overview />} />
        </Route>
        <Route element={<RequireAuth allowedRoles={[ROLES.ADMIN]} />}>
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>

        <Route path="*" element={<Missing />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

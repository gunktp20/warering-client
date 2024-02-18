import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import {
  Landing,
  ResetPass,
  TermAndCondition,
  NotFound,
  Unauthorized,
  Overview,
  AdminDashboard,
} from "./pages";
import { RequireAdmin , RequireUser} from "./components";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/landing" element={<Landing />} />
        <Route path="/reset-password/:token" element={<ResetPass />} />
        <Route path="/term-condition" element={<TermAndCondition />} />
        <Route element={<RequireUser/>}>
          <Route path="/" element={<Overview />} />
        </Route>
        <Route element={<RequireAdmin/>}>
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

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
import RequireAuth from "./components/RequireAuth";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/landing" element={<Landing />} />
        <Route path="/reset-password/:token" element={<ResetPass />} />
        <Route path="/term-condition" element={<TermAndCondition />} />
        <Route element={<RequireAuth allow="user" />}>
          <Route path="/" element={<Overview />} />
        </Route>
        <Route element={<RequireAuth allow="admin" />}>
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

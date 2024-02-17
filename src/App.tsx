import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ROLES } from "./constant/enums/RoleEnum";
import {
  Landing,
  ResetPass,
  TermAndCondition,
  RequireAuth,
  NotFound,
  Unauthorized,
  Overview,
  AdminDashboard
} from './pages'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/landing" element={<Landing />} />
        <Route path="/reset-password/:token" element={<ResetPass />} />
        <Route path="/term-condition" element={<TermAndCondition />} />
        <Route element={<RequireAuth allowedRoles={[ROLES.USER]} />}>
          <Route path="/" element={<div>
            <Overview />
          </div>} />
        </Route>
        <Route element={<RequireAuth allowedRoles={[ROLES.ADMIN]} />}>
          <Route path="/admin" element={<div>
            <AdminDashboard />
          </div>} />
        </Route>

        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

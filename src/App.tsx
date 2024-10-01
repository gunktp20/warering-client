import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { lazy, Suspense } from "react";
import { RequireAdmin, RequireUser } from "./components";
const Landing = lazy(() => import('./pages/Landing'))
const ResetPass = lazy(() => import('./pages/ResetPass'))
const DashboardList = lazy(() => import('./pages/DashboardList'))
const AddDashboard = lazy(() => import('./pages/AddDashboard'))
const Overview = lazy(() => import('./pages/Overview'))
import Unauthorized from "./pages/Unauthorized";
import NotFound from "./pages/NotFound";
const Dashboard = lazy(() => import('./pages/Dashboard'))
const DeviceList = lazy(() => import('./pages/DeviceList'))
const Device = lazy(() => import('./pages/Device'))
const AddDevice = lazy(() => import('./pages/AddDevice'))
const Account = lazy(() => import('./pages/Account'))
const EditProfile = lazy(() => import('./pages/EditProfile'))
const UserManagement = lazy(() => import('./pages/UserManagement'))
const SendVerifyEmail = lazy(() => import('./pages/SendVerifyEmail'))
const ApiKeys = lazy(() => import('./pages/ApiKey'))
const ApiKeyInformation = lazy(() => import('./pages/ApiKey/ApiKeyInformation'))
import SessionExpired from "./pages/SessionExpired";


import { Backdrop } from "@mui/material"

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/home" element={<Suspense fallback={<Backdrop open={true} sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
            <div className="loader w-[50px] h-[50px]"></div>
          </Backdrop>}>
            <Landing />
          </Suspense>} />

          <Route path="/reset-password/:token" element={<Suspense fallback={<Backdrop open={true} sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
            <div className="loader w-[50px] h-[50px]"></div>
          </Backdrop>}>
            <ResetPass />
          </Suspense>} />

          <Route path="/" element={<RequireUser />}>
            <Route index element={<Suspense fallback={<Backdrop open={true} sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
              <div className="loader w-[50px] h-[50px]"></div>
            </Backdrop>}>
              <Overview />
            </Suspense>} />

            <Route path="/dashboard-list" element={<Suspense fallback={<Backdrop open={true} sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
              <div className="loader w-[50px] h-[50px]"></div>
            </Backdrop>}>
              <DashboardList />
            </Suspense>} />

            <Route path="/dashboard/:dashboard_id" element={<Suspense fallback={<Backdrop open={true} sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
              <div className="loader w-[50px] h-[50px]"></div>
            </Backdrop>}>
              <Dashboard />
            </Suspense>} />

            <Route path="/add-dashboard" element={<Suspense fallback={<Backdrop open={true} sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
              <div className="loader w-[50px] h-[50px]"></div>
            </Backdrop>}>
              <AddDashboard />
            </Suspense>} />

            <Route path="/device-list" element={<Suspense fallback={<Backdrop open={true} sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
              <div className="loader w-[50px] h-[50px]"></div>
            </Backdrop>}>
              <DeviceList />
            </Suspense>} />

            <Route path="/device/:device_id" element={<Suspense fallback={<Backdrop open={true} sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
              <div className="loader w-[50px] h-[50px]"></div>
            </Backdrop>}>
              <Device />
            </Suspense>} />

            <Route path="/add-device" element={<Suspense fallback={<Backdrop open={true} sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
              <div className="loader w-[50px] h-[50px]"></div>
            </Backdrop>}>
              <AddDevice />
            </Suspense>} />
            <Route path="/account" element={<Suspense fallback={<Backdrop open={true} sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
              <div className="loader w-[50px] h-[50px]"></div>
            </Backdrop>}>
              <Account />
            </Suspense>} />

            <Route path="/edit-profile" element={<Suspense fallback={<Backdrop open={true} sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
              <div className="loader w-[50px] h-[50px]"></div>
            </Backdrop>}>
              <EditProfile />
            </Suspense>} />

          </Route>

          <Route path="admin" element={<RequireAdmin />}>
            <Route index element={<Suspense fallback={<Backdrop open={true} sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
              <div className="loader w-[50px] h-[50px]"></div>
            </Backdrop>}>
              <UserManagement />
            </Suspense>} />

            <Route path="user-management" element={<Suspense fallback={<Backdrop open={true} sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
              <div className="loader w-[50px] h-[50px]"></div>
            </Backdrop>}>
              <UserManagement />
            </Suspense>} />

            <Route path="api-key/:api_key_id" element={<Suspense fallback={<Backdrop open={true} sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
              <div className="loader w-[50px] h-[50px]"></div>
            </Backdrop>}>
              <ApiKeyInformation />
            </Suspense>} />

            <Route path="api-key/" element={<Suspense fallback={<Backdrop open={true} sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
              <div className="loader w-[50px] h-[50px]"></div>
            </Backdrop>}>
              <ApiKeys />
            </Suspense>} />

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

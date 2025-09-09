import React, { useEffect, useState, Suspense, lazy } from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Homepage from "./ui/pages/Homepage";
const Login = lazy(() => import("./ui/pages/Login"));
const ViewPage = lazy(() => import("./ui/pages/chirurg/Viewpage"));
import BurgerMenu from "./ui/components/headers/BurgerMenu";
import DesktopHeader from "./ui/components/headers/DesktopHeader";
const Dashboard = lazy(() => import("./ui/pages/admin/Dashboard"));
const Rooms = lazy(() => import("./ui/pages/admin/Rooms"));
const NewRoom = lazy(() => import("./ui/pages/admin/NewRoom"));
const NewPatient = lazy(() => import("./ui/pages/admin/NewPatient"));
const NewAccount = lazy(() => import("./ui/pages/admin/NewAccount"));
const NewPassword = lazy(() => import("./ui/pages/admin/NewPassword"));
const ChirurgDashboard = lazy(() => import("./ui/pages/chirurg/Dashboard"));
import ProtectedRoute from "./ui/components/auth/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import { NotificationProvider } from "./context/NotificationContext";
import { AnimatePresence } from "framer-motion";
import Patients from "./ui/pages/admin/Patients";
import Users from "./ui/pages/admin/Users";
import LoadingSpinner from "./ui/components/LoadingSpinner";
import NotFound from "./ui/pages/NotFound";
import ErrorBoundary from "./ui/components/errors/ErrorBoundary";
function App() {
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 800);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => {
      window.removeEventListener("resize", checkScreenSize);
    };
  }, []);

  const isView = location.pathname === "/chirurg/dashboard";
  const isChirurgDashboard = location.pathname === "/chirurg/view";
  const isLogin = location.pathname === "/login";
  const headerShouldShow = !isView && !isChirurgDashboard && !isLogin;
  return (
    <>
      {headerShouldShow && (isMobile ? <BurgerMenu /> : <DesktopHeader />)}

      <Suspense fallback={<div style={{ padding: 24 }}><LoadingSpinner /></div>}>
      <Routes>
        <Route path="/" element={<Homepage />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route
          path="/chirurg/view/:roomId"
          element={
            <ProtectedRoute
              element={<ViewPage />}
              allowedRoles={["admin", "super-admin"]}
            />
          }
        ></Route>
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute
              element={<Dashboard />}
              allowedRoles={["super-admin"]}
            />
          }
        ></Route>
        <Route path="/admin/rooms" element={<Rooms />}></Route>
        <Route path="/admin/rooms/nieuw-room" element={<NewRoom />}></Route>
        <Route
          path="/admin/patients/nieuw-patient"
          element={<NewPatient />}
        ></Route>
        <Route path="/admin/patients" element={<Patients />}></Route>
        <Route path="/admin/users" element={<Users />}></Route>

        <Route
          path="/admin/users/nieuw-account"
          element={<NewAccount />}
        ></Route>
        <Route path="/admin/nieuw-wachtwoord" element={<NewPassword />}></Route>

        <Route path="/chirurg/dashboard" element={<ChirurgDashboard />}></Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
      </Suspense>
    </>
  );
}

const AppWithRouter = () => (
  <AnimatePresence mode="wait">
    <AuthProvider>
      <NotificationProvider>
        <Router>
          <ErrorBoundary>
            <App />
          </ErrorBoundary>
        </Router>
      </NotificationProvider>
    </AuthProvider>
  </AnimatePresence>
);

export default AppWithRouter;

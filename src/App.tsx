import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { RoleBasedRoute } from "@/components/RoleBasedRoute";
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import StaffDashboard from "@/pages/staff/StaffDashboard";
import ManagerDashboard from "@/pages/manager/ManagerDashboard";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AccountPage from "@/pages/account/AccountPage";
import { useAuth } from "@/hooks/useAuth";

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          
          <Route
            path="/staff/*"
            element={
              <RoleBasedRoute
                element={<StaffDashboard />}
                allowedRoles={["staff", "manager", "admin"]}
              />
            }
          />
          
          <Route
            path="/manager/*"
            element={
              <RoleBasedRoute
                element={<ManagerDashboard />}
                allowedRoles={["manager", "admin"]}
              />
            }
          />
          
          <Route
            path="/admin/*"
            element={
              <RoleBasedRoute
                element={<AdminDashboard />}
                allowedRoles={["admin"]}
              />
            }
          />
          
          <Route
            path="/account"
            element={
              <RoleBasedRoute
                element={<AccountPage />}
                allowedRoles={["staff", "manager", "admin"]}
              />
            }
          />

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
        <Toaster />
      </Router>
    </ErrorBoundary>
  );
}

export default App;
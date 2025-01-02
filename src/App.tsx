import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Index } from "@/pages/Index";
import { Login } from "@/pages/Login";
import { Dashboard } from "@/pages/Dashboard";
import { AdminDashboard } from "@/pages/admin/AdminDashboard";
import { ManagerDashboard } from "@/pages/manager/ManagerDashboard";
import { StaffDashboard } from "@/pages/staff/StaffDashboard";
import { AccountPage } from "@/pages/account/AccountPage";
import { DocumentsPage } from "@/pages/documents/DocumentsPage";
import { SettingsPage } from "@/pages/settings/SettingsPage";
import { RoleBasedRoute } from "@/components/RoleBasedRoute";
import { Toaster } from "@/components/ui/toaster";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route
          path="/admin/*"
          element={
            <RoleBasedRoute allowedRole="admin">
              <AdminDashboard />
            </RoleBasedRoute>
          }
        />
        <Route
          path="/manager/*"
          element={
            <RoleBasedRoute allowedRole="manager">
              <ManagerDashboard />
            </RoleBasedRoute>
          }
        />
        <Route
          path="/staff/*"
          element={
            <RoleBasedRoute allowedRole="staff">
              <StaffDashboard />
            </RoleBasedRoute>
          }
        />
        <Route path="/account" element={<AccountPage />} />
        <Route path="/documents" element={<DocumentsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;
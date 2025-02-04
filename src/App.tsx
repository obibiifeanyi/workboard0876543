import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { RoleBasedRoute } from "@/components/RoleBasedRoute";
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import StaffDashboard from "@/pages/staff/StaffDashboard";
import ManagerDashboard from "@/pages/manager/ManagerDashboard";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import { UserManagement } from "@/components/admin/UserManagement";
import { DepartmentManagement } from "@/components/admin/DepartmentManagement";
import { ProjectManagement } from "@/components/admin/ProjectManagement";
import { LeaveManagement } from "@/components/admin/LeaveManagement";
import { TimeManagement } from "@/components/admin/TimeManagement";
import { ClockInMonitor } from "@/components/admin/ClockInMonitor";
import { TelecomSites } from "@/components/admin/TelecomSites";
import { ActivityManagement } from "@/components/admin/ActivityManagement";
import { AIManagementSystem } from "@/components/ai/AIManagementSystem";
import { AIKnowledgeBase } from "@/components/ai/AIKnowledgeBase";
import { CommunicationCenter } from "@/components/admin/CommunicationCenter";
import { AdminDashboardModule } from "@/components/admin/dashboard/AdminDashboardModule";
import AccountPage from "@/pages/account/AccountPage";

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          
          {/* Admin Routes */}
          <Route
            path="/admin/*"
            element={
              <RoleBasedRoute
                element={<AdminDashboard />}
                allowedRoles={["admin"]}
              />
            }
          >
            <Route index element={<AdminDashboardModule />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="departments" element={<DepartmentManagement />} />
            <Route path="projects" element={<ProjectManagement />} />
            <Route path="leave" element={<LeaveManagement />} />
            <Route path="time" element={<TimeManagement />} />
            <Route path="clock-in" element={<ClockInMonitor />} />
            <Route path="telecom-sites" element={<TelecomSites />} />
            <Route path="activity" element={<ActivityManagement />} />
            <Route path="ai" element={<AIManagementSystem />} />
            <Route path="knowledge" element={<AIKnowledgeBase />} />
            <Route path="communication" element={<CommunicationCenter />} />
          </Route>

          {/* Manager Routes */}
          <Route
            path="/manager/*"
            element={
              <RoleBasedRoute
                element={<ManagerDashboard />}
                allowedRoles={["manager", "admin"]}
              />
            }
          />
          
          {/* Staff Routes */}
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

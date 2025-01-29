import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { RoleBasedRoute } from "@/components/RoleBasedRoute";
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import StaffDashboard from "@/pages/staff/StaffDashboard";
import CurrentTasks from "@/pages/staff/CurrentTasks";
import MyTasks from "@/pages/staff/MyTasks";
import Memos from "@/pages/staff/Memos";
import Reports from "@/pages/staff/Reports";
import TelecomReports from "@/pages/staff/TelecomReports";
import BatteryReports from "@/pages/staff/BatteryReports";
import Meetings from "@/pages/staff/Meetings";
import StaffProfile from "@/pages/staff/StaffProfile";
import ManagerDashboard from "@/pages/manager/ManagerDashboard";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AccountPage from "@/pages/account/AccountPage";
import { TelecomSiteManagement } from "@/components/admin/TelecomSiteManagement";
import { TimeManagement } from "@/components/admin/TimeManagement";
import { ActivityManagement } from "@/components/admin/ActivityManagement";
import { AIManagementSystem } from "@/components/ai/AIManagementSystem";
import AIKnowledgeBase from "@/components/ai/AIKnowledgeBase";
import { UserManagement } from "@/components/admin/UserManagement";
import { DepartmentManagement } from "@/components/admin/DepartmentManagement";
import { ProjectManagement } from "@/components/admin/ProjectManagement";
import { LeaveManagement } from "@/components/admin/LeaveManagement";
import { ClockInMonitor } from "@/components/admin/ClockInMonitor";

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          
          <Route
            path="/staff"
            element={
              <RoleBasedRoute
                element={<StaffDashboard />}
                allowedRoles={["staff", "manager", "admin"]}
              />
            }
          />
          
          <Route
            path="/staff/current-tasks"
            element={
              <RoleBasedRoute
                element={<CurrentTasks />}
                allowedRoles={["staff", "manager", "admin"]}
              />
            }
          />
          
          <Route
            path="/staff/my-tasks"
            element={
              <RoleBasedRoute
                element={<MyTasks />}
                allowedRoles={["staff", "manager", "admin"]}
              />
            }
          />
          
          <Route
            path="/staff/memos"
            element={
              <RoleBasedRoute
                element={<Memos />}
                allowedRoles={["staff", "manager", "admin"]}
              />
            }
          />
          
          <Route
            path="/staff/reports"
            element={
              <RoleBasedRoute
                element={<Reports />}
                allowedRoles={["staff", "manager", "admin"]}
              />
            }
          />
          
          <Route
            path="/staff/telecom-reports"
            element={
              <RoleBasedRoute
                element={<TelecomReports />}
                allowedRoles={["staff", "manager", "admin"]}
              />
            }
          />
          
          <Route
            path="/staff/battery-reports"
            element={
              <RoleBasedRoute
                element={<BatteryReports />}
                allowedRoles={["staff", "manager", "admin"]}
              />
            }
          />
          
          <Route
            path="/staff/meetings"
            element={
              <RoleBasedRoute
                element={<Meetings />}
                allowedRoles={["staff", "manager", "admin"]}
              />
            }
          />
          
          <Route
            path="/staff/profile"
            element={
              <RoleBasedRoute
                element={<StaffProfile />}
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
            path="/admin"
            element={
              <RoleBasedRoute
                element={<AdminDashboard />}
                allowedRoles={["admin"]}
              />
            }
          >
            <Route path="users" element={<UserManagement />} />
            <Route path="departments" element={<DepartmentManagement />} />
            <Route path="projects" element={<ProjectManagement />} />
            <Route path="leave" element={<LeaveManagement />} />
            <Route path="time" element={<TimeManagement />} />
            <Route path="clock-in" element={<ClockInMonitor />} />
            <Route path="telecom-sites" element={<TelecomSiteManagement />} />
            <Route path="activity" element={<ActivityManagement />} />
            <Route path="ai" element={<AIManagementSystem />} />
            <Route path="knowledge" element={<AIKnowledgeBase />} />
          </Route>
          
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
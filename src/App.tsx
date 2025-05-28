
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { RoleBasedRoute } from "@/components/RoleBasedRoute";
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import StaffDashboard from "@/pages/staff/StaffDashboard";
import ManagerDashboard from "@/pages/manager/ManagerDashboard";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AccountantDashboard from "@/pages/accountant/AccountantDashboard";

// Accountant components
import { InvoiceManagement } from "@/components/accountant/InvoiceManagement";
import { FinancialReports } from "@/components/accountant/FinancialReports";
import { MemoApproval } from "@/components/accountant/MemoApproval";
import { AccountSettings } from "@/components/accountant/AccountSettings";
import { InventoryManagement } from "@/components/accountant/InventoryManagement";
import { PaymentProcessing } from "@/components/accountant/PaymentProcessing";

// Admin components
import { AdminDashboardModule } from "@/components/admin/dashboard/AdminDashboardModule";
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

// Staff components
import { CurrentTasks } from "@/components/staff/CurrentTasks";
import { MyTasks } from "@/components/staff/MyTasks";
import { Memos } from "@/components/staff/Memos";
import { Reports } from "@/components/staff/Reports";
import { TelecomReports } from "@/components/staff/TelecomReports";
import { BatteryReports } from "@/components/staff/BatteryReports";
import { Meetings } from "@/components/staff/Meetings";
import { StaffProfile } from "@/components/staff/StaffProfile";
import { AccountPage } from "@/components/account/AccountPage";

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* Accountant Routes */}
          <Route
            path="/accountant"
            element={
              <RoleBasedRoute
                element={<AccountantDashboard />}
                allowedRoles={["accountant", "admin"]}
              />
            }
          />
          <Route
            path="/accountant/invoices"
            element={
              <RoleBasedRoute
                element={<AccountantDashboard />}
                allowedRoles={["accountant", "admin"]}
              />
            }
          />
          <Route
            path="/accountant/reports"
            element={
              <RoleBasedRoute
                element={<AccountantDashboard />}
                allowedRoles={["accountant", "admin"]}
              />
            }
          />
          <Route
            path="/accountant/memos"
            element={
              <RoleBasedRoute
                element={<AccountantDashboard />}
                allowedRoles={["accountant", "admin"]}
              />
            }
          />
          <Route
            path="/accountant/inventory"
            element={
              <RoleBasedRoute
                element={<AccountantDashboard />}
                allowedRoles={["accountant", "admin"]}
              />
            }
          />
          <Route
            path="/accountant/payments"
            element={
              <RoleBasedRoute
                element={<AccountantDashboard />}
                allowedRoles={["accountant", "admin"]}
              />
            }
          />
          <Route
            path="/accountant/settings"
            element={
              <RoleBasedRoute
                element={<AccountantDashboard />}
                allowedRoles={["accountant", "admin"]}
              />
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <RoleBasedRoute
                element={<AdminDashboard />}
                allowedRoles={["admin"]}
              />
            }
          />
          <Route
            path="/admin/users"
            element={
              <RoleBasedRoute
                element={<AdminDashboard />}
                allowedRoles={["admin"]}
              />
            }
          />
          <Route
            path="/admin/departments"
            element={
              <RoleBasedRoute
                element={<AdminDashboard />}
                allowedRoles={["admin"]}
              />
            }
          />
          <Route
            path="/admin/projects"
            element={
              <RoleBasedRoute
                element={<AdminDashboard />}
                allowedRoles={["admin"]}
              />
            }
          />
          <Route
            path="/admin/leave"
            element={
              <RoleBasedRoute
                element={<AdminDashboard />}
                allowedRoles={["admin"]}
              />
            }
          />
          <Route
            path="/admin/time"
            element={
              <RoleBasedRoute
                element={<AdminDashboard />}
                allowedRoles={["admin"]}
              />
            }
          />
          <Route
            path="/admin/clock-in"
            element={
              <RoleBasedRoute
                element={<AdminDashboard />}
                allowedRoles={["admin"]}
              />
            }
          />
          <Route
            path="/admin/telecom-sites"
            element={
              <RoleBasedRoute
                element={<AdminDashboard />}
                allowedRoles={["admin"]}
              />
            }
          />
          <Route
            path="/admin/activity"
            element={
              <RoleBasedRoute
                element={<AdminDashboard />}
                allowedRoles={["admin"]}
              />
            }
          />
          <Route
            path="/admin/ai"
            element={
              <RoleBasedRoute
                element={<AdminDashboard />}
                allowedRoles={["admin"]}
              />
            }
          />
          <Route
            path="/admin/knowledge"
            element={
              <RoleBasedRoute
                element={<AdminDashboard />}
                allowedRoles={["admin"]}
              />
            }
          />
          <Route
            path="/admin/communication"
            element={
              <RoleBasedRoute
                element={<AdminDashboard />}
                allowedRoles={["admin"]}
              />
            }
          />

          {/* Manager Routes */}
          <Route
            path="/manager"
            element={
              <RoleBasedRoute
                element={<ManagerDashboard />}
                allowedRoles={["manager", "admin"]}
              />
            }
          />
          
          {/* Staff Routes */}
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
                element={<StaffDashboard />}
                allowedRoles={["staff", "manager", "admin"]}
              />
            }
          />
          <Route
            path="/staff/my-tasks"
            element={
              <RoleBasedRoute
                element={<StaffDashboard />}
                allowedRoles={["staff", "manager", "admin"]}
              />
            }
          />
          <Route
            path="/staff/memos"
            element={
              <RoleBasedRoute
                element={<StaffDashboard />}
                allowedRoles={["staff", "manager", "admin"]}
              />
            }
          />
          <Route
            path="/staff/reports"
            element={
              <RoleBasedRoute
                element={<StaffDashboard />}
                allowedRoles={["staff", "manager", "admin"]}
              />
            }
          />
          <Route
            path="/staff/telecom-reports"
            element={
              <RoleBasedRoute
                element={<StaffDashboard />}
                allowedRoles={["staff", "manager", "admin"]}
              />
            }
          />
          <Route
            path="/staff/battery-reports"
            element={
              <RoleBasedRoute
                element={<StaffDashboard />}
                allowedRoles={["staff", "manager", "admin"]}
              />
            }
          />
          <Route
            path="/staff/meetings"
            element={
              <RoleBasedRoute
                element={<StaffDashboard />}
                allowedRoles={["staff", "manager", "admin"]}
              />
            }
          />
          <Route
            path="/staff/profile"
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
                allowedRoles={["staff", "manager", "admin", "accountant"]}
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

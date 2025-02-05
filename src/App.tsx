import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { RoleBasedRoute } from "@/components/RoleBasedRoute";
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import StaffDashboard from "@/pages/staff/StaffDashboard";
import ManagerDashboard from "@/pages/manager/ManagerDashboard";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AccountantDashboard from "@/pages/accountant/AccountantDashboard";
import { InvoiceManagement } from "@/components/accountant/InvoiceManagement";
import { FinancialReports } from "@/components/accountant/FinancialReports";
import { MemoApproval } from "@/components/accountant/MemoApproval";
import { AccountSettings } from "@/components/accountant/AccountSettings";
import { InventoryManagement } from "@/components/accountant/InventoryManagement";
import { PaymentProcessing } from "@/components/accountant/PaymentProcessing";

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
          
          {/* Accountant Routes */}
          <Route
            path="/accountant/*"
            element={
              <RoleBasedRoute
                element={<AccountantDashboard />}
                allowedRoles={["accountant", "admin"]}
              />
            }
          >
            <Route index element={<InvoiceManagement />} />
            <Route path="invoices" element={<InvoiceManagement />} />
            <Route path="reports" element={<FinancialReports />} />
            <Route path="memos" element={<MemoApproval />} />
            <Route path="inventory" element={<InventoryManagement />} />
            <Route path="payments" element={<PaymentProcessing />} />
            <Route path="settings" element={<AccountSettings />} />
          </Route>

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
          >
            <Route index element={<StaffDashboard />} />
            <Route path="current-tasks" element={<CurrentTasks />} />
            <Route path="my-tasks" element={<MyTasks />} />
            <Route path="memos" element={<Memos />} />
            <Route path="reports" element={<Reports />} />
            <Route path="telecom-reports" element={<TelecomReports />} />
            <Route path="battery-reports" element={<BatteryReports />} />
            <Route path="meetings" element={<Meetings />} />
            <Route path="profile" element={<StaffProfile />} />
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

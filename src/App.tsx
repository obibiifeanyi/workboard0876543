import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ResetPassword from "./pages/ResetPassword";
import AuthCallback from "./pages/AuthCallback";
import Dashboard from "./pages/Dashboard";
import DocumentsPage from "./pages/documents/DocumentsPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManagerDashboard from "./pages/manager/ManagerDashboard";
import AccountantDashboard from "./pages/accountant/AccountantDashboard";
import StaffDashboard from "./pages/staff/StaffDashboard";
import HRDashboard from "./pages/hr/HRDashboard";
import { RoleBasedRoute } from "./components/RoleBasedRoute";

// Admin nested routes
import { DepartmentManagement } from "./components/admin/DepartmentManagement";
import { ProjectManagement } from "./components/admin/ProjectManagement";
import { TimeAttendanceManagement } from "./components/admin/TimeAttendanceManagement";
import { LeaveManagement } from "./components/admin/LeaveManagement";
import { CommunicationCenter } from "./components/admin/CommunicationCenter";

// AI Document Analyzer
import AIDocumentAnalyzerPage from "./app/dashboard/ai-document-analyzer/page";
import { APIKeyManagement } from "./components/admin/APIKeyManagement";
import { TelecomSiteManagement } from "./components/admin/TelecomSiteManagement";
import { ActivityManagement } from "./components/admin/ActivityManagement";
import { AIManagementSystem } from "./components/ai/AIManagementSystem";

// Staff nested routes
import { CurrentTasks } from "./components/staff/CurrentTasks";
import { MyTasks } from "./components/staff/MyTasks";
import { Memos } from "./components/staff/Memos";
import { Reports } from "./components/staff/Reports";
import { StaffProfile } from "./components/staff/StaffProfile";
import { BatteryReports } from "./components/staff/BatteryReports";
import { TelecomReports } from "./components/staff/TelecomReports";
import { Meetings } from "./components/staff/Meetings";

// Manager nested routes
import { TeamOverview } from "./components/manager/TeamOverview";
import { WorkBoard } from "./components/manager/WorkBoard";
import { TeamTimeManagement } from "./components/manager/TeamTimeManagement";
import { TelecomSites } from "./components/manager/TelecomSites";
import { ProjectReportManagement } from "./components/reports/ProjectReportManagement";
import { StaffMemoManagement } from "./components/manager/StaffMemoManagement";
import { InvoiceGenerator } from "./components/invoices/InvoiceGenerator";
import { EmailNotificationCenter } from "./components/notifications/EmailNotificationCenter";

// HR nested routes
import { EmployeeManagement } from "./components/hr/EmployeeManagement";
import { HRLeaveManagement } from "./components/hr/HRLeaveManagement";
import { PayrollManagement } from "./components/hr/PayrollManagement";
import { PerformanceReviews } from "./components/hr/PerformanceReviews";
import { HRReports } from "./components/hr/HRReports";

// Accountant nested routes components
import { FinancialReports } from "./components/accountant/FinancialReports";
import { InvoiceManagement } from "./components/accountant/InvoiceManagement";
import { MemoApproval } from "./components/accountant/MemoApproval";
import { InventoryManagement } from "./components/accountant/InventoryManagement";
import { PaymentProcessing } from "./components/accountant/PaymentProcessing";
import { AccountSettings } from "./components/accountant/AccountSettings";

// Staff Admin routes with nested routing
import { StaffAdminDashboard } from "./components/staff-admin/StaffAdminDashboard";
import { StaffAdminOverview } from "./components/staff-admin/StaffAdminOverview";
import { TaskAssignment } from "./components/staff-admin/TaskAssignment";
import { BatteryInventory } from "./components/staff-admin/BatteryInventory";
import { ExpenseManagement } from "./components/staff-admin/ExpenseManagement";
import { NotificationManagement } from "./components/staff-admin/NotificationManagement";
import { TimeTracking } from "./components/staff-admin/TimeTracking";
import { LeaveRequestManagement } from "./components/staff-admin/LeaveRequestManagement";
import { MeetingScheduler } from "./components/staff-admin/MeetingScheduler";
import { VehicleManagement } from "./components/staff-admin/VehicleManagement";
import { AnalyticsDashboard } from "./components/staff-admin/AnalyticsDashboard";
import { SystemSettings } from "./components/staff-admin/SystemSettings";
import { UserManagement } from "./components/staff-admin/UserManagement";

// Office Admin routes with nested routing
import { OfficeAdminDashboard } from "./components/office-admin/OfficeAdminDashboard";
import { OfficeAdminOverview } from "./components/office-admin/OfficeAdminOverview";
import { HRManagement } from "./components/office-admin/HRManagement";
import { InventoryManagement } from "./components/office-admin/InventoryManagement";
import { ProcurementManagement } from "./components/office-admin/ProcurementManagement";
import { DocumentLibrary } from "./components/office-admin/DocumentLibrary";
import { ExpenseManagement } from "./components/office-admin/ExpenseManagement";
import { ProjectManagement } from "./components/office-admin/ProjectManagement";
import { TelecomSiteManagement } from "./components/office-admin/TelecomSiteManagement";
import { BatteryInventory } from "./components/office-admin/BatteryInventory";
import { SystemSettings } from "./components/office-admin/SystemSettings";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <TooltipProvider>
          <Toaster />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
              <Route path="/dashboard" element={<Dashboard />} />
              
              {/* Office Admin routes with nested routing */}
              <Route path="/office-admin" element={
                <RoleBasedRoute allowedRoles={['office_admin']}>
                  <OfficeAdminDashboard />
                </RoleBasedRoute>
              }>
                <Route index element={<OfficeAdminOverview />} />
                <Route path="dashboard" element={<OfficeAdminOverview />} />
                <Route path="hr" element={<HRManagement />} />
                <Route path="inventory" element={<InventoryManagement />} />
                <Route path="procurement" element={<ProcurementManagement />} />
                <Route path="documents" element={<DocumentLibrary />} />
                <Route path="expenses" element={<ExpenseManagement />} />
                <Route path="projects" element={<ProjectManagement />} />
                <Route path="telecom-sites" element={<TelecomSiteManagement />} />
                <Route path="battery-inventory" element={<BatteryInventory />} />
                <Route path="settings" element={<SystemSettings />} />
              </Route>

              {/* Accountant routes */}
              <Route path="/accountant" element={
                <RoleBasedRoute allowedRoles={['accountant']}>
                  <AccountantDashboard />
                </RoleBasedRoute>
              }>
                <Route path="expenses" element={<ExpenseApproval />} />
                <Route path="invoices" element={<InvoiceManagement />} />
                <Route path="reports" element={<FinancialReports />} />
                <Route path="settings" element={<AccountantSettings />} />
              </Route>

              {/* HR routes */}
              <Route path="/hr" element={
                <RoleBasedRoute allowedRoles={['hr']}>
                  <HRDashboard />
                </RoleBasedRoute>
              }>
                <Route path="employees" element={<EmployeeManagement />} />
                <Route path="leave" element={<LeaveManagement />} />
                <Route path="payroll" element={<PayrollManagement />} />
                <Route path="performance" element={<PerformanceReviews />} />
                <Route path="reports" element={<HRReports />} />
                <Route path="settings" element={<HRSettings />} />
              </Route>

              {/* Staff routes */}
              <Route path="/staff" element={
                <RoleBasedRoute allowedRoles={['staff']}>
                  <StaffDashboard />
                </RoleBasedRoute>
              }>
                <Route path="tasks" element={<StaffTasks />} />
                <Route path="leave" element={<LeaveRequests />} />
                <Route path="expenses" element={<ExpenseClaims />} />
                <Route path="documents" element={<DocumentAccess />} />
                <Route path="profile" element={<StaffProfile />} />
              </Route>

              {/* Document routes - accessible by all authenticated users */}
              <Route path="/documents" element={
                <RoleBasedRoute allowedRoles={['staff', 'office_admin', 'accountant', 'hr']}>
                  <DocumentsPage />
                </RoleBasedRoute>
              } />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;

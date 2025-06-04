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
import { UserManagement } from "./components/admin/UserManagement";
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
              
              {/* Admin routes with nested routing */}
              <Route path="/admin" element={
                <RoleBasedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </RoleBasedRoute>
              }>
                <Route path="users" element={<UserManagement />} />
                <Route path="departments" element={<DepartmentManagement />} />
                <Route path="projects" element={<ProjectManagement />} />
                <Route path="time" element={<TimeAttendanceManagement />} />
                <Route path="telecom-sites" element={<TelecomSiteManagement />} />
                <Route path="activity" element={<ActivityManagement />} />
                <Route path="ai" element={<AIManagementSystem />} />
                <Route path="communication" element={<CommunicationCenter />} />
                <Route path="settings" element={<APIKeyManagement />} />
              </Route>
              
              {/* Manager routes with nested routing */}
              <Route path="/manager" element={
                <RoleBasedRoute allowedRoles={['manager']}>
                  <ManagerDashboard />
                </RoleBasedRoute>
              }>
                <Route path="team" element={<TeamOverview />} />
                <Route path="sites" element={<ProjectManagement />} />
                <Route path="workboard" element={<WorkBoard />} />
                <Route path="construction" element={<DepartmentManagement />} />
                <Route path="time" element={<TeamTimeManagement />} />
                <Route path="leave" element={<LeaveManagement />} />
                <Route path="telecom" element={<TelecomSites />} />
                <Route path="reports" element={<ProjectReportManagement />} />
                <Route path="memos" element={<StaffMemoManagement />} />
                <Route path="invoices" element={<InvoiceGenerator />} />
                <Route path="settings" element={<EmailNotificationCenter />} />
              </Route>
              
              {/* Accountant routes with nested routing */}
              <Route path="/accountant" element={
                <RoleBasedRoute allowedRoles={['accountant']}>
                  <AccountantDashboard />
                </RoleBasedRoute>
              }>
                <Route path="reports" element={<FinancialReports />} />
                <Route path="invoices" element={<InvoiceManagement />} />
                <Route path="memos" element={<MemoApproval />} />
                <Route path="inventory" element={<InventoryManagement />} />
                <Route path="payments" element={<PaymentProcessing />} />
                <Route path="settings" element={<AccountSettings />} />
              </Route>
              
              {/* HR routes with nested routing */}
              <Route path="/hr" element={
                <RoleBasedRoute allowedRoles={['hr']}>
                  <HRDashboard />
                </RoleBasedRoute>
              }>
                <Route path="employees" element={<EmployeeManagement />} />
                <Route path="leave" element={<HRLeaveManagement />} />
                <Route path="payroll" element={<PayrollManagement />} />
                <Route path="performance" element={<PerformanceReviews />} />
                <Route path="reports" element={<HRReports />} />
                <Route path="analytics" element={<HRReports />} />
                <Route path="communications" element={<EmailNotificationCenter />} />
                <Route path="settings" element={<APIKeyManagement />} />
              </Route>
              
              {/* Staff routes with nested routing */}
              <Route path="/staff" element={
                <RoleBasedRoute allowedRoles={['staff']}>
                  <StaffDashboard />
                </RoleBasedRoute>
              }>
                <Route path="current-tasks" element={<CurrentTasks />} />
                <Route path="my-tasks" element={<MyTasks />} />
                <Route path="memos" element={<Memos />} />
                <Route path="reports" element={<Reports />} />
                <Route path="profile" element={<StaffProfile />} />
                <Route path="battery-reports" element={<BatteryReports />} />
                <Route path="telecom-reports" element={<TelecomReports />} />
                <Route path="meetings" element={<Meetings />} />
              </Route>
              
              {/* AI Document Analysis Routes - accessible by all authenticated users */}
              <Route path="/documents" element={
                <RoleBasedRoute allowedRoles={['staff', 'manager', 'admin', 'accountant', 'hr']}>
                  <DocumentsPage />
                </RoleBasedRoute>
              } />
              
              {/* AI Document Analyzer Page - accessible by all authenticated users */}
              <Route path="/dashboard/ai-document-analyzer" element={
                <RoleBasedRoute allowedRoles={['staff', 'manager', 'admin', 'accountant', 'hr']}>
                  <AIDocumentAnalyzerPage />
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

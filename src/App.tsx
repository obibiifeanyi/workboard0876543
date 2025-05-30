
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import StaffDashboard from "./pages/staff/StaffDashboard";
import CurrentTasks from "./pages/staff/CurrentTasks";
import MyTasks from "./pages/staff/MyTasks";
import Memos from "./pages/staff/Memos";
import Reports from "./pages/staff/Reports";
import TelecomReports from "./pages/staff/TelecomReports";
import BatteryReports from "./pages/staff/BatteryReports";
import Meetings from "./pages/staff/Meetings";
import StaffProfile from "./pages/staff/StaffProfile";
import ManagerDashboard from "./pages/manager/ManagerDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AccountantDashboard from "./pages/accountant/AccountantDashboard";
import DocumentsPage from "./pages/documents/DocumentsPage";
import { RoleBasedRoute } from "./components/RoleBasedRoute";

// Admin sub-components
import { UserManagement } from "@/components/admin/UserManagement";
import { TelecomSiteManagement } from "@/components/admin/TelecomSiteManagement";
import { ProjectManagement } from "@/components/admin/ProjectManagement";
import { TimeManagement } from "@/components/admin/TimeManagement";
import { LeaveManagement } from "@/components/admin/LeaveManagement";
import { CommunicationCenter } from "@/components/admin/CommunicationCenter";
import { DepartmentManagement } from "@/components/admin/DepartmentManagement";

// Accountant sub-components
import { FinancialReports } from "@/components/accountant/FinancialReports";
import { InvoiceManagement } from "@/components/accountant/InvoiceManagement";
import { PaymentProcessing } from "@/components/accountant/PaymentProcessing";
import { InventoryManagement } from "@/components/accountant/InventoryManagement";
import { MemoApproval } from "@/components/accountant/MemoApproval";
import { AccountSettings } from "@/components/accountant/AccountSettings";

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={<Dashboard />} />
            
            {/* Staff Routes */}
            <Route path="/staff" element={
              <RoleBasedRoute allowedRoles={['staff', 'admin', 'manager']}>
                <StaffDashboard />
              </RoleBasedRoute>
            } />
            <Route path="/staff/current-tasks" element={
              <RoleBasedRoute allowedRoles={['staff', 'admin', 'manager']}>
                <CurrentTasks />
              </RoleBasedRoute>
            } />
            <Route path="/staff/my-tasks" element={
              <RoleBasedRoute allowedRoles={['staff', 'admin', 'manager']}>
                <MyTasks />
              </RoleBasedRoute>
            } />
            <Route path="/staff/memos" element={
              <RoleBasedRoute allowedRoles={['staff', 'admin', 'manager']}>
                <Memos />
              </RoleBasedRoute>
            } />
            <Route path="/staff/reports" element={
              <RoleBasedRoute allowedRoles={['staff', 'admin', 'manager']}>
                <Reports />
              </RoleBasedRoute>
            } />
            <Route path="/staff/telecom-reports" element={
              <RoleBasedRoute allowedRoles={['staff', 'admin', 'manager']}>
                <TelecomReports />
              </RoleBasedRoute>
            } />
            <Route path="/staff/battery-reports" element={
              <RoleBasedRoute allowedRoles={['staff', 'admin', 'manager']}>
                <BatteryReports />
              </RoleBasedRoute>
            } />
            <Route path="/staff/meetings" element={
              <RoleBasedRoute allowedRoles={['staff', 'admin', 'manager']}>
                <Meetings />
              </RoleBasedRoute>
            } />
            <Route path="/staff/profile" element={
              <RoleBasedRoute allowedRoles={['staff', 'admin', 'manager']}>
                <StaffProfile />
              </RoleBasedRoute>
            } />
            
            {/* Manager Routes */}
            <Route path="/manager" element={
              <RoleBasedRoute allowedRoles={['manager', 'admin']}>
                <ManagerDashboard />
              </RoleBasedRoute>
            } />
            
            {/* Admin Routes */}
            <Route path="/admin" element={
              <RoleBasedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </RoleBasedRoute>
            }>
              <Route path="users" element={<UserManagement />} />
              <Route path="sites" element={<TelecomSiteManagement />} />
              <Route path="projects" element={<ProjectManagement />} />
              <Route path="time" element={<TimeManagement />} />
              <Route path="leave" element={<LeaveManagement />} />
              <Route path="communication" element={<CommunicationCenter />} />
              <Route path="departments" element={<DepartmentManagement />} />
            </Route>
            
            {/* Accountant Routes */}
            <Route path="/accountant" element={
              <RoleBasedRoute allowedRoles={['accountant', 'admin']}>
                <AccountantDashboard />
              </RoleBasedRoute>
            }>
              <Route path="financial-reports" element={<FinancialReports />} />
              <Route path="invoices" element={<InvoiceManagement />} />
              <Route path="payments" element={<PaymentProcessing />} />
              <Route path="inventory" element={<InventoryManagement />} />
              <Route path="memos" element={<MemoApproval />} />
              <Route path="settings" element={<AccountSettings />} />
            </Route>
            
            {/* Documents Routes */}
            <Route path="/documents" element={
              <RoleBasedRoute allowedRoles={['staff', 'manager', 'admin', 'accountant']}>
                <DocumentsPage />
              </RoleBasedRoute>
            } />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  );
}

export default App;

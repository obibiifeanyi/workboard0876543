
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import DocumentsPage from "./pages/documents/DocumentsPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManagerDashboard from "./pages/manager/ManagerDashboard";
import AccountantDashboard from "./pages/accountant/AccountantDashboard";
import StaffDashboard from "./pages/staff/StaffDashboard";
import HRDashboard from "./pages/hr/HRDashboard";
import { RoleBasedRoute } from "./components/RoleBasedRoute";

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
              <Route path="/dashboard" element={<Dashboard />} />
              
              {/* Role-based dashboard routes */}
              <Route path="/admin/*" element={
                <RoleBasedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </RoleBasedRoute>
              } />
              
              <Route path="/manager/*" element={
                <RoleBasedRoute allowedRoles={['manager']}>
                  <ManagerDashboard />
                </RoleBasedRoute>
              } />
              
              <Route path="/accountant/*" element={
                <RoleBasedRoute allowedRoles={['accountant']}>
                  <AccountantDashboard />
                </RoleBasedRoute>
              } />
              
              <Route path="/hr/*" element={
                <RoleBasedRoute allowedRoles={['hr']}>
                  <HRDashboard />
                </RoleBasedRoute>
              } />
              
              <Route path="/staff/*" element={
                <RoleBasedRoute allowedRoles={['staff']}>
                  <StaffDashboard />
                </RoleBasedRoute>
              } />
              
              {/* AI Document Analysis Routes - accessible by all authenticated users */}
              <Route path="/documents" element={
                <RoleBasedRoute allowedRoles={['staff', 'manager', 'admin', 'accountant', 'hr']}>
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

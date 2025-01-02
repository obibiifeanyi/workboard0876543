import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { RoleBasedRoute } from "@/components/RoleBasedRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManagerDashboard from "./pages/manager/ManagerDashboard";
import StaffDashboard from "./pages/staff/StaffDashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
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
            path="/manager/*" 
            element={
              <RoleBasedRoute 
                element={<ManagerDashboard />} 
                allowedRoles={["manager"]} 
              />
            } 
          />
          <Route 
            path="/staff/*" 
            element={
              <RoleBasedRoute 
                element={<StaffDashboard />} 
                allowedRoles={["staff", "manager", "admin"]} 
              />
            } 
          />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
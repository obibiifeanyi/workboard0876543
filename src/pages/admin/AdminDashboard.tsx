
import { useState, Suspense } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { AdminNavigation } from "@/components/admin/AdminNavigation";
import { Outlet, useLocation } from "react-router-dom";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Loader } from "@/components/ui/Loader";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/hooks/use-toast";

const AdminDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();
  const { toast } = useToast();

  return (
    <DashboardLayout 
      title="Admin Dashboard"
      navigation={isSidebarOpen && <AdminNavigation />}
    >
      <div className="flex flex-col p-6 space-y-4">
        <div className="flex justify-between items-center">
          <Breadcrumb path={location.pathname} />
          <Button 
            variant="ghost" 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="lg:hidden"
          >
            {isSidebarOpen ? "Hide Sidebar" : "Show Sidebar"}
          </Button>
        </div>

        <ErrorBoundary>
          <Suspense fallback={
            <div className="flex items-center justify-center h-[50vh]">
              <Loader className="h-8 w-8 animate-spin text-primary" />
            </div>
          }>
            <Outlet />
          </Suspense>
        </ErrorBoundary>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;

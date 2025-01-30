import { useState, Suspense } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { AdminNavigation } from "@/components/admin/AdminNavigation";
import { Outlet, useLocation } from "react-router-dom";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Loader } from "@/components/ui/Loader";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Button } from "@/components/ui/Button";

const AdminDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();

  return (
    <DashboardLayout 
      title="Admin Dashboard"
      navigation={isSidebarOpen && <AdminNavigation />}
    >
      <div className="flex flex-col p-6 space-y-4">
        {/* Sidebar Toggle Button */}
        <Button 
          variant="ghost" 
          className="self-end"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? "Hide Sidebar" : "Show Sidebar"}
        </Button>

        {/* Breadcrumb Navigation */}
        <Breadcrumb path={location.pathname} />

        {/* Main Content */}
        <ErrorBoundary>
          <Suspense fallback={<Loader />}>
            <Outlet />
          </Suspense>
        </ErrorBoundary>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;

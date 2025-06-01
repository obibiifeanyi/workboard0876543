
import { useState, Suspense } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { AdminNavigation } from "@/components/admin/AdminNavigation";
import { Outlet, useLocation } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Loader } from "@/components/ui/Loader";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Button } from "@/components/ui/button";
import { AdminDashboardModule } from "@/components/admin/dashboard/AdminDashboardModule";

const AdminDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();
  const isRootAdminRoute = location.pathname === '/admin';

  const renderBreadcrumb = () => {
    const paths = location.pathname.split('/').filter(Boolean);
    
    return (
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          {paths.map((path, index) => {
            const href = `/${paths.slice(0, index + 1).join('/')}`;
            const isLast = index === paths.length - 1;
            const displayName = path.charAt(0).toUpperCase() + path.slice(1).replace('-', ' ');
            
            return (
              <BreadcrumbItem key={path}>
                {isLast ? (
                  <BreadcrumbPage>{displayName}</BreadcrumbPage>
                ) : (
                  <>
                    <BreadcrumbLink href={href}>{displayName}</BreadcrumbLink>
                    <BreadcrumbSeparator />
                  </>
                )}
              </BreadcrumbItem>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
    );
  };

  return (
    <DashboardLayout 
      title="Admin Dashboard"
      navigation={<AdminNavigation />}
      seoDescription="CT Communication Towers Admin Dashboard - Manage users, projects, and system operations"
      seoKeywords="admin, dashboard, management, users, projects, telecommunications"
    >
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          {renderBreadcrumb()}
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
            {isRootAdminRoute ? <AdminDashboardModule /> : <Outlet />}
          </Suspense>
        </ErrorBoundary>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;

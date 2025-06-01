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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { AdminTabContent } from "@/components/admin/dashboard/AdminTabContent";

const AdminDashboard = () => {
  const location = useLocation();
  const isRootAdminRoute = location.pathname === '/admin';
  const [activeTab, setActiveTab] = useState("overview");

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
      seoDescription="CT Communication Towers Admin Dashboard - Complete system management and oversight"
      seoKeywords="admin, dashboard, management, users, departments, projects, telecommunications"
    >
      <div className="space-y-6">
        {renderBreadcrumb()}

        <ErrorBoundary>
          <Suspense fallback={
            <div className="flex items-center justify-center h-[50vh]">
              <Loader className="h-8 w-8 animate-spin text-primary" />
            </div>
          }>
            {isRootAdminRoute ? (
              <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <div className="border-b">
                  <TabsList className="grid w-full grid-cols-6 lg:grid-cols-12">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="users">Users</TabsTrigger>
                    <TabsTrigger value="departments">Departments</TabsTrigger>
                    <TabsTrigger value="projects">Projects</TabsTrigger>
                    <TabsTrigger value="telecom">Telecom</TabsTrigger>
                    <TabsTrigger value="time">Time</TabsTrigger>
                    <TabsTrigger value="leave">Leave</TabsTrigger>
                    <TabsTrigger value="memos">Memos</TabsTrigger>
                    <TabsTrigger value="fleet">Fleet</TabsTrigger>
                    <TabsTrigger value="communications">Comms</TabsTrigger>
                    <TabsTrigger value="analytics">Analytics</TabsTrigger>
                    <TabsTrigger value="settings">Settings</TabsTrigger>
                  </TabsList>
                </div>
                <AdminTabContent activeTab={activeTab} />
              </Tabs>
            ) : (
              <Outlet />
            )}
          </Suspense>
        </ErrorBoundary>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;

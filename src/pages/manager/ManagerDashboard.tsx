
import { useState, Suspense } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { ManagerNavigation } from "@/components/manager/ManagerNavigation";
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
import { ManagerTabContent } from "@/components/manager/dashboard/ManagerTabContent";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const ManagerDashboard = () => {
  const location = useLocation();
  const isRootManagerRoute = location.pathname === '/manager';
  const [activeTab, setActiveTab] = useState("team");

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
      title="Manager Dashboard"
      navigation={<ManagerNavigation />}
      seoDescription="CT Communication Towers Manager Dashboard - Manage teams, projects, and operations"
      seoKeywords="manager, dashboard, team management, projects, telecommunications"
    >
      <div className="space-y-6">
        {renderBreadcrumb()}

        <ErrorBoundary>
          <Suspense fallback={
            <div className="flex items-center justify-center h-[50vh]">
              <Loader className="h-8 w-8 animate-spin text-primary" />
            </div>
          }>
            {isRootManagerRoute ? (
              <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <div className="border-b">
                  <TabsList className="grid w-full grid-cols-6 lg:grid-cols-12">
                    <TabsTrigger value="team">Team</TabsTrigger>
                    <TabsTrigger value="sites">Sites</TabsTrigger>
                    <TabsTrigger value="workboard">Work Board</TabsTrigger>
                    <TabsTrigger value="construction">Construction</TabsTrigger>
                    <TabsTrigger value="time">Time</TabsTrigger>
                    <TabsTrigger value="leave">Leave</TabsTrigger>
                    <TabsTrigger value="telecom">Telecom</TabsTrigger>
                    <TabsTrigger value="reports">Reports</TabsTrigger>
                    <TabsTrigger value="memos">Memos</TabsTrigger>
                    <TabsTrigger value="invoices">Invoices</TabsTrigger>
                    <TabsTrigger value="settings">Settings</TabsTrigger>
                    <TabsTrigger value="analytics">Analytics</TabsTrigger>
                  </TabsList>
                </div>
                <ManagerTabContent activeTab={activeTab} />
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

export default ManagerDashboard;

import { useState, Suspense } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { StaffAdminNavigation } from "@/components/staff-admin/StaffAdminNavigation";
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
import { StaffAdminOverview } from "@/components/staff-admin/StaffAdminOverview";

const StaffAdminDashboard = () => {
  const location = useLocation();
  const isRootStaffAdminRoute = location.pathname === '/staff-admin';

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
      title="Staff Admin Dashboard"
      navigation={<StaffAdminNavigation />}
      seoDescription="CT Communication Towers Staff Admin Dashboard - Manage users, departments, projects, and more"
      seoKeywords="staff admin, dashboard, user management, department management, project management, task assignment"
    >
      <div className="space-y-6">
        {renderBreadcrumb()}

        <ErrorBoundary>
          <Suspense fallback={
            <div className="flex items-center justify-center h-[50vh]">
              <Loader className="h-8 w-8 animate-spin text-primary" />
            </div>
          }>
            {isRootStaffAdminRoute ? <StaffAdminOverview /> : <Outlet />}
          </Suspense>
        </ErrorBoundary>
      </div>
    </DashboardLayout>
  );
};

export default StaffAdminDashboard; 
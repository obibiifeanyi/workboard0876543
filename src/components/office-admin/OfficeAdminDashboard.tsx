import React, { Suspense } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { OfficeAdminNavigation } from "@/components/office-admin/OfficeAdminNavigation";
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
import { Outlet, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InventoryManagement } from "./InventoryManagement";
import { ExpenseManagement } from "./ExpenseManagement";
import { ProcurementManagement } from "./ProcurementManagement";
import { DocumentLibrary } from "./DocumentLibrary";
import { AccountantNotification } from "./AccountantNotification";

export const OfficeAdminDashboard = () => {
  const location = useLocation();
  const { loading: authLoading } = useAuth();

  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

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
      title="Office Admin Dashboard"
      navigation={<OfficeAdminNavigation />}
      seoDescription="CT Communication Towers Office Admin Dashboard - Comprehensive office management system"
      seoKeywords="office admin, dashboard, management, hr, inventory, procurement, documents, expenses"
    >
      <div className="space-y-6">
        {renderBreadcrumb()}
        <ErrorBoundary>
          <Suspense fallback={
            <div className="flex items-center justify-center h-[50vh]">
              <Loader className="h-8 w-8 animate-spin text-primary" />
            </div>
          }>
            <Tabs defaultValue="inventory" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="inventory">Inventory</TabsTrigger>
                <TabsTrigger value="expense">Expense</TabsTrigger>
                <TabsTrigger value="procurement">Procurement</TabsTrigger>
                <TabsTrigger value="document">Document Library</TabsTrigger>
                <TabsTrigger value="notification">Notifications</TabsTrigger>
              </TabsList>
              <TabsContent value="inventory">
                <InventoryManagement />
              </TabsContent>
              <TabsContent value="expense">
                <ExpenseManagement />
              </TabsContent>
              <TabsContent value="procurement">
                <ProcurementManagement />
              </TabsContent>
              <TabsContent value="document">
                <DocumentLibrary />
              </TabsContent>
              <TabsContent value="notification">
                <AccountantNotification />
              </TabsContent>
            </Tabs>
          </Suspense>
        </ErrorBoundary>
      </div>
    </DashboardLayout>
  );
}; 
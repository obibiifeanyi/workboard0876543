import { useState, Suspense } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { AccountantNavigation } from "@/components/accountant/AccountantNavigation";
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
import { AccountantTabContent } from "@/components/accountant/AccountantTabContent";

const AccountantDashboard = () => {
  const location = useLocation();
  const isRootAccountantRoute = location.pathname === '/accountant';
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
      title="Accountant Dashboard"
      navigation={<AccountantNavigation />}
      seoDescription="CT Communication Towers Accountant Dashboard - Financial management and reporting"
      seoKeywords="accountant, dashboard, financial, reports, invoices, payments"
    >
      <div className="space-y-6">
        {renderBreadcrumb()}

        <ErrorBoundary>
          <Suspense fallback={
            <div className="flex items-center justify-center h-[50vh]">
              <Loader className="h-8 w-8 animate-spin text-primary" />
            </div>
          }>
            {isRootAccountantRoute ? (
              <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <div className="border-b">
                  <TabsList className="grid w-full grid-cols-6">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="financial-reports">Reports</TabsTrigger>
                    <TabsTrigger value="invoices">Invoices</TabsTrigger>
                    <TabsTrigger value="payments">Payments</TabsTrigger>
                    <TabsTrigger value="inventory">Inventory</TabsTrigger>
                    <TabsTrigger value="fleet">Fleet</TabsTrigger>
                  </TabsList>
                </div>
                <AccountantTabContent />
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

export default AccountantDashboard;

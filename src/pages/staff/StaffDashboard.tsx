import { useState, Suspense } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Outlet, useLocation, NavLink } from "react-router-dom";
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
import { StaffOverview } from "@/components/staff/StaffOverview";
import {
  LayoutDashboard,
  CheckSquare,
  ListTodo,
  FileText,
  User,
  Battery,
  Radio,
  Users,
  MessageSquare,
  FileSearch,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DocumentManagement } from "@/components/shared/DocumentManagement";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FormSubmission } from '@/components/shared/FormSubmission';
import { DashboardClockInButton } from '@/components/DashboardClockInButton';
import { TimeLogTable } from '@/components/shared/TimeLogTable';

const StaffDashboard = () => {
  const location = useLocation();
  const isRootStaffRoute = location.pathname === '/staff';
  const { user } = useAuth();

  const navItems = [
    { to: "/staff", icon: LayoutDashboard, label: "Dashboard", end: true },
    { to: "/staff/current-tasks", icon: CheckSquare, label: "Current Tasks" },
    { to: "/staff/my-tasks", icon: ListTodo, label: "My Tasks" },
    { to: "/staff/memos", icon: MessageSquare, label: "Memos" },
    { to: "/staff/reports", icon: FileText, label: "Reports" },
    { to: "/staff/profile", icon: User, label: "Profile" },
    { to: "/staff/battery-reports", icon: Battery, label: "Battery Reports" },
    { to: "/staff/telecom-reports", icon: Radio, label: "Telecom Reports" },
    { to: "/staff/meetings", icon: Users, label: "Meetings" },
    { to: "/dashboard/ai-document-analyzer", icon: FileSearch, label: "AI Document Analyzer" },
  ];

  const navigation = (
    <div className="p-4">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-blue-700 dark:text-blue-400">Staff Dashboard</h2>
        <p className="text-sm text-muted-foreground">Manage your tasks and activities</p>
      </div>
      
      <nav className="space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 transition-colors",
                "hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-blue-900/20",
                isActive
                  ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 border-r-2 border-blue-600"
                  : "text-muted-foreground hover:text-foreground"
              )
            }
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );

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

  // Fetch available forms for the staff member's department
  const { data: forms, isLoading: isLoadingForms } = useQuery({
    queryKey: ['staff-forms', user?.id],
    queryFn: async () => {
      const { data: profile } = await supabase
        .from('profiles')
        .select('department_id')
        .eq('id', user?.id)
        .single();

      if (!profile?.department_id) return [];

      const { data, error } = await supabase
        .from('forms')
        .select('*')
        .eq('department_id', profile.department_id)
        .eq('is_active', true);

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  return (
    <DashboardLayout 
      title="Staff Dashboard"
      navigation={navigation}
      seoDescription="CT Communication Towers Staff Dashboard - Manage your tasks and daily activities"
      seoKeywords="staff, dashboard, tasks, reports, telecommunications"
    >
      <div className="space-y-6">
        {renderBreadcrumb()}

        <ErrorBoundary>
          <Suspense fallback={
            <div className="flex items-center justify-center h-[50vh]">
              <Loader className="h-8 w-8 animate-spin text-primary" />
            </div>
          }>
            {isRootStaffRoute ? <StaffOverview /> : <Outlet />}
          </Suspense>
        </ErrorBoundary>

        <DashboardClockInButton />

        <Tabs defaultValue="forms" className="space-y-4">
          <TabsList>
            <TabsTrigger value="forms">Forms</TabsTrigger>
            <TabsTrigger value="time-logs">Time Logs</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
          </TabsList>

          <TabsContent value="forms" className="space-y-4">
            {isLoadingForms ? (
              <div>Loading forms...</div>
            ) : forms?.length === 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-muted-foreground">No forms available at the moment.</p>
                </CardContent>
              </Card>
            ) : (
              forms?.map((form) => (
                <FormSubmission key={form.id} formId={form.id} />
              ))
            )}
          </TabsContent>

          <TabsContent value="time-logs">
            <TimeLogTable userId={user?.id} />
          </TabsContent>

          <TabsContent value="documents">
            <DocumentManagement userId={user?.id} />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default StaffDashboard;

import { useLocation, Outlet } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { ManagerNavigation } from "@/components/manager/ManagerNavigation";
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
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { DashboardClockInButton } from "@/components/DashboardClockInButton";
import React, { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ActivityLogger } from "@/lib/activity-logger";
import { toast } from "sonner";

export const ManagerDashboard = () => {
  const location = useLocation();
  const { user } = useAuth();

  // Log manager dashboard access
  useEffect(() => {
    if (user) {
      ActivityLogger.logUserLogin(user.id, user.email || "Unknown");
    }
  }, [user]);

  // Fetch department activities
  const { data: activities, isLoading: activitiesLoading } = useQuery({
    queryKey: ["department-activities"],
    queryFn: async () => {
      const { data: userDept, error: deptError } = await supabase
        .from("users")
        .select("department_id")
        .eq("id", user?.id)
        .single();

      if (deptError) throw deptError;

      const { data, error } = await supabase
        .from("system_activities")
        .select("*")
        .or(`target_type.eq.department,target_type.eq.document,target_type.eq.form`)
        .eq("target_id", userDept.department_id)
        .order("created_at", { ascending: false })
        .limit(20);

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  // Fetch department statistics
  const { data: departmentStats, isLoading: deptStatsLoading } = useQuery({
    queryKey: ["manager-department-stats"],
    queryFn: async () => {
      const { data: userDept, error: deptError } = await supabase
        .from("users")
        .select("department_id")
        .eq("id", user?.id)
        .single();

      if (deptError) throw deptError;

      const { data, error } = await supabase
        .from("departments")
        .select(`
          id,
          name,
          employees:users(count),
          documents:documents(count),
          forms:forms(count)
        `)
        .eq("id", userDept.department_id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  if (activitiesLoading || deptStatsLoading) {
    return <div>Loading...</div>;
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
      title="Manager Dashboard"
      navigation={<ManagerNavigation />}
      seoDescription="CT Communication Towers Manager Dashboard - Manage teams, projects, and operations"
      seoKeywords="manager, dashboard, team management, projects, telecommunications"
    >
      <div className="space-y-6">
        <div className="flex justify-end">
          <DashboardClockInButton />
        </div>
        {renderBreadcrumb()}
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>

        {/* Department Statistics */}
        <Card>
          <CardHeader>
            <CardTitle>Department Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Employees</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{departmentStats?.employees?.[0]?.count || 0}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Documents</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{departmentStats?.documents?.[0]?.count || 0}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Forms</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{departmentStats?.forms?.[0]?.count || 0}</p>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        {/* Recent Department Activities */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Department Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activities?.map((activity: any) => (
                <div key={activity.id} className="flex items-start space-x-4 p-4 border rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium">{activity.details}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(activity.created_at).toLocaleString()}
                    </p>
                    {activity.metadata && Object.entries(activity.metadata).length > 0 && (
                      <div className="mt-2 text-sm">
                        <p className="font-medium">Details:</p>
                        <pre className="mt-1 p-2 bg-muted rounded">
                          {JSON.stringify(activity.metadata, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ManagerDashboard;

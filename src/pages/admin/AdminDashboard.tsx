import { useState, Suspense, useEffect } from "react";
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
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserManagement } from '@/components/staff-admin/UserManagement';
import { DepartmentManagement } from '@/components/staff-admin/DepartmentManagement';
import { DocumentManagement } from '@/components/shared/DocumentManagement';
import { FormBuilder } from '@/components/admin/FormBuilder';
import { useAuth } from "@/hooks/use-auth";
import { ActivityLogger } from "@/lib/activity-logger";
import { toast } from "sonner";

const AdminDashboard = () => {
  const location = useLocation();
  const isRootAdminRoute = location.pathname === '/admin';
  const [activeTab, setActiveTab] = useState("overview");
  const { user } = useAuth();

  // System stats
  const { data: stats, isLoading: isLoadingStats } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const [{ count: userCount }, { count: deptCount }, { count: docCount }, { count: formCount }, { count: submissionCount }] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('departments').select('*', { count: 'exact', head: true }),
        supabase.from('documents').select('*', { count: 'exact', head: true }),
        supabase.from('forms').select('*', { count: 'exact', head: true }),
        supabase.from('form_submissions').select('*', { count: 'exact', head: true }),
      ]);
      return {
        userCount,
        deptCount,
        docCount,
        formCount,
        submissionCount,
      };
    },
  });

  // System activity feed
  const { data: activities, isLoading: isLoadingActivities } = useQuery({
    queryKey: ['system-activities'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('system_activities')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);
      if (error) throw error;
      return data;
    },
  });

  // Log admin dashboard access
  useEffect(() => {
    if (user) {
      ActivityLogger.logUserLogin(user.id, user.email || "Unknown");
    }
  }, [user]);

  // Fetch department statistics
  const { data: departmentStats, isLoading: deptStatsLoading } = useQuery({
    queryKey: ["department-stats"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("departments")
        .select(`
          id,
          name,
          employees:users(count)
        `);

      if (error) throw error;
      return data;
    },
  });

  // Fetch user statistics
  const { data: userStats, isLoading: userStatsLoading } = useQuery({
    queryKey: ["user-stats"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("users")
        .select("role")
        .then(({ data }) => {
          const stats = {
            total: data?.length || 0,
            byRole: data?.reduce((acc: any, user) => {
              acc[user.role] = (acc[user.role] || 0) + 1;
              return acc;
            }, {}),
          };
          return stats;
        });

      if (error) throw error;
      return data;
    },
  });

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

  if (isLoadingStats || isLoadingActivities || deptStatsLoading || userStatsLoading) {
    return <div>Loading...</div>;
  }

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

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="py-4">
              <div className="text-2xl font-bold">{isLoadingStats ? '...' : stats?.userCount ?? 0}</div>
              <div className="text-muted-foreground">Users</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-4">
              <div className="text-2xl font-bold">{isLoadingStats ? '...' : stats?.deptCount ?? 0}</div>
              <div className="text-muted-foreground">Departments</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-4">
              <div className="text-2xl font-bold">{isLoadingStats ? '...' : stats?.docCount ?? 0}</div>
              <div className="text-muted-foreground">Documents</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-4">
              <div className="text-2xl font-bold">{isLoadingStats ? '...' : stats?.formCount ?? 0}</div>
              <div className="text-muted-foreground">Forms</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-4">
              <div className="text-2xl font-bold">{isLoadingStats ? '...' : stats?.submissionCount ?? 0}</div>
              <div className="text-muted-foreground">Submissions</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="activities" className="space-y-4">
          <TabsList>
            <TabsTrigger value="activities">Activities</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="departments">Departments</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="forms">Forms</TabsTrigger>
          </TabsList>

          <TabsContent value="activities">
            <Card>
              <CardHeader>
                <CardTitle>System Activities</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoadingActivities ? (
                  <div>Loading activities...</div>
                ) : activities?.length === 0 ? (
                  <div className="text-muted-foreground">No activities found.</div>
                ) : (
                  <ul className="space-y-2">
                    {activities.map((activity) => (
                      <li key={activity.id} className="border-b pb-2">
                        <div className="font-medium">{activity.action}</div>
                        <div className="text-xs text-muted-foreground">
                          {activity.actor} &middot; {new Date(activity.created_at).toLocaleString()}
                        </div>
                        <div className="text-sm">{activity.details}</div>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <UserManagement />
          </TabsContent>

          <TabsContent value="departments">
            <DepartmentManagement />
          </TabsContent>

          <TabsContent value="documents">
            <DocumentManagement />
          </TabsContent>

          <TabsContent value="forms">
            <FormBuilder />
          </TabsContent>
        </Tabs>

        {/* Department Statistics */}
        <Card>
          <CardHeader>
            <CardTitle>Department Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {departmentStats?.map((dept: any) => (
                <Card key={dept.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{dept.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">{dept.employees?.[0]?.count || 0}</p>
                    <p className="text-sm text-muted-foreground">Employees</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* User Statistics */}
        <Card>
          <CardHeader>
            <CardTitle>User Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Total Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{userStats?.total || 0}</p>
                </CardContent>
              </Card>
              {userStats?.byRole && Object.entries(userStats.byRole).map(([role, count]) => (
                <Card key={role}>
                  <CardHeader>
                    <CardTitle className="text-lg capitalize">{role.replace('_', ' ')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">{count}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle>Recent System Activities</CardTitle>
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

export default AdminDashboard;

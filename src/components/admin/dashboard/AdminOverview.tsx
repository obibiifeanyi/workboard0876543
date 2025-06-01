
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAdminOperations } from "@/hooks/admin/useAdminOperations";
import { Users, Building2, FolderOpen, Clock, TrendingUp, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Loader } from "lucide-react";

export const AdminOverview = () => {
  const { useSystemActivities, useAdminStats, useDepartments } = useAdminOperations();
  const { data: activities, isLoading: activitiesLoading } = useSystemActivities();
  const { data: stats, isLoading: statsLoading } = useAdminStats();
  const { data: departments, isLoading: departmentsLoading } = useDepartments();

  if (statsLoading || activitiesLoading || departmentsLoading) {
    return (
      <div className="flex items-center justify-center h-32">
        <Loader className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Users",
      value: stats?.totalUsers || 0,
      description: "Registered users",
      icon: Users,
      color: "text-blue-600",
    },
    {
      title: "Departments",
      value: departments?.length || 0,
      description: "Active departments",
      icon: Building2,
      color: "text-green-600",
    },
    {
      title: "Pending Tasks",
      value: stats?.pendingTasks || 0,
      description: "Awaiting completion",
      icon: Clock,
      color: "text-orange-600",
    },
    {
      title: "Completed Tasks",
      value: stats?.completedTasks || 0,
      description: "This period",
      icon: TrendingUp,
      color: "text-purple-600",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Recent System Activities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activities && activities.length > 0 ? (
                activities.slice(0, 5).map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.description}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(activity.created_at).toLocaleString()}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {activity.type}
                    </Badge>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No recent activities
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Departments Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Departments Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {departments && departments.length > 0 ? (
                departments.slice(0, 5).map((dept) => (
                  <div key={dept.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div>
                      <p className="text-sm font-medium">{dept.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {dept.employee_count || 0} employees
                      </p>
                    </div>
                    <Badge variant="secondary">
                      {dept.manager_id ? "Has Manager" : "No Manager"}
                    </Badge>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No departments found
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
            <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-center">
              <Users className="h-8 w-8 mx-auto mb-2 text-blue-600" />
              <p className="text-sm font-medium">Manage Users</p>
              <p className="text-xs text-muted-foreground">Add, edit, or remove users</p>
            </div>
            <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 text-center">
              <Building2 className="h-8 w-8 mx-auto mb-2 text-green-600" />
              <p className="text-sm font-medium">Departments</p>
              <p className="text-xs text-muted-foreground">Organize company structure</p>
            </div>
            <div className="p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20 text-center">
              <FolderOpen className="h-8 w-8 mx-auto mb-2 text-purple-600" />
              <p className="text-sm font-medium">Projects</p>
              <p className="text-xs text-muted-foreground">Create and manage projects</p>
            </div>
            <div className="p-4 rounded-lg bg-orange-50 dark:bg-orange-900/20 text-center">
              <Clock className="h-8 w-8 mx-auto mb-2 text-orange-600" />
              <p className="text-sm font-medium">Time Tracking</p>
              <p className="text-xs text-muted-foreground">Monitor attendance</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};


import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, Calendar as CalendarIcon, CheckCircle, Bell } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { TaskList } from "@/components/staff/TaskList";
import { LeaveApplication } from "@/components/staff/LeaveApplication";
import { ProfileSection } from "@/components/staff/ProfileSection";
import { AIDocumentButton } from "@/components/shared/AIDocumentButton";
import { BackToAdminButton } from "@/components/shared/BackToAdminButton";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const StaffDashboard = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const { toast } = useToast();

  // Fetch real data from Supabase instead of using mock data
  const { data: statsData } = useQuery({
    queryKey: ['staff-stats'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      // Get today's time logs
      const today = new Date().toISOString().split('T')[0];
      const { data: timeLogs } = await supabase
        .from('time_logs')
        .select('*')
        .eq('user_id', user.id)
        .gte('clock_in', `${today}T00:00:00.000Z`)
        .lt('clock_in', `${today}T23:59:59.999Z`);

      // Get completed tasks this week
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - weekStart.getDay());
      const { data: tasks } = await supabase
        .from('tasks')
        .select('*')
        .eq('assigned_to_id', user.id)
        .eq('status', 'completed')
        .gte('updated_at', weekStart.toISOString());

      // Get leave balance (assuming 25 days annual leave minus used days)
      const { data: leaveRequests } = await supabase
        .from('leave_requests')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'approved');

      // Get unread notifications
      const { data: notifications } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_read', false);

      const hoursToday = timeLogs?.reduce((total, log) => {
        if (log.clock_out) {
          const clockIn = new Date(log.clock_in);
          const clockOut = new Date(log.clock_out);
          return total + (clockOut.getTime() - clockIn.getTime()) / (1000 * 60 * 60);
        }
        return total;
      }, 0) || 0;

      const usedLeaveDays = leaveRequests?.reduce((total, request) => {
        const start = new Date(request.start_date);
        const end = new Date(request.end_date);
        const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
        return total + days;
      }, 0) || 0;

      return {
        hoursToday: hoursToday.toFixed(1),
        completedTasks: tasks?.length || 0,
        leaveBalance: 25 - usedLeaveDays,
        unreadNotifications: notifications?.length || 0
      };
    }
  });

  const stats = [
    {
      title: "Hours Today",
      value: statsData?.hoursToday || "0.0",
      description: "Out of 8 hours",
      icon: Clock,
    },
    {
      title: "Tasks Completed",
      value: statsData?.completedTasks?.toString() || "0",
      description: "This week",
      icon: CheckCircle,
    },
    {
      title: "Leave Balance",
      value: statsData?.leaveBalance?.toString() || "25",
      description: "Days remaining",
      icon: CalendarIcon,
    },
    {
      title: "Notifications",
      value: statsData?.unreadNotifications?.toString() || "0",
      description: "Unread messages",
      icon: Bell,
    },
  ];

  const dashboardActions = (
    <div className="flex gap-2">
      <AIDocumentButton />
      <BackToAdminButton />
    </div>
  );

  return (
    <DashboardLayout title="Staff Dashboard" actions={dashboardActions}>
      <div className="space-y-6 p-4 md:p-6 max-w-7xl mx-auto">
        <div className="grid gap-4 md:gap-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <Card key={stat.title}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      {stat.title}
                    </CardTitle>
                    <Icon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <p className="text-xs text-muted-foreground">
                      {stat.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        <Tabs defaultValue="tasks" className="space-y-4">
          <TabsList className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <TabsTrigger value="tasks">My Tasks</TabsTrigger>
            <TabsTrigger value="leave">Leave Application</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <div className="mt-6 bg-black/5 dark:bg-black/20 rounded-3xl p-4 md:p-6">
            <TabsContent value="tasks" className="space-y-4 mt-0">
              <Card className="border-none shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl md:text-2xl">
                    Current Tasks
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <TaskList />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="leave" className="space-y-4 mt-0">
              <LeaveApplication
                date={date}
                onDateSelect={setDate}
                onLeaveRequest={() => {
                  toast({
                    title: "Leave Request Submitted",
                    description: `Your leave request for ${date?.toLocaleDateString()} has been submitted.`,
                  });
                }}
              />
            </TabsContent>

            <TabsContent value="profile" className="space-y-4 mt-0">
              <ProfileSection />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default StaffDashboard;

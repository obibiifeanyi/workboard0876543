
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Users, FileText, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Stats {
  totalTeamMembers: number;
  activeProjects: number;
  completedReports: number;
  totalHoursLogged: number;
}

export const ManagerStats = () => {
  const [stats, setStats] = useState<Stats>({
    totalTeamMembers: 0,
    activeProjects: 0,
    completedReports: 0,
    totalHoursLogged: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return;

      // Fetch team members count
      const { count: teamCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact' })
        .neq('id', user.user.id);

      // Fetch active projects count
      const { count: projectCount } = await supabase
        .from('projects')
        .select('*', { count: 'exact' })
        .in('status', ['planning', 'in_progress']);

      // Fetch completed reports count
      const { count: reportCount } = await supabase
        .from('site_reports')
        .select('*', { count: 'exact' })
        .eq('status', 'completed');

      // Fetch total hours logged this month
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const { data: timeLogs } = await supabase
        .from('time_logs')
        .select('total_hours')
        .gte('created_at', startOfMonth.toISOString())
        .not('total_hours', 'is', null);

      const totalHours = timeLogs?.reduce((sum, log) => sum + (log.total_hours || 0), 0) || 0;

      setStats({
        totalTeamMembers: teamCount || 0,
        activeProjects: projectCount || 0,
        completedReports: reportCount || 0,
        totalHoursLogged: Math.round(totalHours * 10) / 10,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const statsData = [
    {
      title: "Team Members",
      value: stats.totalTeamMembers.toString(),
      description: "Active team members",
      icon: Users,
      color: "text-blue-600",
    },
    {
      title: "Active Projects",
      value: stats.activeProjects.toString(),
      description: "In progress",
      icon: FileText,
      color: "text-green-600",
    },
    {
      title: "Reports Completed",
      value: stats.completedReports.toString(),
      description: "This month",
      icon: TrendingUp,
      color: "text-purple-600",
    },
    {
      title: "Hours Logged",
      value: stats.totalHoursLogged.toString(),
      description: "This month",
      icon: Clock,
      color: "text-orange-600",
    },
  ];

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statsData.map((stat, index) => (
        <Card key={index} className="glass-card hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-manager-primary">
              {stat.title}
            </CardTitle>
            <stat.icon className={`h-5 w-5 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-manager-primary">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

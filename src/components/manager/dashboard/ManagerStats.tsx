
import { StatsCards } from "@/components/StatsCards";
import { Users, FileText, BarChart, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useManagerData } from "@/hooks/manager/useManagerData";

export const ManagerStats = () => {
  const { teamMembers, projects, timeLogs, isLoadingTeam, isLoadingProjects } = useManagerData();

  const activeProjects = projects?.filter(p => p.status === 'in_progress').length || 0;
  const completedProjects = projects?.filter(p => p.status === 'completed').length || 0;
  const totalHours = timeLogs?.reduce((total, log) => {
    if (log.total_hours) return total + Number(log.total_hours);
    return total;
  }, 0) || 0;

  const stats = [
    {
      title: "Team Members",
      value: teamMembers?.length.toString() || "0",
      description: "Active members",
      icon: Users,
    },
    {
      title: "Active Projects",
      value: activeProjects.toString(),
      description: `${completedProjects} completed`,
      icon: FileText,
    },
    {
      title: "Performance",
      value: "92%",
      description: "+5% from last month",
      icon: BarChart,
    },
    {
      title: "Time Tracked",
      value: `${Math.round(totalHours)}h`,
      description: "This month",
      icon: Clock,
    },
  ];

  if (isLoadingTeam || isLoadingProjects) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="p-6">
              <div className="animate-pulse space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                <div className="h-3 bg-gray-200 rounded w-full"></div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <StatsCards stats={stats} />
      
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-6 glass-card">
          <h3 className="text-lg font-semibold mb-4">Team Performance</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm">Project Completion</span>
                <span className="text-sm font-medium">
                  {projects ? Math.round((completedProjects / (projects.length || 1)) * 100) : 0}%
                </span>
              </div>
              <Progress 
                value={projects ? (completedProjects / (projects.length || 1)) * 100 : 0} 
                className="h-2" 
              />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm">Task Efficiency</span>
                <span className="text-sm font-medium">92%</span>
              </div>
              <Progress value={92} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm">Resource Utilization</span>
                <span className="text-sm font-medium">78%</span>
              </div>
              <Progress value={78} className="h-2" />
            </div>
          </div>
        </Card>

        <Card className="p-6 glass-card">
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {projects && projects.slice(0, 4).map((project, index) => (
              <div key={project.id} className="flex justify-between items-center">
                <span className="text-sm">{project.name}</span>
                <span className="text-xs text-muted-foreground">
                  {new Date(project.created_at).toLocaleDateString()}
                </span>
              </div>
            ))}
            {(!projects || projects.length === 0) && (
              <div className="text-sm text-muted-foreground">No recent activity</div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

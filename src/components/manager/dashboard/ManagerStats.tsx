import { StatsCards } from "@/components/StatsCards";
import { Users, FileText, BarChart, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export const ManagerStats = () => {
  const stats = [
    {
      title: "Team Members",
      value: "12",
      description: "+2 this month",
      icon: Users,
    },
    {
      title: "Active Projects",
      value: "8",
      description: "3 due this week",
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
      value: "164h",
      description: "This month",
      icon: Clock,
    },
  ];

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
                <span className="text-sm font-medium">85%</span>
              </div>
              <Progress value={85} className="h-2" />
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
            {[
              { text: "New project assigned to Team A", time: "2h ago" },
              { text: "Performance review completed", time: "4h ago" },
              { text: "Monthly report generated", time: "6h ago" },
              { text: "Team meeting scheduled", time: "8h ago" },
            ].map((activity, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-sm">{activity.text}</span>
                <span className="text-xs text-muted-foreground">{activity.time}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
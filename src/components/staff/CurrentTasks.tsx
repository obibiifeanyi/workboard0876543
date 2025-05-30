
import { DashboardLayout } from "@/components/DashboardLayout";
import { TaskList } from "@/components/staff/TaskList";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const CurrentTasks = () => {
  const mockTasks = [
    {
      id: "1",
      title: "Network Infrastructure Review",
      description: "Review and assess current network infrastructure setup",
      status: "in_progress",
      priority: "high",
      due_date: "2024-03-20",
      created_at: "2024-03-15T10:00:00Z"
    },
    {
      id: "2", 
      title: "System Maintenance",
      description: "Perform routine system maintenance and updates",
      status: "pending",
      priority: "medium",
      due_date: "2024-03-22",
      created_at: "2024-03-15T11:00:00Z"
    }
  ];

  return (
    <Card className="glass-card border border-primary/20">
      <CardHeader>
        <CardTitle className="text-xl md:text-2xl">Current Tasks</CardTitle>
      </CardHeader>
      <CardContent>
        <TaskList tasks={mockTasks} />
      </CardContent>
    </Card>
  );
};

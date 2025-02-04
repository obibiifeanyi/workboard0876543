import { DashboardLayout } from "@/components/DashboardLayout";
import { TaskList } from "@/components/staff/TaskList";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const CurrentTasks = () => {
  const mockTasks = [
    {
      id: 1,
      task: "Network Infrastructure Review",
      deadline: "2024-03-20",
      status: "In Progress"
    },
    {
      id: 2,
      task: "System Maintenance",
      deadline: "2024-03-22",
      status: "Pending"
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
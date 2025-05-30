
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TaskList } from "@/components/staff/TaskList";

export const MyTasks = () => {
  const mockTasks = [
    {
      id: "1",
      title: "Daily System Check",
      description: "Perform daily system health checks and monitoring",
      status: "in_progress",
      priority: "medium",
      due_date: "2024-03-21",
      created_at: "2024-03-15T09:00:00Z"
    },
    {
      id: "2",
      title: "Report Generation", 
      description: "Generate weekly performance reports",
      status: "pending",
      priority: "low",
      due_date: "2024-03-23",
      created_at: "2024-03-15T10:30:00Z"
    }
  ];

  return (
    <Card className="glass-card border border-primary/20">
      <CardHeader>
        <CardTitle className="text-xl md:text-2xl">My Tasks</CardTitle>
      </CardHeader>
      <CardContent>
        <TaskList tasks={mockTasks} />
      </CardContent>
    </Card>
  );
};

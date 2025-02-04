import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TaskList } from "@/components/staff/TaskList";

export const MyTasks = () => {
  const mockTasks = [
    {
      id: 1,
      task: "Daily System Check",
      deadline: "2024-03-21",
      status: "In Progress"
    },
    {
      id: 2,
      task: "Report Generation",
      deadline: "2024-03-23",
      status: "Pending"
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
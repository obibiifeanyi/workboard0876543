import { DashboardLayout } from "@/components/DashboardLayout";
import { TaskList } from "@/components/staff/TaskList";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const CurrentTasks = () => {
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
    <DashboardLayout title="Current Tasks">
      <div className="space-y-6 p-4 md:p-6 max-w-7xl mx-auto animate-fade-in">
        <Card className="glass-card border border-primary/20">
          <CardHeader>
            <CardTitle className="text-xl md:text-2xl">Task Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <TaskList tasks={mockTasks} />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default CurrentTasks;
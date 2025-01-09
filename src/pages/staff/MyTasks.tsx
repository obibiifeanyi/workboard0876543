import { DashboardLayout } from "@/components/DashboardLayout";
import { TaskList } from "@/components/staff/TaskList";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const MyTasks = () => {
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
    <DashboardLayout title="My Tasks">
      <div className="space-y-6 p-4 md:p-6 max-w-7xl mx-auto animate-fade-in">
        <Card className="glass-card border border-primary/20">
          <CardHeader>
            <CardTitle className="text-xl md:text-2xl">My Assigned Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <TaskList tasks={mockTasks} />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default MyTasks;
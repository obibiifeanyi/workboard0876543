
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TaskList } from "@/components/staff/TaskList";

export const MyTasks = () => {
  return (
    <Card className="glass-card border border-primary/20">
      <CardHeader>
        <CardTitle className="text-xl md:text-2xl">My Tasks</CardTitle>
      </CardHeader>
      <CardContent>
        <TaskList />
      </CardContent>
    </Card>
  );
};

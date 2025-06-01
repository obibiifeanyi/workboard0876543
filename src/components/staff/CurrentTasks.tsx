
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TaskList } from "@/components/staff/TaskList";

export const CurrentTasks = () => {
  return (
    <Card className="glass-card border border-primary/20">
      <CardHeader>
        <CardTitle className="text-xl md:text-2xl">Current Tasks</CardTitle>
      </CardHeader>
      <CardContent>
        <TaskList />
      </CardContent>
    </Card>
  );
};

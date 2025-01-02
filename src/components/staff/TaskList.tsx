import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Task {
  id: number;
  task: string;
  deadline: string;
  status: string;
}

export const TaskList = ({ tasks }: { tasks: Task[] }) => {
  const { toast } = useToast();

  return (
    <div className="w-full overflow-hidden rounded-lg">
      <ScrollArea className="h-[400px] md:h-[500px]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40%]">Task</TableHead>
              <TableHead className="w-[25%]">Deadline</TableHead>
              <TableHead className="w-[20%]">Status</TableHead>
              <TableHead className="w-[15%]">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks.map((task) => (
              <TableRow key={task.id}>
                <TableCell className="font-medium">{task.task}</TableCell>
                <TableCell>{task.deadline}</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      task.status === "Completed"
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                        : task.status === "In Progress"
                        ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
                        : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
                    }`}
                  >
                    {task.status}
                  </span>
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hover:bg-primary/10"
                    onClick={() => {
                      toast({
                        title: "Task Updated",
                        description: `Task "${task.task}" status updated.`,
                      });
                    }}
                  >
                    Update
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  );
};
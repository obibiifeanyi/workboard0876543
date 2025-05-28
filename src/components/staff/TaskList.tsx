
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTaskManagement } from "@/hooks/useTaskManagement";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

interface Task {
  id: number;
  task: string;
  deadline: string;
  status: string;
}

interface TaskListProps {
  tasks?: Task[];
  showMyTasks?: boolean;
}

export const TaskList = ({ tasks, showMyTasks = false }: TaskListProps) => {
  const { toast } = useToast();
  const { myTasks, allTasks, isLoadingMyTasks, isLoadingAllTasks, updateTaskStatus } = useTaskManagement();
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [completionNotes, setCompletionNotes] = useState("");
  const [actualHours, setActualHours] = useState("");

  const tasksToShow = showMyTasks ? myTasks : allTasks;
  const isLoading = showMyTasks ? isLoadingMyTasks : isLoadingAllTasks;

  const handleStatusUpdate = async (taskId: string, newStatus: string) => {
    await updateTaskStatus.mutateAsync({
      taskId,
      status: newStatus,
      completionNotes: completionNotes || undefined,
      actualHours: actualHours ? parseFloat(actualHours) : undefined,
    });
    
    setSelectedTask(null);
    setCompletionNotes("");
    setActualHours("");
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100';
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100';
      case 'reviewed':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100';
      default:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100';
    }
  };

  if (isLoading) {
    return <div className="flex justify-center py-8">Loading tasks...</div>;
  }

  // Fallback to legacy tasks format if no database tasks
  const displayTasks = tasksToShow?.length ? tasksToShow : tasks;

  return (
    <div className="w-full overflow-hidden rounded-lg">
      <ScrollArea className="h-[400px] md:h-[500px]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[30%]">Task</TableHead>
              <TableHead className="w-[20%]">Due Date</TableHead>
              <TableHead className="w-[15%]">Priority</TableHead>
              <TableHead className="w-[15%]">Status</TableHead>
              <TableHead className="w-[20%]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayTasks?.map((task: any) => (
              <TableRow key={task.id}>
                <TableCell className="font-medium">
                  <div>
                    <div className="font-semibold">{task.title || task.task}</div>
                    {task.description && (
                      <div className="text-sm text-muted-foreground mt-1">{task.description}</div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  {task.due_date 
                    ? format(new Date(task.due_date), 'MMM dd, yyyy')
                    : task.deadline
                  }
                </TableCell>
                <TableCell>
                  {task.priority && (
                    <Badge className={getPriorityColor(task.priority)}>
                      {task.priority}
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  <Badge className={getStatusColor(task.status)}>
                    {task.status?.replace('_', ' ') || task.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    {task.status === 'pending' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleStatusUpdate(task.id, 'in_progress')}
                        disabled={updateTaskStatus.isPending}
                      >
                        Start
                      </Button>
                    )}
                    {task.status === 'in_progress' && (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedTask(task)}
                          >
                            Complete
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Complete Task</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="completion-notes">Completion Notes</Label>
                              <Textarea
                                id="completion-notes"
                                placeholder="Add any notes about task completion..."
                                value={completionNotes}
                                onChange={(e) => setCompletionNotes(e.target.value)}
                              />
                            </div>
                            <div>
                              <Label htmlFor="actual-hours">Actual Hours Worked</Label>
                              <Input
                                id="actual-hours"
                                type="number"
                                step="0.5"
                                placeholder="0.0"
                                value={actualHours}
                                onChange={(e) => setActualHours(e.target.value)}
                              />
                            </div>
                            <Button
                              onClick={() => handleStatusUpdate(task.id, 'completed')}
                              disabled={updateTaskStatus.isPending}
                              className="w-full"
                            >
                              {updateTaskStatus.isPending ? "Completing..." : "Mark Complete"}
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    )}
                    {!task.status || task.status === 'Pending' || task.status === 'In Progress' ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="hover:bg-primary/10"
                        onClick={() => {
                          toast({
                            title: "Task Updated",
                            description: `Task "${task.title || task.task}" status updated.`,
                          });
                        }}
                      >
                        Update
                      </Button>
                    ) : null}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  );
};


import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle, Clock, AlertCircle } from "lucide-react";

interface Task {
  id: string;
  title: string;
  description?: string;
  status: string;
  priority: string;
  due_date?: string;
  created_at: string;
}

interface TaskListProps {
  tasks: Task[];
}

export const TaskList = ({ tasks: propTasks }: TaskListProps) => {
  const [tasks, setTasks] = useState<Task[]>(propTasks);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Update tasks when prop changes
  useEffect(() => {
    setTasks(propTasks);
  }, [propTasks]);

  // Fetch fresh tasks if none provided
  useEffect(() => {
    if (propTasks.length === 0) {
      fetchTasks();
    }
  }, []);

  const fetchTasks = async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data, error } = await supabase
          .from('tasks')
          .select('*')
          .eq('assigned_to_id', user.id)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching tasks:', error);
          toast({
            title: "Error",
            description: "Failed to fetch tasks",
            variant: "destructive",
          });
        } else {
          setTasks(data || []);
        }
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateTaskStatus = async (taskId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ 
          status: newStatus,
          ...(newStatus === 'completed' ? { submitted_at: new Date().toISOString() } : {})
        })
        .eq('id', taskId);

      if (error) {
        console.error('Error updating task:', error);
        toast({
          title: "Error",
          description: "Failed to update task status",
          variant: "destructive",
        });
      } else {
        setTasks(prev => 
          prev.map(task => 
            task.id === taskId ? { ...task, status: newStatus } : task
          )
        );
        toast({
          title: "Success",
          description: `Task marked as ${newStatus}`,
        });
      }
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'in_progress':
        return <Clock className="h-4 w-4 text-blue-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100';
      case 'medium':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100';
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100';
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (tasks.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>My Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground">No tasks assigned to you yet.</p>
            <Button 
              variant="outline" 
              onClick={fetchTasks}
              className="mt-4"
            >
              Refresh Tasks
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">My Tasks ({tasks.length})</h3>
        <Button 
          variant="outline" 
          onClick={fetchTasks}
          size="sm"
        >
          Refresh
        </Button>
      </div>
      
      {tasks.map((task) => (
        <Card key={task.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  {getStatusIcon(task.status)}
                  <h4 className="font-medium">{task.title}</h4>
                </div>
                
                {task.description && (
                  <p className="text-sm text-muted-foreground mb-3">
                    {task.description}
                  </p>
                )}
                
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge className={getStatusColor(task.status)}>
                    {task.status.replace('_', ' ')}
                  </Badge>
                  <Badge className={getPriorityColor(task.priority)}>
                    {task.priority} priority
                  </Badge>
                  {task.due_date && (
                    <Badge variant="outline">
                      Due: {new Date(task.due_date).toLocaleDateString()}
                    </Badge>
                  )}
                </div>
              </div>
              
              <div className="flex flex-col gap-2 ml-4">
                {task.status === 'pending' && (
                  <Button 
                    size="sm" 
                    onClick={() => updateTaskStatus(task.id, 'in_progress')}
                  >
                    Start Task
                  </Button>
                )}
                {task.status === 'in_progress' && (
                  <Button 
                    size="sm" 
                    onClick={() => updateTaskStatus(task.id, 'completed')}
                  >
                    Complete
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};


import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'reviewed';
  priority: 'low' | 'medium' | 'high';
  due_date: string;
  assigned_to_id: string;
  created_by_id: string;
  project_id?: string;
  estimated_hours?: number;
  actual_hours?: number;
  completion_notes?: string;
  created_at: string;
  updated_at: string;
}

export const useTaskManagement = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: myTasks, isLoading: isLoadingMyTasks } = useQuery({
    queryKey: ['my-tasks'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('assigned_to_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Task[];
    },
  });

  const { data: allTasks, isLoading: isLoadingAllTasks } = useQuery({
    queryKey: ['all-tasks'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Task[];
    },
  });

  const updateTaskStatus = useMutation({
    mutationFn: async ({ taskId, status, completionNotes, actualHours }: {
      taskId: string;
      status: string;
      completionNotes?: string;
      actualHours?: number;
    }) => {
      const updateData: any = {
        status,
        updated_at: new Date().toISOString(),
      };

      if (completionNotes) updateData.completion_notes = completionNotes;
      if (actualHours) updateData.actual_hours = actualHours;
      if (status === 'completed') updateData.submitted_at = new Date().toISOString();

      const { error } = await supabase
        .from('tasks')
        .update(updateData)
        .eq('id', taskId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-tasks'] });
      queryClient.invalidateQueries({ queryKey: ['all-tasks'] });
      toast({
        title: "Task Updated",
        description: "Task status has been updated successfully.",
      });
    },
  });

  const createTask = useMutation({
    mutationFn: async (taskData: {
      title: string;
      description: string;
      assigned_to_id: string;
      due_date: string;
      priority: string;
      estimated_hours?: number;
      project_id?: string;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('tasks')
        .insert({
          ...taskData,
          created_by_id: user.id,
          status: 'pending',
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-tasks'] });
      queryClient.invalidateQueries({ queryKey: ['all-tasks'] });
      toast({
        title: "Task Created",
        description: "New task has been created successfully.",
      });
    },
  });

  return {
    myTasks,
    allTasks,
    isLoadingMyTasks,
    isLoadingAllTasks,
    updateTaskStatus,
    createTask,
  };
};

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Database } from '@/integrations/supabase/types/base';
import type { DepartmentRow, ProjectAssignmentRow } from '@/integrations/supabase/types/department';

export const useCoreTables = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const useDepartments = () => {
    return useQuery({
      queryKey: ['departments'],
      queryFn: async () => {
        const { data, error } = await supabase
          .from('departments')
          .select('*, profiles(full_name)');
        if (error) throw error;
        return data as DepartmentRow[];
      },
    });
  };

  const useCreateDepartment = () => {
    return useMutation({
      mutationFn: async (newDepartment: Database['public']['Tables']['departments']['Insert']) => {
        const { data, error } = await supabase
          .from('departments')
          .insert(newDepartment)
          .select()
          .single();
        if (error) throw error;
        return data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['departments'] });
        toast({
          title: 'Success',
          description: 'Department created successfully',
        });
      },
      onError: (error: Error) => {
        toast({
          title: 'Error',
          description: error.message,
          variant: 'destructive',
        });
      },
    });
  };

  const useProjectAssignments = () => {
    return useQuery({
      queryKey: ['project_assignments'],
      queryFn: async () => {
        const { data, error } = await supabase
          .from('project_assignments')
          .select(`
            id,
            project_id,
            staff_id,
            created_at,
            updated_at
          `);
        if (error) throw error;
        return data as ProjectAssignmentRow[];
      },
    });
  };

  const useCreateProjectAssignment = () => {
    return useMutation({
      mutationFn: async (newAssignment: Database['public']['Tables']['project_assignments']['Insert']) => {
        const { data, error } = await supabase
          .from('project_assignments')
          .insert(newAssignment)
          .select()
          .single();
        if (error) throw error;
        return data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['project_assignments'] });
        toast({
          title: 'Success',
          description: 'Project assignment created successfully',
        });
      },
      onError: (error: Error) => {
        toast({
          title: 'Error',
          description: error.message,
          variant: 'destructive',
        });
      },
    });
  };

  return {
    useDepartments,
    useCreateDepartment,
    useProjectAssignments,
    useCreateProjectAssignment,
  };
};
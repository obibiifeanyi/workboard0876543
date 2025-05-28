
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Database } from '@/integrations/supabase/types';

type DepartmentRow = Database['public']['Tables']['departments']['Row'];
type ProjectMemberRow = Database['public']['Tables']['project_members']['Row'];

export const useCoreTables = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const useDepartments = () => {
    return useQuery({
      queryKey: ['departments'],
      queryFn: async () => {
        const { data, error } = await supabase
          .from('departments')
          .select('*');
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

  const useProjectMembers = () => {
    return useQuery({
      queryKey: ['project_members'],
      queryFn: async () => {
        const { data, error } = await supabase
          .from('project_members')
          .select('*');
        if (error) throw error;
        return data as ProjectMemberRow[];
      },
    });
  };

  const useCreateProjectMember = () => {
    return useMutation({
      mutationFn: async (newMember: Database['public']['Tables']['project_members']['Insert']) => {
        const { data, error } = await supabase
          .from('project_members')
          .insert(newMember)
          .select()
          .single();
        if (error) throw error;
        return data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['project_members'] });
        toast({
          title: 'Success',
          description: 'Project member added successfully',
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
    useProjectMembers,
    useCreateProjectMember,
  };
};

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Database } from '@/integrations/supabase/types/base';
import type { DepartmentRow, ProjectAssignmentRow, DocumentArchiveRow } from '@/integrations/supabase/types/department';

export const useCoreTables = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Departments
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

  // Project Assignments
  const useProjectAssignments = () => {
    return useQuery({
      queryKey: ['project_assignments'],
      queryFn: async () => {
        const { data, error } = await supabase
          .from('projects')
          .select(`
            *,
            project_assignments (
              id,
              staff_id,
              created_at,
              updated_at
            ),
            profiles:staff_id (full_name)
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

  // Document Archive
  const useDocuments = () => {
    return useQuery({
      queryKey: ['documents'],
      queryFn: async () => {
        const { data, error } = await supabase
          .from('documents')
          .select(`
            *,
            departments (name),
            profiles:uploaded_by (full_name)
          `);
        if (error) throw error;
        return data as DocumentArchiveRow[];
      },
    });
  };

  const useUploadDocument = () => {
    return useMutation({
      mutationFn: async ({
        file,
        metadata,
      }: {
        file: File;
        metadata: Omit<Database['public']['Tables']['document_archive']['Insert'], 'file_path' | 'file_size' | 'file_type'>;
      }) => {
        // Upload file to storage
        const { data: fileData, error: uploadError } = await supabase.storage
          .from('documents')
          .upload(`${Date.now()}-${file.name}`, file);
        
        if (uploadError) throw uploadError;

        // Create document record
        const { data, error } = await supabase
          .from('document_archive')
          .insert({
            ...metadata,
            file_path: fileData.path,
            file_type: file.type,
            file_size: file.size,
          })
          .select()
          .single();
        
        if (error) throw error;
        return data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['documents'] });
        toast({
          title: 'Success',
          description: 'Document uploaded successfully',
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
    useDocuments,
    useUploadDocument,
  };
};

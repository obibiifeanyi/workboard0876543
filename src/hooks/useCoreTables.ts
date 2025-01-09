import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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
        return data;
      },
    });
  };

  const useCreateDepartment = () => {
    return useMutation({
      mutationFn: async (newDepartment: {
        name: string;
        description?: string;
        manager_id?: string;
      }) => {
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
      onError: (error) => {
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
          .from('project_assignments')
          .select(`
            *,
            departments (name),
            profiles (full_name)
          `);
        if (error) throw error;
        return data;
      },
    });
  };

  const useCreateProjectAssignment = () => {
    return useMutation({
      mutationFn: async (newAssignment: {
        project_name: string;
        description?: string;
        assigned_to: string;
        department_id: string;
        start_date: string;
        end_date?: string;
        priority?: 'low' | 'medium' | 'high';
      }) => {
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
      onError: (error) => {
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
          .from('document_archive')
          .select(`
            *,
            departments (name),
            profiles (full_name)
          `);
        if (error) throw error;
        return data;
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
        metadata: {
          title: string;
          description?: string;
          department_id?: string;
          tags?: string[];
        };
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
            uploaded_by: (await supabase.auth.getUser()).data.user?.id,
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
      onError: (error) => {
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
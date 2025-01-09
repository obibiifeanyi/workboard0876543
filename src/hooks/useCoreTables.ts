import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Department, ProjectAssignment, DocumentArchive } from '@/types/department';

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
        return data as Department[];
      },
    });
  };

  const useCreateDepartment = () => {
    return useMutation({
      mutationFn: async (newDepartment: Omit<Department, 'id' | 'created_at' | 'updated_at'>) => {
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
      mutationFn: async (newAssignment: Omit<ProjectAssignment, 'id' | 'created_at' | 'updated_at'>) => {
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
          .from('document_archive')
          .select(`
            *,
            departments (name),
            profiles (full_name)
          `);
        if (error) throw error;
        return data as DocumentArchive[];
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
        metadata: Omit<DocumentArchive, 'id' | 'created_at' | 'updated_at' | 'file_path' | 'file_size' | 'file_type'>;
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

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useSystemData = () => {
  // Fetch all profiles for context
  const useProfiles = () => {
    return useQuery({
      queryKey: ['profiles'],
      queryFn: async () => {
        const { data, error } = await supabase
          .from('profiles')
          .select('*');
        
        if (error) {
          console.error('Error fetching profiles:', error);
          return [];
        }
        return data || [];
      },
    });
  };

  // Fetch projects for context
  const useProjects = () => {
    return useQuery({
      queryKey: ['projects'],
      queryFn: async () => {
        const { data, error } = await supabase
          .from('projects')
          .select('*');
        
        if (error) {
          console.error('Error fetching projects:', error);
          return [];
        }
        return data || [];
      },
    });
  };

  // Fetch tasks for context
  const useTasks = () => {
    return useQuery({
      queryKey: ['tasks'],
      queryFn: async () => {
        const { data, error } = await supabase
          .from('tasks')
          .select('*');
        
        if (error) {
          console.error('Error fetching tasks:', error);
          return [];
        }
        return data || [];
      },
    });
  };

  // Fetch memos for context
  const useMemos = () => {
    return useQuery({
      queryKey: ['memos'],
      queryFn: async () => {
        const { data, error } = await supabase
          .from('memos')
          .select('*');
        
        if (error) {
          console.error('Error fetching memos:', error);
          return [];
        }
        return data || [];
      },
    });
  };

  // Fetch departments for context
  const useDepartments = () => {
    return useQuery({
      queryKey: ['departments'],
      queryFn: async () => {
        const { data, error } = await supabase
          .from('departments')
          .select('*');
        
        if (error) {
          console.error('Error fetching departments:', error);
          return [];
        }
        return data || [];
      },
    });
  };

  // Fetch time logs for context
  const useTimeLogs = () => {
    return useQuery({
      queryKey: ['time_logs'],
      queryFn: async () => {
        const { data, error } = await supabase
          .from('time_logs')
          .select('*');
        
        if (error) {
          console.error('Error fetching time_logs:', error);
          return [];
        }
        return data || [];
      },
    });
  };

  return {
    useProfiles,
    useProjects,
    useTasks,
    useMemos,
    useDepartments,
    useTimeLogs,
  };
};

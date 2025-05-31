
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
        
        if (error) throw error;
        return data;
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
        
        if (error) throw error;
        return data;
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
        
        if (error) throw error;
        return data;
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
        
        if (error) throw error;
        return data;
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
        
        if (error) throw error;
        return data;
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
        
        if (error) throw error;
        return data;
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


import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useManagerOperations = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get current user profile
  const { data: currentUser } = useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');
      
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      return profile;
    },
  });

  // Get managed departments
  const { data: managedDepartments, isLoading: isLoadingDepartments } = useQuery({
    queryKey: ['managedDepartments', currentUser?.id],
    queryFn: async () => {
      if (!currentUser?.id) return [];
      
      const { data, error } = await supabase
        .from('departments')
        .select('*')
        .eq('manager_id', currentUser.id);
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!currentUser?.id,
  });

  // Get team members from managed departments
  const { data: teamMembers, isLoading: isLoadingTeamMembers } = useQuery({
    queryKey: ['teamMembers', managedDepartments],
    queryFn: async () => {
      if (!managedDepartments?.length) return [];
      
      const departmentIds = managedDepartments.map(dept => dept.id);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .in('department_id', departmentIds);
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!managedDepartments?.length,
  });

  // Get projects
  const { data: projects, isLoading: isLoadingProjects } = useQuery({
    queryKey: ['managerProjects', currentUser?.id],
    queryFn: async () => {
      if (!currentUser?.id) return [];
      
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          project_members (
            id,
            user_id,
            role,
            profiles (
              id,
              full_name,
              email
            )
          )
        `)
        .eq('manager_id', currentUser.id);
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!currentUser?.id,
  });

  // Get tasks
  const { data: tasks, isLoading: isLoadingTasks } = useQuery({
    queryKey: ['managerTasks', currentUser?.id],
    queryFn: async () => {
      if (!currentUser?.id) return [];
      
      const { data, error } = await supabase
        .from('tasks')
        .select(`
          *,
          profiles!tasks_assigned_to_id_fkey (
            id,
            full_name,
            email
          ),
          projects (
            id,
            name
          ),
          departments (
            id,
            name
          )
        `)
        .eq('created_by_id', currentUser.id);
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!currentUser?.id,
  });

  // Create project mutation
  const createProject = useMutation({
    mutationFn: async (projectData: any) => {
      const { data, error } = await supabase
        .from('projects')
        .insert({
          ...projectData,
          manager_id: currentUser?.id,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['managerProjects'] });
      toast({
        title: "Success",
        description: "Project created successfully",
      });
    },
    onError: (error) => {
      console.error('Error creating project:', error);
      toast({
        title: "Error",
        description: "Failed to create project",
        variant: "destructive",
      });
    },
  });

  // Add project member mutation
  const addProjectMember = useMutation({
    mutationFn: async ({ projectId, userId, role }: { projectId: string; userId: string; role: string }) => {
      const { data, error } = await supabase
        .from('project_members')
        .insert({
          project_id: projectId,
          user_id: userId,
          role: role,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['managerProjects'] });
      toast({
        title: "Success",
        description: "Team member added successfully",
      });
    },
    onError: (error) => {
      console.error('Error adding team member:', error);
      toast({
        title: "Error",
        description: "Failed to add team member",
        variant: "destructive",
      });
    },
  });

  // Create task mutation
  const createTask = useMutation({
    mutationFn: async (taskData: any) => {
      const { data, error } = await supabase
        .from('tasks')
        .insert({
          ...taskData,
          created_by_id: currentUser?.id,
          project_id: taskData.project_id === "none" ? null : taskData.project_id,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['managerTasks'] });
      toast({
        title: "Success",
        description: "Task created successfully",
      });
    },
    onError: (error) => {
      console.error('Error creating task:', error);
      toast({
        title: "Error",
        description: "Failed to create task",
        variant: "destructive",
      });
    },
  });

  return {
    currentUser,
    managedDepartments,
    teamMembers,
    projects,
    tasks,
    isLoadingDepartments,
    isLoadingTeamMembers,
    isLoadingProjects,
    isLoadingTasks,
    createProject,
    addProjectMember,
    createTask,
  };
};

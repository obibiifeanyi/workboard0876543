import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface TeamMember {
  id: string;
  full_name: string | null;
  email: string;
  role: string;
  department_id: string | null;
  status: string | null;
  created_at: string;
  updated_at: string;
}

export interface Department {
  id: string;
  name: string;
  description: string | null;
  manager_id: string | null;
  employee_count?: number;
  created_at: string;
  updated_at: string;
  manager?: {
    full_name: string;
  };
}

export interface ProjectWithMembers {
  id: string;
  name: string;
  description: string | null;
  department_id: string;
  manager_id: string | null;
  status: string;
  priority?: string;
  start_date: string | null;
  end_date: string | null;
  budget: number;
  project_members: Array<{
    id: string;
    user_id: string;
    role: string;
    profiles: {
      full_name: string;
      email: string;
    };
  }>;
}

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  assigned_to_id: string | null;
  created_by_id: string | null;
  project_id: string | null;
  department_id: string | null;
  due_date: string | null;
  created_at: string;
  updated_at: string;
  profiles?: {
    id: string;
    full_name: string;
    email: string;
  };
  projects?: {
    id: string;
    name: string;
  };
  departments?: {
    id: string;
    name: string;
  };
}

interface Memo {
  id: string;
  title: string;
  content: string;
  sender_id: string;
  department_id: string;
  created_at: string;
  status: string;
}

interface Report {
  id: string;
  title: string;
  content: string;
  user_id: string;
  department_id: string;
  created_at: string;
  status: string;
}

export const useManagerOperations = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Get current user's managed department
  const { data: currentUser } = useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  // Get managed departments
  const { data: managedDepartments, isLoading: isLoadingManagedDepartments } = useQuery({
    queryKey: ["managedDepartments"],
    queryFn: async () => {
      if (!currentUser?.id) return [];

      const { data, error } = await supabase
        .from("departments")
        .select(`
          *,
          profiles!manager_id(full_name)
        `)
        .eq("manager_id", currentUser.id);

      if (error) throw error;
      return data as Department[];
    },
    enabled: !!currentUser,
  });

  // Get team members from managed departments
  const { data: teamMembers, isLoading: isLoadingTeam } = useQuery({
    queryKey: ["teamMembers"],
    queryFn: async () => {
      if (!managedDepartments?.length) return [];

      const departmentIds = managedDepartments.map(d => d.id);
      const { data, error } = await supabase
        .from("profiles")
        .select(`
          id,
          full_name,
          email,
          role,
          department_id,
          status,
          created_at,
          updated_at
        `)
        .in("department_id", departmentIds);

      if (error) throw error;
      return data as TeamMember[];
    },
    enabled: !!managedDepartments?.length,
  });

  // Get projects from managed departments
  const { data: projects, isLoading: isLoadingProjects } = useQuery({
    queryKey: ["managerProjects"],
    queryFn: async () => {
      if (!managedDepartments?.length) return [];

      const departmentIds = managedDepartments.map(d => d.id);
      const { data, error } = await supabase
        .from("projects")
        .select(`
          *,
          project_members(
            id,
            user_id,
            role,
            profiles(full_name, email)
          )
        `)
        .in("department_id", departmentIds);

      if (error) throw error;
      return data as ProjectWithMembers[];
    },
    enabled: !!managedDepartments?.length,
  });

  // Get tasks
  const { data: tasks, isLoading: isLoadingTasks } = useQuery({
    queryKey: ["managerTasks", currentUser?.id],
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
      return data as Task[];
    },
    enabled: !!currentUser?.id,
  });

  // Get manager's departments
  const { data: departments, isLoading: isLoadingDepartments } = useQuery({
    queryKey: ['managerDepartments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .rpc('get_manager_departments', {
          p_manager_id: (await supabase.auth.getUser()).data.user?.id
        });

      if (error) throw error;
      return data as Department[];
    }
  });

  // Get department memos
  const { data: memos, isLoading: isLoadingMemos } = useQuery({
    queryKey: ['departmentMemos'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('memos')
        .select('*')
        .in('department_id', departments?.map(d => d.department_id) || [])
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Memo[];
    },
    enabled: !!departments
  });

  // Get department reports
  const { data: reports, isLoading: isLoadingReports } = useQuery({
    queryKey: ['departmentReports'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .in('department_id', departments?.map(d => d.department_id) || [])
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Report[];
    },
    enabled: !!departments
  });

  // Create project mutation
  const createProject = useMutation({
    mutationFn: async (projectData: {
      name: string;
      description?: string;
      department_id: string;
      status?: string;
      start_date?: string;
      end_date?: string;
      budget?: number;
    }) => {
      const { error } = await supabase.from("projects").insert({
        name: projectData.name,
        description: projectData.description || "",
        department_id: projectData.department_id,
        manager_id: currentUser?.id,
        status: projectData.status || "planning",
        start_date: projectData.start_date,
        end_date: projectData.end_date,
        budget: projectData.budget || 0,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["managerProjects"] });
      toast({
        title: "Success",
        description: "Project created successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create project",
        variant: "destructive",
      });
    },
  });

  // Add team member to project
  const addProjectMember = useMutation({
    mutationFn: async ({ projectId, userId, role }: { projectId: string; userId: string; role: string }) => {
      const { error } = await supabase.from("project_members").insert({
        project_id: projectId,
        user_id: userId,
        role,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["managerProjects"] });
      toast({
        title: "Success",
        description: "Team member added to project",
      });
    },
  });

  // Remove team member from project
  const removeProjectMember = useMutation({
    mutationFn: async ({ projectId, userId }: { projectId: string; userId: string }) => {
      const { error } = await supabase
        .from("project_members")
        .delete()
        .eq("project_id", projectId)
        .eq("user_id", userId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["managerProjects"] });
      toast({
        title: "Success",
        description: "Team member removed from project",
      });
    },
  });

  // Create task mutation
  const createTask = useMutation({
    mutationFn: async (taskData: {
      title: string;
      description?: string;
      assigned_to_id: string;
      project_id?: string;
      department_id?: string;
      due_date?: string;
      priority: string;
    }) => {
      const { error } = await supabase.from("tasks").insert({
        ...taskData,
        created_by_id: currentUser?.id,
        status: "pending",
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["managerTasks"] });
      toast({
        title: "Success",
        description: "Task assigned successfully",
      });
    },
  });

  // Update memo status
  const updateMemoStatus = useMutation({
    mutationFn: async ({ memoId, status }: { memoId: string; status: string }) => {
      const { error } = await supabase
        .from('memos')
        .update({ status })
        .eq('id', memoId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departmentMemos'] });
      toast({
        title: "Success",
        description: "Memo status updated successfully",
      });
    },
    onError: (error) => {
      console.error('Error updating memo status:', error);
      toast({
        title: "Error",
        description: "Failed to update memo status",
        variant: "destructive",
      });
    }
  });

  // Update report status
  const updateReportStatus = useMutation({
    mutationFn: async ({ reportId, status }: { reportId: string; status: string }) => {
      const { error } = await supabase
        .from('reports')
        .update({ status })
        .eq('id', reportId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departmentReports'] });
      toast({
        title: "Success",
        description: "Report status updated successfully",
      });
    },
    onError: (error) => {
      console.error('Error updating report status:', error);
      toast({
        title: "Error",
        description: "Failed to update report status",
        variant: "destructive",
      });
    }
  });

  return {
    currentUser,
    managedDepartments,
    teamMembers,
    projects,
    tasks,
    isLoadingManagedDepartments,
    isLoadingTeam,
    isLoadingTeamMembers: isLoadingTeam,
    isLoadingProjects,
    isLoadingTasks,
    createProject,
    addProjectMember,
    removeProjectMember,
    createTask,
    departments,
    memos,
    reports,
    isLoadingMemos,
    isLoadingReports,
    updateMemoStatus,
    updateReportStatus
  };
};

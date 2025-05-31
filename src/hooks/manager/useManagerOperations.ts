
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { TeamMember, ProjectWithMembers, Department } from "@/types/supabase/manager";
import { useToast } from "@/hooks/use-toast";

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
  const { data: managedDepartments, isLoading: isLoadingDepartments } = useQuery({
    queryKey: ["managedDepartments"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("departments")
        .select(`
          *,
          profiles!manager_id(full_name)
        `)
        .eq("manager_id", currentUser?.id);

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
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast({
        title: "Success",
        description: "Task assigned successfully",
      });
    },
  });

  return {
    currentUser,
    managedDepartments,
    teamMembers,
    projects,
    isLoadingDepartments,
    isLoadingTeam,
    isLoadingProjects,
    createProject,
    addProjectMember,
    removeProjectMember,
    createTask,
  };
};

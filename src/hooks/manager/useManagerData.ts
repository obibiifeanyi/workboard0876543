
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useManagerData = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch team members
  const { data: teamMembers, isLoading: isLoadingTeam } = useQuery({
    queryKey: ["team-members"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, avatar_url, role, email, department_id, created_at")
        .neq("id", user.id);

      if (error) throw error;
      return data;
    },
  });

  // Fetch projects
  const { data: projects, isLoading: isLoadingProjects } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select(`
          *,
          project_assignments(
            id,
            staff_id,
            profiles(full_name)
          )
        `);

      if (error) throw error;
      return data;
    },
  });

  // Fetch time logs
  const { data: timeLogs, isLoading: isLoadingTimeLogs } = useQuery({
    queryKey: ["time-logs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("time_logs")
        .select(`
          *,
          profiles(full_name)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  // Fetch leave requests
  const { data: leaveRequests, isLoading: isLoadingLeave } = useQuery({
    queryKey: ["leave-requests"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("leave_requests")
        .select(`
          *,
          profiles(full_name)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  // Create project mutation
  const createProject = useMutation({
    mutationFn: async (projectData: {
      name: string;
      description: string;
      department_id?: string;
      start_date?: string;
      end_date?: string;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("projects")
        .insert([{
          ...projectData,
          manager_id: user.id,
          status: 'planning'
        }]);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
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

  return {
    teamMembers,
    projects,
    timeLogs,
    leaveRequests,
    isLoadingTeam,
    isLoadingProjects,
    isLoadingTimeLogs,
    isLoadingLeave,
    createProject,
  };
};

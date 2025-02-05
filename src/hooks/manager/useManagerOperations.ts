import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { TeamMember } from "@/types/manager";
import { useToast } from "@/hooks/use-toast";

interface ProjectAssignment {
  id: string;
  project_id: string;
  staff_id: string;
  profiles?: {
    full_name: string;
  };
}

interface Project {
  id: string;
  title: string;
  description?: string;
  department_id: string;
  start_date?: string;
  end_date?: string;
  status?: string;
  project_assignments?: ProjectAssignment[];
}

export const useManagerOperations = (departmentId: string) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: teamMembers, isLoading: isLoadingTeam } = useQuery({
    queryKey: ["team", departmentId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*, departments(name)")
        .eq("department_id", departmentId);

      if (error) throw error;
      return data.map((profile) => ({
        ...profile,
        department: profile.departments?.name,
      })) as TeamMember[];
    },
  });

  const { data: projects, isLoading: isLoadingProjects } = useQuery({
    queryKey: ["projects", departmentId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select(`
          *,
          project_assignments (
            id,
            project_id,
            staff_id,
            profiles:staff_id (
              full_name
            )
          )
        `)
        .eq("department_id", departmentId);

      if (error) throw error;
      
      return (data || []) as Project[];
    },
  });

  const createProject = useMutation({
    mutationFn: async (projectData: {
      title: string;
      description?: string;
      department_id: string;
      start_date?: string;
      end_date?: string;
      status?: string;
    }) => {
      const { error } = await supabase.from("projects").insert(projectData);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast({
        title: "Success",
        description: "Project created successfully",
      });
    },
  });

  const updateProject = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<Project>;
    }) => {
      const { error } = await supabase
        .from("projects")
        .update(data)
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast({
        title: "Success",
        description: "Project updated successfully",
      });
    },
  });

  return {
    teamMembers,
    projects,
    isLoadingTeam,
    isLoadingProjects,
    createProject,
    updateProject,
  };
};
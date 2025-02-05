import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { TeamMember } from "@/types/manager";
import { useToast } from "@/hooks/use-toast";

// Define base types to avoid recursion
interface BaseProject {
  id: string;
  title: string;
  description: string | null;
  status: string | null;
  start_date: string | null;
  end_date: string | null;
  department_id: string | null;
  client_name: string | null;
  budget: number | null;
  location: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

interface ProjectAssignment {
  id: string;
  project_id: string;
  staff_id: string;
  staff_name: string;
}

interface Project extends BaseProject {
  project_assignments: ProjectAssignment[];
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
      return (data || []).map((profile) => ({
        ...profile,
        department: profile.departments?.name,
      })) as TeamMember[];
    },
  });

  const { data: projects, isLoading: isLoadingProjects } = useQuery({
    queryKey: ["projects", departmentId],
    queryFn: async () => {
      const { data: projectsData, error } = await supabase
        .from("projects")
        .select(`
          *,
          project_assignments (
            id,
            project_id,
            staff_id,
            profiles (
              id,
              full_name
            )
          )
        `)
        .eq("department_id", departmentId);

      if (error) throw error;

      return (projectsData || []).map((project) => ({
        ...project,
        project_assignments: project.project_assignments?.map(assignment => ({
          id: assignment.id,
          project_id: assignment.project_id,
          staff_id: assignment.staff_id,
          staff_name: assignment.profiles?.full_name || ''
        })) || []
      })) as Project[];
    },
  });

  const createProject = useMutation({
    mutationFn: async (projectData: Omit<BaseProject, 'id' | 'created_at' | 'updated_at'>) => {
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
      data: Partial<Omit<BaseProject, 'id' | 'created_at' | 'updated_at'>>;
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
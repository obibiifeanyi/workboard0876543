
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { TeamMember, ProjectWithAssignments } from "@/types/supabase/manager";
import { useToast } from "@/hooks/use-toast";

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
      const { data, error } = await supabase
        .from("projects")
        .select(`
          id,
          name,
          description,
          status,
          start_date,
          end_date,
          department_id,
          budget
        `)
        .eq("department_id", departmentId);

      if (error) throw error;
      
      return (data || []).map(project => ({
        id: project.id,
        title: project.name,
        description: project.description,
        status: project.status,
        start_date: project.start_date,
        end_date: project.end_date,
        department_id: project.department_id,
        project_assignments: []
      })) as ProjectWithAssignments[];
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
      const insertData = {
        name: projectData.title,
        description: projectData.description || '',
        department_id: projectData.department_id,
        start_date: projectData.start_date,
        end_date: projectData.end_date,
        status: projectData.status || 'planning',
      };

      const { error } = await supabase.from("projects").insert(insertData);
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
      data: Partial<ProjectWithAssignments>;
    }) => {
      const updateData = {
        name: data.title,
        description: data.description,
        status: data.status,
        start_date: data.start_date,
        end_date: data.end_date,
      };

      const { error } = await supabase
        .from("projects")
        .update(updateData)
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

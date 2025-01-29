import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { ProjectWithAssignments, TeamMember, ProjectAssignmentInsert } from "@/types/supabase/manager";
import { useToast } from "@/hooks/use-toast";

export const useManagerOperations = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const useTeamMembers = (departmentId: string) => {
    return useQuery({
      queryKey: ["team-members", departmentId],
      queryFn: async () => {
        const { data, error } = await supabase
          .from("profiles")
          .select(`
            *,
            tasks (*)
          `)
          .eq("department", departmentId);

        if (error) throw error;
        return data as TeamMember[];
      },
    });
  };

  const useProjects = (departmentId: string) => {
    return useQuery({
      queryKey: ["projects", departmentId],
      queryFn: async () => {
        const { data, error } = await supabase
          .from("project_assignments")
          .select(`
            *,
            profiles (*)
          `)
          .eq("department_id", departmentId);

        if (error) throw error;
        return data as ProjectWithAssignments[];
      },
    });
  };

  const createProject = useMutation({
    mutationFn: async (projectData: ProjectAssignmentInsert) => {
      const { error } = await supabase
        .from("project_assignments")
        .insert(projectData);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast({
        title: "Project Created",
        description: "The project has been successfully created.",
      });
    },
  });

  const updateProject = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<ProjectWithAssignments> }) => {
      const updateData = {
        project_name: data.project_name,
        description: data.description,
        status: data.status,
        priority: data.priority,
        assigned_to: data.assigned_to,
        end_date: data.end_date,
      };

      const { error } = await supabase
        .from("project_assignments")
        .update(updateData)
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast({
        title: "Project Updated",
        description: "The project has been successfully updated.",
      });
    },
  });

  return {
    useTeamMembers,
    useProjects,
    createProject,
    updateProject,
  };
};
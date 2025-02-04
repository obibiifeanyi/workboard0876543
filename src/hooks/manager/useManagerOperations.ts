import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { ProjectWithAssignments, TeamMember } from "@/types/supabase/manager";
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
          .select("*, departments!inner(name)")
          .eq("department_id", departmentId);

        if (error) throw error;
        return data.map((profile) => ({
          ...profile,
          department: profile.departments?.name,
        })) as TeamMember[];
      },
    });
  };

  const useProjects = (departmentId: string) => {
    return useQuery({
      queryKey: ["projects", departmentId],
      queryFn: async () => {
        const { data, error } = await supabase
          .from("projects")
          .select(
            `*,
            project_assignments (
              id,
              staff_id,
              profiles!project_assignments_staff_id_fkey (full_name)
            )`
          )
          .eq("department_id", departmentId);

        if (error) throw error;
        return data as unknown as ProjectWithAssignments[];
      },
    });
  };

  const createProject = useMutation({
    mutationFn: async (projectData: {
      title: string;
      description: string;
      client_name?: string;
      budget?: number;
      location?: string;
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
        title: "Project Created",
        description: "The project has been successfully created.",
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
        title: data.title,
        description: data.description,
        client_name: data.client_name,
        budget: data.budget,
        location: data.location,
        start_date: data.start_date,
        end_date: data.end_date,
        status: data.status,
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
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { TeamMember, ProjectWithAssignments, TelecomSiteWithManager } from "@/types/supabase/manager";
import { useToast } from "@/hooks/use-toast";

export const useManagerOperations = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const useTeamMembers = (departmentId?: string) => {
    return useQuery({
      queryKey: ["team-members", departmentId],
      queryFn: async () => {
        const query = supabase
          .from("profiles")
          .select(`
            *,
            tasks(*)
          `);

        if (departmentId) {
          query.eq("department_id", departmentId);
        }

        const { data, error } = await query;
        if (error) throw error;
        return data as TeamMember[];
      },
      enabled: !!departmentId,
    });
  };

  const useProjects = () => {
    return useQuery({
      queryKey: ["projects"],
      queryFn: async () => {
        const { data, error } = await supabase
          .from("project_assignments")
          .select(`
            *,
            profiles(full_name),
            departments(name)
          `);

        if (error) throw error;
        return data as ProjectWithAssignments[];
      },
    });
  };

  const useTelecomSites = () => {
    return useQuery({
      queryKey: ["telecom-sites"],
      queryFn: async () => {
        const { data, error } = await supabase
          .from("telecom_sites")
          .select(`
            *,
            profiles(full_name),
            ct_power_reports(*)
          `);

        if (error) throw error;
        return data as TelecomSiteWithManager[];
      },
    });
  };

  const assignProject = useMutation({
    mutationFn: async (data: Partial<ProjectWithAssignments>) => {
      const { error } = await supabase
        .from("project_assignments")
        .insert(data);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast({
        title: "Project Assigned",
        description: "The project has been successfully assigned.",
      });
    },
  });

  return {
    useTeamMembers,
    useProjects,
    useTelecomSites,
    assignProject,
  };
};
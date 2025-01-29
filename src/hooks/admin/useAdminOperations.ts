import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { AdminDashboardStats, SystemActivity, DepartmentWithManager } from "@/types/supabase/admin";
import { useToast } from "@/hooks/use-toast";

export const useAdminOperations = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const useSystemActivities = () => {
    return useQuery({
      queryKey: ["system-activities"],
      queryFn: async () => {
        const { data, error } = await supabase
          .from("system_activities")
          .select(`
            *,
            user:profiles(full_name)
          `)
          .order("created_at", { ascending: false });

        if (error) throw error;
        return data as SystemActivity[];
      },
    });
  };

  const useDepartments = () => {
    return useQuery({
      queryKey: ["departments"],
      queryFn: async () => {
        const { data, error } = await supabase
          .from("departments")
          .select(`
            *,
            profiles(full_name)
          `);

        if (error) throw error;
        return data as DepartmentWithManager[];
      },
    });
  };

  const useAdminStats = () => {
    return useQuery({
      queryKey: ["admin-stats"],
      queryFn: async () => {
        const stats: AdminDashboardStats = {
          totalUsers: 0,
          activeUsers: 0,
          pendingTasks: 0,
          completedTasks: 0,
        };

        // Fetch total users
        const { count: totalUsers } = await supabase
          .from("profiles")
          .select("*", { count: "exact" });

        // Fetch pending tasks
        const { count: pendingTasks } = await supabase
          .from("tasks")
          .select("*", { count: "exact" })
          .eq("status", "pending");

        // Fetch completed tasks
        const { count: completedTasks } = await supabase
          .from("tasks")
          .select("*", { count: "exact" })
          .eq("status", "completed");

        stats.totalUsers = totalUsers || 0;
        stats.pendingTasks = pendingTasks || 0;
        stats.completedTasks = completedTasks || 0;

        return stats;
      },
    });
  };

  const updateDepartment = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<DepartmentWithManager> }) => {
      const { error } = await supabase
        .from("departments")
        .update(data)
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
      toast({
        title: "Department Updated",
        description: "The department has been successfully updated.",
      });
    },
  });

  return {
    useSystemActivities,
    useDepartments,
    useAdminStats,
    updateDepartment,
  };
};

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { AdminDashboardStats, DepartmentWithManager } from "@/types/supabase/admin";
import { useToast } from "@/hooks/use-toast";

export const useAdminOperations = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const useSystemActivities = () => {
    return useQuery({
      queryKey: ["system-activities"],
      queryFn: async () => {
        const { data, error } = await supabase
          .from('system_activities')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(50);

        if (error) {
          console.error('Error fetching system activities:', error);
          // Fallback to existing data approach
          const [memosRes, invoicesRes, reportsRes, tasksRes] = await Promise.all([
            supabase.from('memos').select('id, title, created_at, created_by').order('created_at', { ascending: false }).limit(10),
            supabase.from('accounts_invoices').select('id, invoice_number, vendor_name, created_at, created_by').order('created_at', { ascending: false }).limit(10),
            supabase.from('ct_power_reports').select('id, site_id, status, created_at, created_by').order('created_at', { ascending: false }).limit(10),
            supabase.from('tasks').select('id, title, status, created_at, created_by_id').order('created_at', { ascending: false }).limit(10)
          ]);

          const activities = [];
          
          if (memosRes.data) {
            memosRes.data.forEach(memo => {
              activities.push({
                id: memo.id,
                type: 'memo',
                description: `Memo created: ${memo.title}`,
                user_id: memo.created_by,
                created_at: memo.created_at,
                metadata: null
              });
            });
          }

          if (invoicesRes.data) {
            invoicesRes.data.forEach(invoice => {
              activities.push({
                id: invoice.id,
                type: 'invoice',
                description: `Invoice ${invoice.invoice_number} for ${invoice.vendor_name}`,
                user_id: invoice.created_by,
                created_at: invoice.created_at,
                metadata: null
              });
            });
          }

          if (reportsRes.data) {
            reportsRes.data.forEach(report => {
              activities.push({
                id: report.id,
                type: 'report',
                description: `Site report for ${report.site_id}`,
                user_id: report.created_by,
                created_at: report.created_at,
                metadata: null
              });
            });
          }

          if (tasksRes.data) {
            tasksRes.data.forEach(task => {
              activities.push({
                id: task.id,
                type: 'task',
                description: `Task ${task.status}: ${task.title}`,
                user_id: task.created_by_id,
                created_at: task.created_at,
                metadata: null
              });
            });
          }

          return activities.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        }

        return data || [];
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
            id,
            name,
            description,
            manager_id,
            employee_count,
            created_at,
            updated_at,
            profiles!manager_id(full_name)
          `);

        if (error) throw error;
        
        return (data || []).map(dept => ({
          ...dept,
          description: dept.description || null,
          manager_id: dept.manager_id || null,
          employee_count: dept.employee_count || null,
          profiles: dept.profiles || null
        })) as DepartmentWithManager[];
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

        // Fetch active users (logged in within last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        const { count: activeUsers } = await supabase
          .from("profiles")
          .select("*", { count: "exact" })
          .gte("updated_at", thirtyDaysAgo.toISOString());

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
        stats.activeUsers = activeUsers || 0;
        stats.pendingTasks = pendingTasks || 0;
        stats.completedTasks = completedTasks || 0;

        return stats;
      },
    });
  };

  const updateDepartment = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<DepartmentWithManager> }) => {
      const updateData = {
        name: data.name,
        description: data.description,
        manager_id: data.manager_id,
        employee_count: data.employee_count,
      };

      const { error } = await supabase
        .from("departments")
        .update(updateData)
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

  const createDepartment = useMutation({
    mutationFn: async (data: { name: string; description?: string; manager_id?: string }) => {
      const { error } = await supabase
        .from("departments")
        .insert([{
          name: data.name,
          description: data.description || null,
          manager_id: data.manager_id || null,
          employee_count: 0
        }]);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
      toast({
        title: "Department Created",
        description: "The department has been successfully created.",
      });
    },
  });

  const deleteDepartment = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("departments")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
      toast({
        title: "Department Deleted",
        description: "The department has been successfully deleted.",
      });
    },
  });

  return {
    useSystemActivities,
    useDepartments,
    useAdminStats,
    updateDepartment,
    createDepartment,
    deleteDepartment,
  };
};

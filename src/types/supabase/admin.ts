import { Database } from "@/integrations/supabase/types";

export interface AdminUser {
  id: string;
  email: string;
  role: "admin";
  department?: string;
  created_at: string;
}

export interface AdminDashboardStats {
  totalUsers: number;
  activeUsers: number;
  pendingTasks: number;
  completedTasks: number;
}

export interface SystemActivity extends Database["public"]["Tables"]["system_activities"]["Row"] {
  user?: {
    full_name: string;
  };
}

export interface DepartmentWithManager extends Database["public"]["Tables"]["departments"]["Row"] {
  profiles?: {
    full_name: string;
  };
}
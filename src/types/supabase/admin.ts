
import { Database } from "@/integrations/supabase/types";

export interface AdminDashboardStats {
  totalUsers: number;
  activeUsers: number;
  pendingTasks: number;
  completedTasks: number;
}

export interface SystemActivity {
  id: string;
  type: string;
  description: string;
  user_id: string | null;
  metadata: any | null;
  created_at: string;
  user?: {
    full_name: string;
  };
}

export interface DepartmentWithManager {
  id: string;
  name: string;
  description: string | null;
  manager_id: string | null;
  employee_count: number | null;
  created_at: string | null;
  updated_at: string | null;
  profiles?: {
    full_name: string;
  } | null;
}

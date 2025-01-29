import { Database } from "@/integrations/supabase/types";
import { DepartmentWithDetails, ProfileWithDetails } from "./common";

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

export interface DepartmentWithManager extends DepartmentWithDetails {
  manager?: ProfileWithDetails;
}

export type SystemActivityInsert = Database["public"]["Tables"]["system_activities"]["Insert"];
import { Database } from "@/integrations/supabase/types";

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Department = Database["public"]["Tables"]["departments"]["Row"];
export type Task = Database["public"]["Tables"]["tasks"]["Row"];

export interface ProfileWithDetails {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  department: string | null;
  role: string | null;
  created_at: string;
  updated_at: string;
}

export interface DepartmentWithDetails {
  id: string;
  name: string;
  description: string | null;
  manager_id: string | null;
  employee_count: number | null;
  created_at: string;
  updated_at: string;
  profiles?: {
    full_name: string;
  };
}

export interface TaskWithAssignee {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  assigned_to: string | null;
  created_by: string | null;
  due_date: string | null;
  created_at: string;
  updated_at: string;
  profiles?: {
    full_name: string;
  };
}
import { Database } from "@/integrations/supabase/types";
import { ProfileWithDetails, TaskWithAssignee } from "./common";

export interface ProjectWithAssignments {
  id: string;
  project_name: string;
  description: string | null;
  assigned_to: string;
  department_id: string;
  start_date: string;
  end_date: string | null;
  status: string;
  priority: string;
  created_at: string;
  updated_at: string;
  profiles?: ProfileWithDetails;
}

export interface TeamMember extends ProfileWithDetails {
  tasks?: TaskWithAssignee[];
}

export type ProjectAssignmentInsert = Database["public"]["Tables"]["project_assignments"]["Insert"];
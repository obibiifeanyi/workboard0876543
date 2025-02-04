import { Database } from "@/integrations/supabase/types";
import { ProfileWithDetails, TaskWithAssignee } from "./common";

export interface ProjectWithAssignments {
  id: string;
  title: string;
  description: string | null;
  client_name: string | null;
  budget: number | null;
  location: string | null;
  start_date: string | null;
  end_date: string | null;
  status: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  project_assignments: Array<{
    id: string;
    project_id: string | null;
    staff_id: string | null;
    created_at: string | null;
    updated_at: string | null;
  }>;
}

export interface TeamMember extends ProfileWithDetails {
  tasks?: TaskWithAssignee[];
}

export type ProjectAssignmentInsert = Database["public"]["Tables"]["project_assignments"]["Insert"];
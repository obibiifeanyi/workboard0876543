
import { Database } from "@/integrations/supabase/types";

export interface ProjectWithAssignments {
  id: string;
  title: string;
  description: string | null;
  status: string | null;
  start_date: string | null;
  end_date: string | null;
  department_id: string | null;
  project_assignments: Array<{
    id: string;
    project_id: string | null;
    staff_id: string | null;
    staff_name: string;
  }>;
}

export interface TeamMember {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  department: string | null;
  role: string | null;
  created_at: string;
  updated_at: string;
}

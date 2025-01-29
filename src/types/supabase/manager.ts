import { Database } from "@/integrations/supabase/types";

export interface ManagerUser {
  id: string;
  email: string;
  role: "manager";
  department: string;
  team_size?: number;
}

export interface TeamMember extends Database["public"]["Tables"]["profiles"]["Row"] {
  tasks?: Database["public"]["Tables"]["tasks"]["Row"][];
}

export interface ProjectWithAssignments extends Database["public"]["Tables"]["project_assignments"]["Row"] {
  profiles?: {
    full_name: string;
  };
  department?: {
    name: string;
  };
}

export interface TelecomSiteWithManager extends Database["public"]["Tables"]["telecom_sites"]["Row"] {
  profiles?: {
    full_name: string;
  };
  power_reports?: Database["public"]["Tables"]["ct_power_reports"]["Row"][];
}
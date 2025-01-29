import { Database } from "@/integrations/supabase/types";

export interface BaseUser {
  id: string;
  email: string;
  role: "admin" | "manager" | "staff";
  created_at: string;
}

export interface Task extends Database["public"]["Tables"]["tasks"]["Row"] {
  profiles?: {
    full_name: string;
  };
}

export interface Notification extends Database["public"]["Tables"]["notifications"]["Row"] {
  metadata?: {
    link?: string;
    action?: string;
  };
}

export interface Report extends Database["public"]["Tables"]["reports"]["Row"] {
  profiles?: {
    full_name: string;
  };
}
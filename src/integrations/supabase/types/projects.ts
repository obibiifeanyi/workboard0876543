import { Database } from './base';

export interface Project {
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
}

export interface ProjectAssignment {
  id: string;
  project_id: string | null;
  staff_id: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export type ProjectWithAssignments = Project & {
  project_assignments: ProjectAssignment[];
};

export type ProjectAssignmentInsert = Database['public']['Tables']['project_assignments']['Insert'];
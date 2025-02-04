import { Database } from './base';

export interface Project extends Database['public']['Tables']['projects']['Row'] {
  title: string;
  description: string | null;
  status: string;
}

export interface ProjectAssignment extends Database['public']['Tables']['project_assignments']['Row'] {
  project_id: string;
  staff_id: string;
}

export type ProjectAssignmentInsert = Database['public']['Tables']['project_assignments']['Insert'];
export type ProjectWithAssignments = Project & { assignments: ProjectAssignment[] };
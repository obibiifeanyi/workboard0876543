import { Database } from './base';

export interface Project {
  id: string;
  title: string;
  description: string | null;
  status: string;
  project_name: string;
  assigned_to: string;
  department_id: string;
  priority: string;
}

export interface ProjectAssignment {
  id: string;
  project_id: string;
  staff_id: string;
}

export type ProjectAssignmentInsert = Database['public']['Tables']['project_assignments']['Insert'];
export type ProjectWithAssignments = Project & { assignments: ProjectAssignment[] };
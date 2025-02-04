import { Json } from './base';

export interface ProjectTypes {
  projects: {
    Row: {
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
    };
    Insert: {
      id?: string;
      title: string;
      description?: string | null;
      client_name?: string | null;
      budget?: number | null;
      location?: string | null;
      start_date?: string | null;
      end_date?: string | null;
      status?: string | null;
      created_by?: string | null;
      created_at?: string;
      updated_at?: string;
    };
    Update: {
      title?: string;
      description?: string | null;
      client_name?: string | null;
      budget?: number | null;
      location?: string | null;
      start_date?: string | null;
      end_date?: string | null;
      status?: string | null;
      created_by?: string | null;
      updated_at?: string;
    };
  };
}

export type ProjectAssignmentInsert = {
  project_name: string;
  description?: string;
  assigned_to: string;
  department_id: string;
  start_date: string;
  end_date?: string;
  status?: string;
  priority?: string;
};
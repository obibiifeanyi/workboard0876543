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
  project_assignments: {
    Row: {
      id: string;
      project_id: string | null;
      staff_id: string | null;
      created_at: string;
      updated_at: string;
    };
    Insert: {
      id?: string;
      project_id?: string | null;
      staff_id?: string | null;
      created_at?: string;
      updated_at?: string;
    };
    Update: {
      project_id?: string | null;
      staff_id?: string | null;
      updated_at?: string;
    };
  };
}
import { Json } from './base';

export interface DepartmentRow {
  id: string;
  name: string;
  description: string | null;
  manager_id: string | null;
  employee_count: number | null;
  created_at: string;
  updated_at: string;
  profiles?: {
    full_name: string;
  };
}

export interface DepartmentInsert {
  name: string;
  description?: string | null;
  manager_id?: string | null;
  employee_count?: number | null;
  created_at?: string;
  updated_at?: string;
}

export interface ProjectAssignmentRow {
  id: string;
  project_name: string;
  description: string | null;
  assigned_to: string;
  department_id: string;
  start_date: string;
  end_date: string | null;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high';
  created_at: string;
  updated_at: string;
}

export interface DocumentArchiveRow {
  id: string;
  title: string;
  description: string | null;
  file_path: string;
  file_type: string;
  file_size: number;
  uploaded_by: string;
  department_id: string | null;
  tags: string[] | null;
  is_archived: boolean;
  created_at: string;
  updated_at: string;
}
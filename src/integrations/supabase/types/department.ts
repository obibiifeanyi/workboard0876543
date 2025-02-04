import { Json } from './base';

export interface DepartmentRow {
  id: string;
  name: string;
  description: string | null;
  manager_id: string | null;
  created_at: string;
  updated_at: string;
  profiles?: {
    full_name: string;
  };
}

export interface ProjectAssignmentRow {
  id: string;
  project_id: string | null;
  staff_id: string | null;
  created_at: string | null;
  updated_at: string | null;
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
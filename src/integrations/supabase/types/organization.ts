export interface DepartmentRow {
  created_at: string;
  description: string | null;
  id: string;
  manager_id: string | null;
  name: string;
  updated_at: string;
}

export interface ProjectAssignmentRow {
  assigned_to: string;
  created_at: string;
  department_id: string;
  description: string | null;
  end_date: string | null;
  id: string;
  priority: string;
  project_name: string;
  start_date: string;
  status: string;
  updated_at: string;
}

export interface DocumentArchiveRow {
  created_at: string;
  department_id: string | null;
  description: string | null;
  file_path: string;
  file_size: number;
  file_type: string;
  id: string;
  is_archived: boolean;
  tags: string[] | null;
  title: string;
  updated_at: string;
  uploaded_by: string;
}
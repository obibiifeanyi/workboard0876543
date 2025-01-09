export interface Department {
  id: string;
  name: string;
  description?: string;
  manager_id?: string;
  created_at: string;
  updated_at: string;
}

export interface ProjectAssignment {
  id: string;
  project_name: string;
  description?: string;
  assigned_to: string;
  department_id: string;
  start_date: string;
  end_date?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high';
  created_at: string;
  updated_at: string;
}

export interface DocumentArchive {
  id: string;
  title: string;
  description?: string;
  file_path: string;
  file_type: string;
  file_size: number;
  uploaded_by: string;
  department_id?: string;
  tags?: string[];
  is_archived: boolean;
  created_at: string;
  updated_at: string;
}
export interface DepartmentRow {
  id: string;
  name: string;
  description: string | null;
  manager_id: string | null;
  employee_count: number;
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
  employee_count?: number;
  created_at?: string;
  updated_at?: string;
}
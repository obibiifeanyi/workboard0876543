
export interface TeamMember {
  id: string;
  full_name: string;
  email: string;
  role: string;
  department_id?: string;
  department?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  department_id?: string;
  manager_id?: string;
  status?: string;
  priority?: string;
  start_date?: string;
  end_date?: string;
  budget?: number;
  created_at?: string;
  updated_at?: string;
}

export interface ProjectMember {
  id: string;
  project_id: string;
  user_id: string;
  role: string;
  joined_at?: string;
  profiles?: {
    full_name: string;
    email: string;
  };
}

export interface ProjectWithMembers extends Project {
  project_members?: ProjectMember[];
}

export interface Department {
  id: string;
  name: string;
  description?: string;
  manager_id?: string;
  employee_count?: number;
  created_at: string;
  updated_at: string;
  manager?: {
    full_name: string;
  };
}

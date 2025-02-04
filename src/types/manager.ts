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

export interface ProjectWithAssignments {
  id: string;
  title: string;
  description?: string;
  department_id?: string;
  location?: string;
  start_date?: string;
  end_date?: string;
  status?: string;
  project_assignments?: Array<{
    id: string;
    project_id: string;
    staff_id: string;
    profiles?: {
      full_name: string;
    };
  }>;
}
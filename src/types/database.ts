
export interface Site {
  id: string;
  name: string;
  location: string;
  site_type: string;
  coordinates?: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface WeeklyReport {
  id: string;
  user_id: string;
  week_start_date: string;
  week_end_date: string;
  accomplishments: string;
  challenges: string;
  next_week_goals: string;
  hours_worked: number;
  projects_worked_on: string[];
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
  submitted_at?: string;
  reviewed_at?: string;
  reviewed_by?: string;
  review_comments?: string;
  created_at: string;
  updated_at: string;
  reviewer?: { full_name: string };
}

export interface TelecomReport {
  id: string;
  site_id?: string;
  reporter_id: string;
  report_date: string;
  signal_strength?: number;
  network_status: string;
  equipment_status: string;
  issues_reported?: string;
  maintenance_required: boolean;
  recommendations?: string;
  photos?: string[];
  created_at: string;
  updated_at: string;
  site?: { name: string };
  reporter?: { full_name: string };
}

export interface BatteryReportDb {
  id: string;
  reporter_id: string;
  site_id?: string;
  site_name?: string;
  battery_id?: string;
  report_date: string;
  battery_voltage?: number;
  current_capacity?: number;
  temperature?: number;
  charging_status?: string;
  health_status: string;
  runtime_hours?: number;
  load_current?: number;
  backup_time_remaining?: number;
  maintenance_required: boolean;
  maintenance_notes?: string;
  next_maintenance_date?: string;
  issues_reported?: string;
  recommendations?: string;
  photos?: string[];
  created_at: string;
  updated_at: string;
  reporter?: { full_name: string };
}

export interface StaffMemo {
  id: string;
  sender_id: string;
  recipient_id: string;
  subject: string;
  content: string;
  memo_type: string;
  priority: string;
  status: string;
  is_read: boolean;
  read_at?: string;
  created_at: string;
  updated_at: string;
  sender?: { full_name: string };
  recipient?: { full_name: string };
}

export interface Meeting {
  id: string;
  title: string;
  description?: string;
  meeting_type: 'general' | 'project' | 'department' | 'emergency';
  location?: string;
  meeting_url?: string;
  start_time: string;
  end_time: string;
  organizer_id: string;
  department_id?: string;
  project_id?: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  agenda?: string;
  notes?: string;
  recording_url?: string;
  created_at: string;
  updated_at: string;
  organizer?: {
    full_name: string;
  };
}

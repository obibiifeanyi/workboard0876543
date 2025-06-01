
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
  participants?: MeetingParticipant[];
  organizer?: {
    full_name: string;
  };
}

export interface MeetingParticipant {
  id: string;
  meeting_id: string;
  participant_id: string;
  response: 'pending' | 'accepted' | 'declined' | 'tentative';
  attendance_status: 'pending' | 'present' | 'absent' | 'late';
  joined_at?: string;
  left_at?: string;
  created_at: string;
  participant?: {
    full_name: string;
    email: string;
  };
}

export interface WeeklyReport {
  id: string;
  user_id: string;
  week_start_date: string;
  week_end_date: string;
  accomplishments?: string;
  challenges?: string;
  next_week_goals?: string;
  hours_worked: number;
  projects_worked_on?: string[];
  status: 'draft' | 'submitted' | 'reviewed' | 'approved';
  submitted_at?: string;
  reviewed_by?: string;
  reviewed_at?: string;
  review_comments?: string;
  created_at: string;
  updated_at: string;
  reviewer?: {
    full_name: string;
  };
}

export interface BatteryReport {
  id: string;
  reporter_id: string;
  site_id?: string;
  battery_id?: string;
  report_date: string;
  battery_voltage?: number;
  current_capacity?: number;
  temperature?: number;
  charging_status?: 'charging' | 'discharging' | 'float' | 'bulk' | 'absorption';
  health_status: 'excellent' | 'good' | 'fair' | 'poor' | 'critical';
  runtime_hours?: number;
  load_current?: number;
  backup_time_remaining?: number;
  maintenance_required: boolean;
  maintenance_notes?: string;
  issues_reported?: string;
  photos?: string[];
  next_maintenance_date?: string;
  recommendations?: string;
  created_at: string;
  updated_at: string;
  site?: {
    name: string;
  };
  battery?: {
    model_name: string;
    manufacturer: string;
  };
  reporter?: {
    full_name: string;
  };
}

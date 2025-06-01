
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Meeting, MeetingParticipant, WeeklyReport, BatteryReport } from '@/types/staff';

export const useStaffOperations = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Mock data for development
  const mockMeetings: Meeting[] = [
    {
      id: '1',
      title: 'Weekly Team Standup',
      description: 'Regular team check-in and updates',
      meeting_type: 'general',
      location: 'Conference Room A',
      meeting_url: 'https://meet.google.com/abc-def-ghi',
      start_time: '2024-01-15T10:00:00Z',
      end_time: '2024-01-15T11:00:00Z',
      organizer_id: 'user1',
      status: 'scheduled',
      agenda: 'Project updates, roadblocks, next steps',
      created_at: '2024-01-10T08:00:00Z',
      updated_at: '2024-01-10T08:00:00Z',
      organizer: { full_name: 'John Manager' },
      participants: []
    },
    {
      id: '2',
      title: 'Project Planning Session',
      description: 'Planning for Q1 2024 projects',
      meeting_type: 'project',
      location: 'Virtual',
      meeting_url: 'https://zoom.us/j/123456789',
      start_time: '2024-01-18T14:00:00Z',
      end_time: '2024-01-18T15:30:00Z',
      organizer_id: 'user2',
      status: 'scheduled',
      agenda: 'Resource allocation, timeline review',
      created_at: '2024-01-12T09:00:00Z',
      updated_at: '2024-01-12T09:00:00Z',
      organizer: { full_name: 'Sarah Lead' },
      participants: []
    }
  ];

  const mockWeeklyReports: WeeklyReport[] = [
    {
      id: '1',
      user_id: 'user1',
      week_start_date: '2024-01-08',
      week_end_date: '2024-01-12',
      accomplishments: 'Completed user authentication module, Fixed 5 critical bugs',
      challenges: 'Database migration took longer than expected',
      next_week_goals: 'Implement user dashboard, Start on reporting module',
      hours_worked: 40,
      projects_worked_on: ['Project Alpha', 'Bug Fixes'],
      status: 'submitted',
      submitted_at: '2024-01-12T17:00:00Z',
      created_at: '2024-01-12T17:00:00Z',
      updated_at: '2024-01-12T17:00:00Z'
    },
    {
      id: '2',
      user_id: 'user1',
      week_start_date: '2024-01-01',
      week_end_date: '2024-01-05',
      accomplishments: 'Set up development environment, Initial project structure',
      challenges: 'Learning new technology stack',
      next_week_goals: 'Complete authentication system',
      hours_worked: 38,
      projects_worked_on: ['Project Alpha'],
      status: 'approved',
      submitted_at: '2024-01-05T17:00:00Z',
      reviewed_at: '2024-01-06T10:00:00Z',
      reviewed_by: 'manager1',
      review_comments: 'Great start! Keep up the momentum.',
      created_at: '2024-01-05T17:00:00Z',
      updated_at: '2024-01-06T10:00:00Z',
      reviewer: { full_name: 'Alex Manager' }
    }
  ];

  const mockBatteryReports: BatteryReport[] = [
    {
      id: '1',
      reporter_id: 'user1',
      site_id: 'site1',
      battery_id: 'battery1',
      report_date: '2024-01-15',
      battery_voltage: 12.6,
      current_capacity: 85,
      temperature: 25,
      charging_status: 'float',
      health_status: 'good',
      runtime_hours: 72,
      load_current: 2.5,
      backup_time_remaining: 48,
      maintenance_required: false,
      issues_reported: 'No issues detected',
      recommendations: 'Continue regular monitoring',
      created_at: '2024-01-15T14:30:00Z',
      updated_at: '2024-01-15T14:30:00Z',
      site: { name: 'Tower Site Alpha' },
      battery: { model_name: 'PowerMax 100', manufacturer: 'BatteryTech' },
      reporter: { full_name: 'Mike Technician' }
    },
    {
      id: '2',
      reporter_id: 'user2',
      site_id: 'site2',
      battery_id: 'battery2',
      report_date: '2024-01-14',
      battery_voltage: 11.8,
      current_capacity: 65,
      temperature: 30,
      charging_status: 'charging',
      health_status: 'fair',
      runtime_hours: 45,
      load_current: 3.2,
      backup_time_remaining: 30,
      maintenance_required: true,
      maintenance_notes: 'Replace aging cells',
      issues_reported: 'Reduced capacity noticed',
      recommendations: 'Schedule maintenance within 2 weeks',
      next_maintenance_date: '2024-01-28',
      created_at: '2024-01-14T16:15:00Z',
      updated_at: '2024-01-14T16:15:00Z',
      site: { name: 'Tower Site Beta' },
      battery: { model_name: 'PowerMax 150', manufacturer: 'BatteryTech' },
      reporter: { full_name: 'Lisa Engineer' }
    }
  ];

  // Meetings
  const useMeetings = () => {
    return useQuery({
      queryKey: ['meetings'],
      queryFn: async () => {
        // Use mock data for now, replace with real API call later
        return mockMeetings;
      },
    });
  };

  const createMeeting = useMutation({
    mutationFn: async (meeting: Partial<Meeting>) => {
      // For now, return mock data. Replace with real API call later
      const newMeeting = {
        ...meeting,
        id: `meeting_${Date.now()}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        status: 'scheduled' as const,
        organizer: { full_name: 'Current User' }
      };
      return newMeeting;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meetings'] });
      toast({
        title: "Success",
        description: "Meeting created successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to create meeting: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const updateMeeting = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Meeting> & { id: string }) => {
      // Mock update
      return { id, ...updates };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meetings'] });
      toast({
        title: "Success",
        description: "Meeting updated successfully",
      });
    },
  });

  // Weekly Reports
  const useWeeklyReports = () => {
    return useQuery({
      queryKey: ['weekly-reports'],
      queryFn: async () => {
        return mockWeeklyReports;
      },
    });
  };

  const createWeeklyReport = useMutation({
    mutationFn: async (report: Partial<WeeklyReport>) => {
      const newReport = {
        ...report,
        id: `report_${Date.now()}`,
        user_id: 'current_user',
        status: 'draft' as const,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      return newReport;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['weekly-reports'] });
      toast({
        title: "Success",
        description: "Weekly report created successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to create report: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const updateWeeklyReport = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<WeeklyReport> & { id: string }) => {
      return { id, ...updates };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['weekly-reports'] });
      toast({
        title: "Success",
        description: "Weekly report updated successfully",
      });
    },
  });

  // Battery Reports
  const useBatteryReports = () => {
    return useQuery({
      queryKey: ['battery-reports'],
      queryFn: async () => {
        return mockBatteryReports;
      },
    });
  };

  const createBatteryReport = useMutation({
    mutationFn: async (report: Partial<BatteryReport>) => {
      const newReport = {
        ...report,
        id: `battery_report_${Date.now()}`,
        reporter_id: 'current_user',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        reporter: { full_name: 'Current User' }
      };
      return newReport;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['battery-reports'] });
      toast({
        title: "Success",
        description: "Battery report created successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to create battery report: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const updateBatteryReport = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<BatteryReport> & { id: string }) => {
      return { id, ...updates };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['battery-reports'] });
      toast({
        title: "Success",
        description: "Battery report updated successfully",
      });
    },
  });

  return {
    useMeetings,
    createMeeting,
    updateMeeting,
    useWeeklyReports,
    createWeeklyReport,
    updateWeeklyReport,
    useBatteryReports,
    createBatteryReport,
    updateBatteryReport,
  };
};

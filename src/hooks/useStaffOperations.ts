import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { WeeklyReport, TelecomReport, BatteryReportDb, StaffMemo, Site, Meeting } from '@/types/database';

export const useStaffOperations = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Sites
  const useSites = () => {
    return useQuery({
      queryKey: ['sites'],
      queryFn: async () => {
        const { data, error } = await supabase
          .from('sites')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        return data as Site[];
      },
    });
  };

  // Weekly Reports
  const useWeeklyReports = () => {
    return useQuery({
      queryKey: ['weekly_reports'],
      queryFn: async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        const { data, error } = await supabase
          .from('weekly_reports')
          .select(`
            *,
            reviewer:reviewed_by(full_name)
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        return (data || []).map(report => ({
          ...report,
          reviewer: report.reviewer && typeof report.reviewer === 'object' ? report.reviewer : null
        })) as WeeklyReport[];
      },
    });
  };

  const createWeeklyReport = useMutation({
    mutationFn: async (reportData: Omit<WeeklyReport, 'id' | 'created_at' | 'updated_at' | 'user_id' | 'reviewer'>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('weekly_reports')
        .insert({
          user_id: user.id,
          week_start_date: reportData.week_start_date,
          week_end_date: reportData.week_end_date,
          accomplishments: reportData.accomplishments,
          challenges: reportData.challenges,
          next_week_goals: reportData.next_week_goals,
          hours_worked: reportData.hours_worked,
          projects_worked_on: reportData.projects_worked_on,
          status: reportData.status
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['weekly_reports'] });
    },
  });

  // Battery Reports
  const useBatteryReports = () => {
    return useQuery({
      queryKey: ['battery_reports'],
      queryFn: async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        const { data, error } = await supabase
          .from('battery_reports')
          .select(`
            *,
            reporter:reporter_id(full_name)
          `)
          .eq('reporter_id', user.id)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        return (data || []).map(report => ({
          ...report,
          reporter: report.reporter && typeof report.reporter === 'object' ? report.reporter : null
        })) as BatteryReportDb[];
      },
    });
  };

  const createBatteryReport = useMutation({
    mutationFn: async (reportData: Omit<BatteryReportDb, 'id' | 'created_at' | 'updated_at' | 'reporter_id' | 'reporter'>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('battery_reports')
        .insert({
          reporter_id: user.id,
          site_name: reportData.site_name,
          battery_voltage: reportData.battery_voltage,
          current_capacity: reportData.current_capacity,
          temperature: reportData.temperature,
          charging_status: reportData.charging_status,
          health_status: reportData.health_status,
          runtime_hours: reportData.runtime_hours,
          load_current: reportData.load_current,
          backup_time_remaining: reportData.backup_time_remaining,
          maintenance_required: reportData.maintenance_required,
          issues_reported: reportData.issues_reported,
          recommendations: reportData.recommendations,
          report_date: reportData.report_date
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['battery_reports'] });
    },
  });

  // Telecom Reports
  const useTelecomReports = () => {
    return useQuery({
      queryKey: ['telecom_reports'],
      queryFn: async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        const { data, error } = await supabase
          .from('telecom_reports')
          .select(`
            *,
            site:site_id(name),
            reporter:reporter_id(full_name)
          `)
          .eq('reporter_id', user.id)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        return (data || []).map(report => ({
          ...report,
          site: report.site && typeof report.site === 'object' ? report.site : null,
          reporter: report.reporter && typeof report.reporter === 'object' ? report.reporter : null
        })) as TelecomReport[];
      },
    });
  };

  const createTelecomReport = useMutation({
    mutationFn: async (reportData: Omit<TelecomReport, 'id' | 'created_at' | 'updated_at' | 'reporter_id' | 'reporter' | 'site'>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('telecom_reports')
        .insert({
          reporter_id: user.id,
          site_id: reportData.site_id,
          signal_strength: reportData.signal_strength,
          network_status: reportData.network_status,
          equipment_status: reportData.equipment_status,
          issues_reported: reportData.issues_reported,
          maintenance_required: reportData.maintenance_required,
          recommendations: reportData.recommendations,
          report_date: reportData.report_date
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['telecom_reports'] });
    },
  });

  // Memos
  const useMemos = () => {
    return useQuery({
      queryKey: ['staff_memos'],
      queryFn: async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        const { data, error } = await supabase
          .from('staff_memos')
          .select(`
            *,
            sender:sender_id(full_name),
            recipient:recipient_id(full_name)
          `)
          .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        return (data || []).map(memo => ({
          ...memo,
          sender: memo.sender && typeof memo.sender === 'object' ? memo.sender : null,
          recipient: memo.recipient && typeof memo.recipient === 'object' ? memo.recipient : null
        })) as StaffMemo[];
      },
    });
  };

  const createMemo = useMutation({
    mutationFn: async (memoData: Omit<StaffMemo, 'id' | 'created_at' | 'updated_at' | 'sender_id' | 'sender' | 'recipient'>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('staff_memos')
        .insert({
          sender_id: user.id,
          recipient_id: memoData.recipient_id,
          subject: memoData.subject,
          content: memoData.content,
          memo_type: memoData.memo_type,
          priority: memoData.priority,
          status: memoData.status,
          is_read: memoData.is_read
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff_memos'] });
    },
  });

  // Meetings
  const useMeetings = () => {
    return useQuery({
      queryKey: ['meetings'],
      queryFn: async () => {
        const { data, error } = await supabase
          .from('meetings')
          .select(`
            *,
            organizer:organizer_id(full_name)
          `)
          .order('start_time', { ascending: true });
        
        if (error) throw error;
        return (data || []).map(meeting => ({
          ...meeting,
          organizer: meeting.organizer && typeof meeting.organizer === 'object' ? meeting.organizer : null
        })) as Meeting[];
      },
    });
  };

  const createMeeting = useMutation({
    mutationFn: async (meetingData: Omit<Meeting, 'id' | 'created_at' | 'updated_at' | 'organizer_id' | 'organizer'>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('meetings')
        .insert({
          organizer_id: user.id,
          title: meetingData.title,
          description: meetingData.description,
          meeting_type: meetingData.meeting_type,
          location: meetingData.location,
          meeting_url: meetingData.meeting_url,
          start_time: meetingData.start_time,
          end_time: meetingData.end_time,
          agenda: meetingData.agenda,
          status: meetingData.status
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meetings'] });
    },
  });

  // Time Logging
  const logTime = useMutation({
    mutationFn: async (timeData: { clock_in?: string; clock_out?: string; description?: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('time_logs')
        .insert({
          user_id: user.id,
          clock_in: timeData.clock_in || new Date().toISOString(),
          notes: timeData.description
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['time_logs'] });
    },
  });

  // Leave Requests
  const createLeaveRequest = useMutation({
    mutationFn: async (leaveData: { start_date: string; end_date: string; leave_type: string; reason: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('leave_requests')
        .insert({
          user_id: user.id,
          start_date: leaveData.start_date,
          end_date: leaveData.end_date,
          leave_type: leaveData.leave_type,
          reason: leaveData.reason,
          status: 'pending'
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leave_requests'] });
    },
  });

  return {
    useSites,
    useWeeklyReports,
    createWeeklyReport,
    useBatteryReports,
    createBatteryReport,
    useTelecomReports,
    createTelecomReport,
    useMemos,
    createMemo,
    useMeetings,
    createMeeting,
    logTime,
    createLeaveRequest,
  };
};

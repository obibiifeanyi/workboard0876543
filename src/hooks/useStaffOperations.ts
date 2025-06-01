
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Meeting, MeetingParticipant, WeeklyReport, BatteryReport } from '@/types/staff';

export const useStaffOperations = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Meetings
  const useMeetings = () => {
    return useQuery({
      queryKey: ['meetings'],
      queryFn: async () => {
        const { data, error } = await supabase
          .from('meetings')
          .select(`
            *,
            organizer:organizer_id(full_name),
            meeting_participants(
              *,
              participant:participant_id(full_name, email)
            )
          `)
          .order('start_time', { ascending: true });
        
        if (error) throw error;
        return data as Meeting[];
      },
    });
  };

  const createMeeting = useMutation({
    mutationFn: async (meeting: Partial<Meeting>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('meetings')
        .insert({
          ...meeting,
          organizer_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
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
      const { data, error } = await supabase
        .from('meetings')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
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
        const { data, error } = await supabase
          .from('weekly_reports')
          .select(`
            *,
            reviewer:reviewed_by(full_name)
          `)
          .order('week_start_date', { ascending: false });
        
        if (error) throw error;
        return data as WeeklyReport[];
      },
    });
  };

  const createWeeklyReport = useMutation({
    mutationFn: async (report: Partial<WeeklyReport>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('weekly_reports')
        .insert({
          ...report,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
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
      const { data, error } = await supabase
        .from('weekly_reports')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
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
        const { data, error } = await supabase
          .from('battery_reports')
          .select(`
            *,
            site:site_id(name),
            battery:battery_id(model_name, manufacturer),
            reporter:reporter_id(full_name)
          `)
          .order('report_date', { ascending: false });
        
        if (error) throw error;
        return data as BatteryReport[];
      },
    });
  };

  const createBatteryReport = useMutation({
    mutationFn: async (report: Partial<BatteryReport>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('battery_reports')
        .insert({
          ...report,
          reporter_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
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
      const { data, error } = await supabase
        .from('battery_reports')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
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

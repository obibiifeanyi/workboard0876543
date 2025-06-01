
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { WeeklyReport, TelecomReport, BatteryReportDb, StaffMemo, Site } from '@/types/database';

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
      queryKey: ['weekly-reports'],
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
        return data as WeeklyReport[];
      },
    });
  };

  const createWeeklyReport = useMutation({
    mutationFn: async (report: Partial<WeeklyReport>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

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
            reporter:reporter_id(full_name)
          `)
          .order('created_at', { ascending: false });

        if (error) throw error;
        return data as BatteryReportDb[];
      },
    });
  };

  const createBatteryReport = useMutation({
    mutationFn: async (report: Partial<BatteryReportDb>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

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

  // Telecom Reports
  const useTelecomReports = () => {
    return useQuery({
      queryKey: ['telecom-reports'],
      queryFn: async () => {
        const { data, error } = await supabase
          .from('telecom_reports')
          .select(`
            *,
            site:site_id(name),
            reporter:reporter_id(full_name)
          `)
          .order('created_at', { ascending: false });

        if (error) throw error;
        return data as TelecomReport[];
      },
    });
  };

  const createTelecomReport = useMutation({
    mutationFn: async (report: Partial<TelecomReport>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('telecom_reports')
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
      queryClient.invalidateQueries({ queryKey: ['telecom-reports'] });
      toast({
        title: "Success",
        description: "Telecom report created successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to create telecom report: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Staff Memos
  const useStaffMemos = () => {
    return useQuery({
      queryKey: ['staff-memos'],
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
        return data as StaffMemo[];
      },
    });
  };

  const createStaffMemo = useMutation({
    mutationFn: async (memo: Partial<StaffMemo>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('staff_memos')
        .insert({
          ...memo,
          sender_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff-memos'] });
      toast({
        title: "Success",
        description: "Memo sent successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to send memo: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const markMemoAsRead = useMutation({
    mutationFn: async (memoId: string) => {
      const { data, error } = await supabase
        .from('staff_memos')
        .update({ 
          is_read: true, 
          read_at: new Date().toISOString() 
        })
        .eq('id', memoId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff-memos'] });
    },
  });

  // Time Logs
  const createTimeLog = useMutation({
    mutationFn: async (timeLog: { clock_in?: string; clock_out?: string; description?: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('time_logs')
        .insert({
          ...timeLog,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['time-logs'] });
      toast({
        title: "Success",
        description: "Time logged successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to log time: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Leave Requests
  const createLeaveRequest = useMutation({
    mutationFn: async (leaveRequest: { 
      leave_type: string; 
      start_date: string; 
      end_date: string; 
      reason?: string 
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('leave_requests')
        .insert({
          ...leaveRequest,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leave-requests'] });
      toast({
        title: "Success",
        description: "Leave request submitted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to submit leave request: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  return {
    useSites,
    useWeeklyReports,
    createWeeklyReport,
    updateWeeklyReport,
    useBatteryReports,
    createBatteryReport,
    useTelecomReports,
    createTelecomReport,
    useStaffMemos,
    createStaffMemo,
    markMemoAsRead,
    createTimeLog,
    createLeaveRequest,
  };
};

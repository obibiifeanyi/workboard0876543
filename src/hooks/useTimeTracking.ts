
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface TimeLog {
  id: string;
  user_id: string;
  clock_in: string;
  clock_out: string | null;
  notes: string | null;
  project_id: string | null;
  task_id: string | null;
  total_hours: number | null;
  location_latitude: number | null;
  location_longitude: number | null;
  created_at: string;
  updated_at: string;
}

export const useTimeTracking = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: timeLogs = [], isLoading } = useQuery({
    queryKey: ['timeLogs'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('time_logs')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Time logs query error:', error);
        return [];
      }
      return data as TimeLog[];
    },
  });

  const clockInMutation = useMutation({
    mutationFn: async ({ latitude, longitude }: { latitude?: number; longitude?: number }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const insertData: any = {
        user_id: user.id,
        clock_in: new Date().toISOString(),
        notes: latitude && longitude ? `Location: ${latitude}, ${longitude}` : null,
      };

      // Only add location columns if they exist in the database
      if (latitude !== undefined) insertData.location_latitude = latitude;
      if (longitude !== undefined) insertData.location_longitude = longitude;

      const { data, error } = await supabase
        .from('time_logs')
        .insert(insertData)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timeLogs'] });
      toast({
        title: "Clock In Successful",
        description: "You have been clocked in successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Clock In Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const clockOutMutation = useMutation({
    mutationFn: async (timeLogId: string) => {
      const clockOutTime = new Date().toISOString();
      
      // Get the existing time log to calculate total hours
      const { data: existingLog } = await supabase
        .from('time_logs')
        .select('clock_in')
        .eq('id', timeLogId)
        .single();

      let totalHours = null;
      if (existingLog) {
        const clockInTime = new Date(existingLog.clock_in);
        const clockOutDate = new Date(clockOutTime);
        totalHours = (clockOutDate.getTime() - clockInTime.getTime()) / (1000 * 60 * 60);
      }

      const { data, error } = await supabase
        .from('time_logs')
        .update({ 
          clock_out: clockOutTime,
          total_hours: totalHours
        })
        .eq('id', timeLogId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timeLogs'] });
      toast({
        title: "Clock Out Successful",
        description: "You have been clocked out successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Clock Out Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const getCurrentTimeLog = () => {
    return timeLogs.find(log => !log.clock_out);
  };

  return {
    timeLogs,
    isLoading,
    clockIn: clockInMutation.mutate,
    clockOut: clockOutMutation.mutate,
    isClockingIn: clockInMutation.isPending,
    isClockingOut: clockOutMutation.isPending,
    getCurrentTimeLog,
  };
};

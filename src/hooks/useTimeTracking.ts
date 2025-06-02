
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface TimeLog {
  id: string;
  user_id: string;
  clock_in: string;
  clock_out: string | null;
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
        .select('id, user_id, clock_in, clock_out, location_latitude, location_longitude, created_at, updated_at')
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

      const { data, error } = await supabase
        .from('time_logs')
        .insert({
          user_id: user.id,
          clock_in: new Date().toISOString(),
          location_latitude: latitude,
          location_longitude: longitude,
        })
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
      const { data, error } = await supabase
        .from('time_logs')
        .update({ clock_out: new Date().toISOString() })
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

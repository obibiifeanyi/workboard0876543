
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TimeLogTable } from "@/components/shared/TimeLogTable";
import { Clock, Loader } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface TimeLogWithProfile {
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
  profile: {
    full_name: string | null;
  } | null;
}

export const TimeManagement = () => {
  const { data: timeLogs = [], isLoading } = useQuery({
    queryKey: ['admin-time-logs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('time_logs')
        .select(`
          id,
          user_id,
          clock_in,
          clock_out,
          notes,
          project_id,
          task_id,
          total_hours,
          location_latitude,
          location_longitude,
          created_at,
          profile:profiles(full_name)
        `)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        console.warn('Time logs query error:', error);
        return [];
      }
      return data as TimeLogWithProfile[];
    },
  });

  const formattedLogs = timeLogs.map(log => ({
    id: parseInt(log.id),
    employeeName: log.profile?.full_name || 'Unknown Employee',
    clockIn: log.clock_in,
    clockOut: log.clock_out,
    location: {
      latitude: log.location_latitude || 0,
      longitude: log.location_longitude || 0,
    },
  }));

  if (isLoading) {
    return (
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Time & Location Logs
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-32">
          <Loader className="h-6 w-6 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Time & Location Logs
        </CardTitle>
      </CardHeader>
      <CardContent>
        <TimeLogTable logs={formattedLogs} />
      </CardContent>
    </Card>
  );
};

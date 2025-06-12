import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';

interface TimeLogTableProps {
  userId: string;
}

export function TimeLogTable({ userId }: TimeLogTableProps) {
  const { data: timeLogs, isLoading } = useQuery({
    queryKey: ['time-logs', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('time_logs')
        .select('*')
        .eq('user_id', userId)
        .order('clock_in', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });

  if (isLoading) {
    return <div>Loading time logs...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Time Logs</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Clock In</TableHead>
              <TableHead>Clock Out</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Location</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {timeLogs?.map((log) => (
              <TableRow key={log.id}>
                <TableCell>
                  {format(new Date(log.clock_in), 'MMM d, yyyy')}
                </TableCell>
                <TableCell>
                  {format(new Date(log.clock_in), 'h:mm a')}
                </TableCell>
                <TableCell>
                  {log.clock_out
                    ? format(new Date(log.clock_out), 'h:mm a')
                    : '-'}
                </TableCell>
                <TableCell>
                  {log.clock_out
                    ? formatDuration(
                        new Date(log.clock_out).getTime() -
                          new Date(log.clock_in).getTime()
                      )
                    : '-'}
                </TableCell>
                <TableCell>
                  {log.location ? (
                    <a
                      href={`https://www.google.com/maps?q=${log.location.latitude},${log.location.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      View Location
                    </a>
                  ) : (
                    '-'
                  )}
                </TableCell>
              </TableRow>
            ))}
            {timeLogs?.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  No time logs found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function formatDuration(ms: number): string {
  const hours = Math.floor(ms / (1000 * 60 * 60));
  const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
  return `${hours}h ${minutes}m`;
}

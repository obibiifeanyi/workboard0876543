
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Clock, Calendar, Users, Loader, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TimeLog {
  id: string;
  user_id: string;
  clock_in: string;
  clock_out: string | null;
  total_hours: number | null;
  notes: string | null;
  created_at: string;
}

interface TimeStats {
  totalEmployees: number;
  activeClockIns: number;
  totalHoursToday: number;
  averageHours: number;
}

export const TimeAttendanceManagement = () => {
  const [timeLogs, setTimeLogs] = useState<TimeLog[]>([]);
  const [users, setUsers] = useState<{[key: string]: string}>({});
  const [stats, setStats] = useState<TimeStats>({
    totalEmployees: 0,
    activeClockIns: 0,
    totalHoursToday: 0,
    averageHours: 0,
  });
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState("today");
  const { toast } = useToast();

  useEffect(() => {
    fetchTimeData();
    fetchUsers();
  }, [selectedPeriod]);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name');

      if (error) throw error;
      
      const userMap = (data || []).reduce((acc, user) => {
        acc[user.id] = user.full_name || 'Unknown User';
        return acc;
      }, {} as {[key: string]: string});
      
      setUsers(userMap);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchTimeData = async () => {
    try {
      setLoading(true);
      
      // Calculate date range based on selected period
      const now = new Date();
      let startDate = new Date();
      
      switch (selectedPeriod) {
        case "today":
          startDate.setHours(0, 0, 0, 0);
          break;
        case "week":
          startDate.setDate(now.getDate() - 7);
          break;
        case "month":
          startDate.setMonth(now.getMonth() - 1);
          break;
        default:
          startDate.setHours(0, 0, 0, 0);
      }

      // Fetch time logs
      const { data: timeData, error: timeError } = await supabase
        .from('time_logs')
        .select('*')
        .gte('clock_in', startDate.toISOString())
        .order('clock_in', { ascending: false });

      if (timeError) throw timeError;
      setTimeLogs(timeData || []);

      // Calculate stats
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const todayLogs = (timeData || []).filter(log => {
        const logDate = new Date(log.clock_in);
        return logDate >= today && logDate < tomorrow;
      });

      const activeClockIns = todayLogs.filter(log => !log.clock_out).length;
      const completedToday = todayLogs.filter(log => log.clock_out && log.total_hours);
      const totalHoursToday = completedToday.reduce((sum, log) => sum + (log.total_hours || 0), 0);
      const averageHours = completedToday.length > 0 ? totalHoursToday / completedToday.length : 0;

      // Get total employees count
      const { count: totalEmployees } = await supabase
        .from('profiles')
        .select('*', { count: 'exact' });

      setStats({
        totalEmployees: totalEmployees || 0,
        activeClockIns,
        totalHoursToday,
        averageHours,
      });

    } catch (error) {
      console.error('Error fetching time data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch time and attendance data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const exportTimeData = async () => {
    try {
      const csvContent = [
        ['Employee', 'Clock In', 'Clock Out', 'Total Hours', 'Date', 'Notes'],
        ...timeLogs.map(log => [
          users[log.user_id] || 'Unknown',
          new Date(log.clock_in).toLocaleString(),
          log.clock_out ? new Date(log.clock_out).toLocaleString() : 'Still clocked in',
          log.total_hours?.toFixed(2) || 'N/A',
          new Date(log.clock_in).toLocaleDateString(),
          log.notes || ''
        ])
      ].map(row => row.join(',')).join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `time-attendance-${selectedPeriod}-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);

      toast({
        title: "Success",
        description: "Time data exported successfully",
      });
    } catch (error) {
      console.error('Error exporting data:', error);
      toast({
        title: "Error",
        description: "Failed to export data",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-32">
          <Loader className="h-6 w-6 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="h-6 w-6 text-red-600" />
          <h1 className="text-2xl font-bold">Time & Attendance Management</h1>
        </div>
        <div className="flex gap-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">Last 7 Days</SelectItem>
              <SelectItem value="month">Last 30 Days</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={exportTimeData}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalEmployees}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Clock-ins</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeClockIns}</div>
            <p className="text-xs text-muted-foreground">Currently working</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Hours Today</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalHoursToday.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">Hours worked</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Hours</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageHours.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">Per employee today</p>
          </CardContent>
        </Card>
      </div>

      {/* Time Logs Table */}
      <Card>
        <CardHeader>
          <CardTitle>Time Logs</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Clock In</TableHead>
                <TableHead>Clock Out</TableHead>
                <TableHead>Total Hours</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {timeLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="font-medium">
                    {users[log.user_id] || 'Unknown User'}
                  </TableCell>
                  <TableCell>
                    {new Date(log.clock_in).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    {log.clock_out 
                      ? new Date(log.clock_out).toLocaleString()
                      : '-'
                    }
                  </TableCell>
                  <TableCell>
                    {log.total_hours 
                      ? `${log.total_hours.toFixed(2)} hrs`
                      : '-'
                    }
                  </TableCell>
                  <TableCell>
                    {log.clock_out ? (
                      <Badge variant="outline">Completed</Badge>
                    ) : (
                      <Badge variant="default">Active</Badge>
                    )}
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    {log.notes || '-'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {timeLogs.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No time logs found for the selected period
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

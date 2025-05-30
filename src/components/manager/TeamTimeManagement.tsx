
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Calendar, MapPin } from "lucide-react";
import { useManagerData } from "@/hooks/manager/useManagerData";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export const TeamTimeManagement = () => {
  const [timeRange, setTimeRange] = useState<"today" | "week" | "month">("today");
  const { timeLogs, isLoadingTimeLogs } = useManagerData();

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateHours = (clockIn: string, clockOut?: string) => {
    if (!clockOut) return "Active";
    const start = new Date(clockIn);
    const end = new Date(clockOut);
    const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    return `${hours.toFixed(1)}h`;
  };

  if (isLoadingTimeLogs) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Team Time & Location Logs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Team Time & Location Logs
          </CardTitle>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <div className="flex gap-2">
              <Button
                variant={timeRange === "today" ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeRange("today")}
              >
                Today
              </Button>
              <Button
                variant={timeRange === "week" ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeRange("week")}
              >
                This Week
              </Button>
              <Button
                variant={timeRange === "month" ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeRange("month")}
              >
                This Month
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {timeLogs && timeLogs.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Clock In</TableHead>
                <TableHead>Clock Out</TableHead>
                <TableHead>Hours</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {timeLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>{log.profiles?.full_name || 'Unknown'}</TableCell>
                  <TableCell>{formatTime(log.clock_in)}</TableCell>
                  <TableCell>{log.clock_out ? formatTime(log.clock_out) : '-'}</TableCell>
                  <TableCell>{calculateHours(log.clock_in, log.clock_out)}</TableCell>
                  <TableCell>
                    <Badge variant={log.clock_out ? "default" : "secondary"}>
                      {log.clock_out ? "Completed" : "Active"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No time logs found for the selected period
          </div>
        )}
      </CardContent>
    </Card>
  );
};

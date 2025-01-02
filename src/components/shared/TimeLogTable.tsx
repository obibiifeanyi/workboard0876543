import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Clock, MapPin } from "lucide-react";

interface TimeLog {
  id: number;
  employeeName: string;
  clockIn: string;
  clockOut: string | null;
  location: {
    latitude: number;
    longitude: number;
  };
}

interface TimeLogTableProps {
  logs: TimeLog[];
}

export const TimeLogTable = ({ logs }: TimeLogTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Employee</TableHead>
          <TableHead>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Clock In
            </div>
          </TableHead>
          <TableHead>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Clock Out
            </div>
          </TableHead>
          <TableHead>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Location
            </div>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {logs.map((log) => (
          <TableRow key={log.id}>
            <TableCell>{log.employeeName}</TableCell>
            <TableCell>{new Date(log.clockIn).toLocaleString()}</TableCell>
            <TableCell>
              {log.clockOut ? new Date(log.clockOut).toLocaleString() : "Active"}
            </TableCell>
            <TableCell>
              <a
                href={`https://maps.google.com/?q=${log.location.latitude},${log.location.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                View Location
              </a>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
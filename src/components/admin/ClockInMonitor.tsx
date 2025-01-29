import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Clock, MapPin } from "lucide-react";

const mockLogs = [
  {
    id: 1,
    employeeName: "John Doe",
    time: "09:00 AM",
    date: "2024-03-21",
    status: "Clocked In",
    location: "Main Office",
  },
  {
    id: 2,
    employeeName: "Jane Smith",
    time: "09:15 AM",
    date: "2024-03-21",
    status: "Clocked In",
    location: "Remote",
  },
];

export const ClockInMonitor = () => {
  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          Real-Time Clock In Monitor
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Location
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="font-medium">{log.employeeName}</TableCell>
                  <TableCell>{log.date}</TableCell>
                  <TableCell>{log.time}</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {log.status}
                    </span>
                  </TableCell>
                  <TableCell>{log.location}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
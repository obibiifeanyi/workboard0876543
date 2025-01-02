import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TimeLogTable } from "@/components/shared/TimeLogTable";
import { Clock } from "lucide-react";

const mockLogs = [
  {
    id: 1,
    employeeName: "John Doe",
    clockIn: "2024-03-20T09:00:00",
    clockOut: "2024-03-20T17:00:00",
    location: {
      latitude: 40.7128,
      longitude: -74.0060,
    },
  },
  {
    id: 2,
    employeeName: "Jane Smith",
    clockIn: "2024-03-20T08:45:00",
    clockOut: null,
    location: {
      latitude: 40.7128,
      longitude: -74.0060,
    },
  },
];

export const TimeManagement = () => {
  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Time & Location Logs
        </CardTitle>
      </CardHeader>
      <CardContent>
        <TimeLogTable logs={mockLogs} />
      </CardContent>
    </Card>
  );
};
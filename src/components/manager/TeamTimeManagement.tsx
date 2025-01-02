import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TimeLogTable } from "@/components/shared/TimeLogTable";
import { Button } from "@/components/ui/button";
import { Clock, Calendar } from "lucide-react";

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

export const TeamTimeManagement = () => {
  const [timeRange, setTimeRange] = useState<"today" | "week" | "month">("today");

  return (
    <Card className="col-span-2">
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
        <TimeLogTable logs={mockLogs} />
      </CardContent>
    </Card>
  );
};
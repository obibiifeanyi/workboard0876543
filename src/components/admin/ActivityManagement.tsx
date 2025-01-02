import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Activity, Filter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const mockActivities = [
  {
    id: 1,
    user: "John Doe",
    action: "File Upload",
    resource: "Project Documentation",
    timestamp: "2024-03-20 14:30",
    status: "Completed",
  },
  {
    id: 2,
    user: "Jane Smith",
    action: "User Login",
    resource: "System",
    timestamp: "2024-03-20 14:25",
    status: "Success",
  },
];

export const ActivityManagement = () => {
  const { toast } = useToast();

  const handleFilter = () => {
    toast({
      title: "Filter Activities",
      description: "Filtering activities...",
    });
  };

  return (
    <Card className="col-span-2">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Activity Log
          </CardTitle>
          <Button
            variant="outline"
            onClick={handleFilter}
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            Filter
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Resource</TableHead>
              <TableHead>Timestamp</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockActivities.map((activity) => (
              <TableRow key={activity.id}>
                <TableCell>{activity.user}</TableCell>
                <TableCell>{activity.action}</TableCell>
                <TableCell>{activity.resource}</TableCell>
                <TableCell>{activity.timestamp}</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      activity.status === "Completed" || activity.status === "Success"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {activity.status}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
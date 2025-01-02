import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, CheckCircle, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const mockLeaveRequests = [
  {
    id: 1,
    employee: "John Smith",
    type: "Annual",
    startDate: "2024-04-01",
    endDate: "2024-04-05",
    status: "Pending",
  },
  {
    id: 2,
    employee: "Sarah Johnson",
    type: "Sick",
    startDate: "2024-04-10",
    endDate: "2024-04-11",
    status: "Pending",
  },
];

export const LeaveManagement = () => {
  const { toast } = useToast();

  const handleLeaveAction = (id: number, action: "approve" | "reject") => {
    toast({
      title: `Leave ${action === "approve" ? "Approved" : "Rejected"}`,
      description: `Leave request ${id} has been ${action}d`,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Leave Management
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockLeaveRequests.map((request) => (
              <TableRow key={request.id}>
                <TableCell>{request.employee}</TableCell>
                <TableCell>{request.type}</TableCell>
                <TableCell>{request.startDate}</TableCell>
                <TableCell>{request.endDate}</TableCell>
                <TableCell>
                  <span className="px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">
                    {request.status}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleLeaveAction(request.id, "approve")}
                    >
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleLeaveAction(request.id, "reject")}
                    >
                      <XCircle className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
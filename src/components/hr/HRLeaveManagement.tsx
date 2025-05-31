
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Calendar, CheckCircle, XCircle, Loader, Clock } from "lucide-react";
import { useLeaveRequests } from "@/hooks/useLeaveRequests";
import { Badge } from "@/components/ui/badge";

export const HRLeaveManagement = () => {
  const { leaveRequests, isLoading, approveLeaveRequest, rejectLeaveRequest } = useLeaveRequests();

  const handleApprove = async (requestId: string) => {
    await approveLeaveRequest.mutateAsync(requestId);
  };

  const handleReject = async (requestId: string) => {
    await rejectLeaveRequest.mutateAsync({ 
      requestId, 
      reason: "Request rejected by HR" 
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
      case 'approved':
        return <Badge variant="default" className="bg-green-500"><CheckCircle className="h-3 w-3 mr-1" />Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getLeaveTypeBadge = (type: string) => {
    switch (type) {
      case 'annual':
        return <Badge className="bg-blue-500">Annual</Badge>;
      case 'sick':
        return <Badge className="bg-orange-500">Sick</Badge>;
      case 'emergency':
        return <Badge className="bg-red-500">Emergency</Badge>;
      case 'maternity':
        return <Badge className="bg-pink-500">Maternity</Badge>;
      case 'paternity':
        return <Badge className="bg-purple-500">Paternity</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            HR Leave Management
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-32">
          <Loader className="h-6 w-6 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          HR Leave Management
        </CardTitle>
      </CardHeader>
      <CardContent>
        {leaveRequests && leaveRequests.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Leave Type</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Days</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leaveRequests.map((request) => {
                const startDate = new Date(request.start_date);
                const endDate = new Date(request.end_date);
                const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
                
                return (
                  <TableRow key={request.id}>
                    <TableCell className="font-medium">
                      {request.user_id.slice(0, 8)}...
                    </TableCell>
                    <TableCell>{getLeaveTypeBadge(request.leave_type)}</TableCell>
                    <TableCell>{startDate.toLocaleDateString()}</TableCell>
                    <TableCell>{endDate.toLocaleDateString()}</TableCell>
                    <TableCell>{days} days</TableCell>
                    <TableCell className="max-w-xs truncate">{request.reason}</TableCell>
                    <TableCell>{getStatusBadge(request.status)}</TableCell>
                    <TableCell>{new Date(request.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>
                      {request.status === 'pending' && (
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleApprove(request.id)}
                            disabled={approveLeaveRequest.isPending}
                            className="text-green-600 hover:text-green-700"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleReject(request.id)}
                            disabled={rejectLeaveRequest.isPending}
                            className="text-red-600 hover:text-red-700"
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                      {request.status !== 'pending' && (
                        <span className="text-muted-foreground text-sm">No actions</span>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No leave requests found
          </div>
        )}
      </CardContent>
    </Card>
  );
};

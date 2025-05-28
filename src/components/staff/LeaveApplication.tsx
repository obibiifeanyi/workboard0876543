
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { useLeaveRequests } from "@/hooks/useLeaveRequests";
import { format } from "date-fns";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface LeaveApplicationProps {
  date: Date | undefined;
  onDateSelect: (date: Date | undefined) => void;
  onLeaveRequest: () => void;
}

export const LeaveApplication = ({
  date,
  onDateSelect,
  onLeaveRequest,
}: LeaveApplicationProps) => {
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [leaveType, setLeaveType] = useState<string>("");
  const [reason, setReason] = useState<string>("");
  
  const { submitLeaveRequest, myLeaveRequests, isLoadingMyRequests } = useLeaveRequests();

  const handleSubmit = async () => {
    if (!date || !endDate || !leaveType || !reason) {
      return;
    }

    await submitLeaveRequest.mutateAsync({
      start_date: format(date, 'yyyy-MM-dd'),
      end_date: format(endDate, 'yyyy-MM-dd'),
      leave_type: leaveType,
      reason: reason,
    });

    // Reset form
    onDateSelect(undefined);
    setEndDate(undefined);
    setLeaveType("");
    setReason("");
    onLeaveRequest();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100';
      default:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100';
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-none shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl md:text-2xl">Apply for Leave</CardTitle>
        </CardHeader>
        <CardContent className="p-4 md:p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="start-date">Start Date</Label>
                <div className="w-full max-w-sm mx-auto md:max-w-none">
                  <ScrollArea className="h-[350px] md:h-auto rounded-md border">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={onDateSelect}
                      className="rounded-md"
                      disabled={(date) => date < new Date()}
                    />
                  </ScrollArea>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="end-date">End Date</Label>
                <div className="w-full max-w-sm mx-auto md:max-w-none">
                  <ScrollArea className="h-[350px] md:h-auto rounded-md border">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      className="rounded-md"
                      disabled={(date) => date < (date || new Date())}
                    />
                  </ScrollArea>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div>
              <Label htmlFor="leave-type">Leave Type</Label>
              <Select value={leaveType} onValueChange={setLeaveType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select leave type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="annual">Annual Leave</SelectItem>
                  <SelectItem value="sick">Sick Leave</SelectItem>
                  <SelectItem value="emergency">Emergency Leave</SelectItem>
                  <SelectItem value="maternity">Maternity Leave</SelectItem>
                  <SelectItem value="paternity">Paternity Leave</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Card className="border border-primary/10">
              <CardHeader>
                <CardTitle className="text-lg">Leave Balance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="space-y-2">
                    <p className="text-3xl font-bold text-primary">12</p>
                    <p className="text-sm text-muted-foreground">Annual</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-3xl font-bold text-primary">5</p>
                    <p className="text-sm text-muted-foreground">Sick</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-3xl font-bold text-primary">3</p>
                    <p className="text-sm text-muted-foreground">Other</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-4">
            <Label htmlFor="reason">Reason</Label>
            <Textarea
              id="reason"
              placeholder="Please provide a reason for your leave request..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="mt-2"
            />
          </div>

          <Button 
            onClick={handleSubmit} 
            className="w-full mt-6"
            disabled={!date || !endDate || !leaveType || !reason || submitLeaveRequest.isPending}
          >
            {submitLeaveRequest.isPending ? "Submitting..." : "Submit Leave Request"}
          </Button>
        </CardContent>
      </Card>

      <Card className="border-none shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl">My Leave Requests</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingMyRequests ? (
            <p>Loading...</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Start Date</TableHead>
                  <TableHead>End Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Submitted</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {myLeaveRequests?.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell>{format(new Date(request.start_date), 'MMM dd, yyyy')}</TableCell>
                    <TableCell>{format(new Date(request.end_date), 'MMM dd, yyyy')}</TableCell>
                    <TableCell className="capitalize">{request.leave_type}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(request.status)}`}>
                        {request.status}
                      </span>
                    </TableCell>
                    <TableCell>{format(new Date(request.created_at), 'MMM dd, yyyy')}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

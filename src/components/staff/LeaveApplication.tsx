import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { useToast } from "@/hooks/use-toast";

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
  return (
    <Card>
      <CardHeader>
        <CardTitle>Apply for Leave</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0">
          <div className="flex-1">
            <Calendar
              mode="single"
              selected={date}
              onSelect={onDateSelect}
              className="rounded-md border"
            />
          </div>
          <Card className="flex-1">
            <CardHeader>
              <CardTitle className="text-sm">Leave Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold">12</p>
                  <p className="text-xs text-muted-foreground">Annual</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">5</p>
                  <p className="text-xs text-muted-foreground">Sick</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">3</p>
                  <p className="text-xs text-muted-foreground">Other</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <Button onClick={onLeaveRequest} className="w-full">
          Submit Leave Request
        </Button>
      </CardContent>
    </Card>
  );
};
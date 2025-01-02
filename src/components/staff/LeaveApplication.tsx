import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { ScrollArea } from "@/components/ui/scroll-area";

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
    <Card className="border-none shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl md:text-2xl">Apply for Leave</CardTitle>
      </CardHeader>
      <CardContent className="p-4 md:p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="w-full max-w-sm mx-auto md:max-w-none">
            <ScrollArea className="h-[350px] md:h-auto rounded-md border">
              <Calendar
                mode="single"
                selected={date}
                onSelect={onDateSelect}
                className="rounded-md"
              />
            </ScrollArea>
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

        <Button 
          onClick={onLeaveRequest} 
          className="w-full mt-6"
        >
          Submit Leave Request
        </Button>
      </CardContent>
    </Card>
  );
};
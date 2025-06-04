
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Calendar as CalendarIcon, Plus } from "lucide-react";
import { useStaffOperations } from "@/hooks/useStaffOperations";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface LeaveApplicationProps {
  date?: Date;
  onDateSelect?: (date: Date | undefined) => void;
  onLeaveRequest?: () => void;
}

export const LeaveApplication = ({ onLeaveRequest }: LeaveApplicationProps) => {
  const { createLeaveRequest } = useStaffOperations();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    leave_type: '',
    start_date: '',
    end_date: '',
    reason: '',
  });

  const handleSubmit = () => {
    setErrorMessage(null);
    setIsSubmitting(true);
    
    // Validate required fields
    if (!formData.leave_type || !formData.start_date || !formData.end_date) {
      setErrorMessage('Please fill in all required fields');
      setIsSubmitting(false);
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      createLeaveRequest.mutate(formData, {
        onSuccess: () => {
          setIsSubmitting(false);
          setIsDialogOpen(false);
          setFormData({
            leave_type: '',
            start_date: '',
            end_date: '',
            reason: '',
          });
          toast({
            title: "Success",
            description: "Leave request submitted successfully.",
          });
          onLeaveRequest?.();
        },
        onError: (error: any) => {
          setIsSubmitting(false);
          setErrorMessage(error?.message || 'Failed to submit leave request');
          toast({
            title: 'Error',
            description: error?.message || 'Failed to submit leave request.',
            variant: 'destructive',
          });
        }
      });
    } catch (error: any) {
      setIsSubmitting(false);
      setErrorMessage(error?.message || 'Failed to submit leave request');
      toast({
        title: 'Error',
        description: error?.message || 'Failed to submit leave request.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card className="bg-black/10 dark:bg-white/5 backdrop-blur-lg border-none">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg font-medium">
            <CalendarIcon className="h-5 w-5 text-primary" />
            Leave Application
          </CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Apply for Leave
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Apply for Leave</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="leave-type">Leave Type *</Label>
                  <Select 
                    value={formData.leave_type} 
                    onValueChange={(value) => setFormData({ ...formData, leave_type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select leave type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="annual">Annual Leave</SelectItem>
                      <SelectItem value="sick">Sick Leave</SelectItem>
                      <SelectItem value="emergency">Emergency Leave</SelectItem>
                      <SelectItem value="maternity">Maternity Leave</SelectItem>
                      <SelectItem value="paternity">Paternity Leave</SelectItem>
                      <SelectItem value="compassionate">Compassionate Leave</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="start-date">Start Date *</Label>
                    <Input
                      id="start-date"
                      type="date"
                      value={formData.start_date}
                      onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="end-date">End Date *</Label>
                    <Input
                      id="end-date"
                      type="date"
                      value={formData.end_date}
                      onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reason">Reason</Label>
                  <Textarea
                    id="reason"
                    value={formData.reason}
                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                    placeholder="Reason for leave request..."
                  />
                </div>

                <Button 
                  onClick={handleSubmit} 
                  className="w-full" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit Leave Request"}
                </Button>
                {errorMessage && (
                  <p className="text-red-500 text-xs mt-2">{errorMessage}</p>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8 text-muted-foreground">
          <CalendarIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Click "Apply for Leave" to submit a new leave request.</p>
        </div>
      </CardContent>
    </Card>
  );
};

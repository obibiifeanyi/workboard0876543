import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useStaffOperations } from "@/hooks/useStaffOperations";

interface WeeklyReportForm {
  week_start_date: string;
  week_end_date: string;
  accomplishments: string;
  challenges: string;
  next_week_goals: string;
  hours_worked: number;
  projects_worked_on: string[];
}

export const WeeklyReport = () => {
  const { createWeeklyReport } = useStaffOperations();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState<WeeklyReportForm>({
    week_start_date: new Date().toISOString().split('T')[0],
    week_end_date: new Date().toISOString().split('T')[0],
    accomplishments: '',
    challenges: '',
    next_week_goals: '',
    hours_worked: 0,
    projects_worked_on: [],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);
    
    // Validate required fields
    if (!formData.week_start_date || !formData.week_end_date || !formData.accomplishments) {
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
      createWeeklyReport.mutate({
        week_start_date: formData.week_start_date,
        week_end_date: formData.week_end_date,
        accomplishments: formData.accomplishments,
        challenges: formData.challenges,
        next_week_goals: formData.next_week_goals,
        hours_worked: formData.hours_worked,
        projects_worked_on: formData.projects_worked_on,
        status: 'draft' // Add default status
      }, {
        onSuccess: () => {
          setIsSuccess(true);
          setIsSubmitting(false);
          toast({
            title: "Success",
            description: "Weekly report submitted successfully.",
          });
          
          // Reset form after successful submission
          setFormData({
            week_start_date: new Date().toISOString().split('T')[0],
            week_end_date: new Date().toISOString().split('T')[0],
            accomplishments: '',
            challenges: '',
            next_week_goals: '',
            hours_worked: 0,
            projects_worked_on: [],
          });
          
          // Reset success state after a delay
          setTimeout(() => {
            setIsSuccess(false);
          }, 3000);
        },
        onError: (error: any) => {
          setIsSubmitting(false);
          setErrorMessage(error?.message || 'Failed to submit report');
          toast({
            title: 'Error',
            description: error?.message || 'Failed to submit weekly report.',
            variant: 'destructive',
          });
        }
      });
    } catch (error: any) {
      setIsSubmitting(false);
      setErrorMessage(error?.message || 'Failed to submit report');
      toast({
        title: 'Error',
        description: error?.message || 'Failed to submit weekly report.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Submit Weekly Report</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="week_start_date">Week Start Date</Label>
            <Input
              type="date"
              id="week_start_date"
              value={formData.week_start_date}
              onChange={(e) => setFormData({ ...formData, week_start_date: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="week_end_date">Week End Date</Label>
            <Input
              type="date"
              id="week_end_date"
              value={formData.week_end_date}
              onChange={(e) => setFormData({ ...formData, week_end_date: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="accomplishments">Accomplishments</Label>
            <Textarea
              id="accomplishments"
              placeholder="List your accomplishments this week"
              value={formData.accomplishments}
              onChange={(e) => setFormData({ ...formData, accomplishments: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="challenges">Challenges</Label>
            <Textarea
              id="challenges"
              placeholder="List any challenges you faced"
              value={formData.challenges}
              onChange={(e) => setFormData({ ...formData, challenges: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="next_week_goals">Next Week Goals</Label>
            <Textarea
              id="next_week_goals"
              placeholder="List your goals for next week"
              value={formData.next_week_goals}
              onChange={(e) => setFormData({ ...formData, next_week_goals: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="hours_worked">Hours Worked</Label>
            <Input
              type="number"
              id="hours_worked"
              placeholder="Enter total hours worked"
              value={formData.hours_worked}
              onChange={(e) => setFormData({ ...formData, hours_worked: Number(e.target.value) })}
            />
          </div>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit Report'}
          </Button>
          {errorMessage && (
            <p className="text-red-500 text-xs mt-2">{errorMessage}</p>
          )}
          {isSuccess && (
            <p className="text-green-600 text-xs mt-2">Report submitted successfully!</p>
          )}
        </form>
      </CardContent>
    </Card>
  );
};

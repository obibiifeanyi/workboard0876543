
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { FileText, Plus, Calendar, Clock } from "lucide-react";
import { useStaffOperations } from "@/hooks/useStaffOperations";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";

export const WeeklyReport = () => {
  const { useWeeklyReports, createWeeklyReport } = useStaffOperations();
  const { data: reports = [], isLoading } = useWeeklyReports();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newReport, setNewReport] = useState({
    week_start_date: '',
    week_end_date: '',
    accomplishments: '',
    challenges: '',
    next_week_goals: '',
    hours_worked: 0,
    projects_worked_on: [] as string[],
  });

  const handleCreateReport = () => {
    if (!newReport.week_start_date || !newReport.week_end_date || !newReport.accomplishments) {
      return;
    }

    createWeeklyReport.mutate(newReport, {
      onSuccess: () => {
        setIsCreateDialogOpen(false);
        setNewReport({
          week_start_date: '',
          week_end_date: '',
          accomplishments: '',
          challenges: '',
          next_week_goals: '',
          hours_worked: 0,
          projects_worked_on: [],
        });
      },
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'submitted': return 'bg-blue-100 text-blue-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return <div>Loading weekly reports...</div>;
  }

  return (
    <Card className="bg-black/10 dark:bg-white/5 backdrop-blur-lg border-none">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg font-medium">
            <FileText className="h-5 w-5 text-primary" />
            Weekly Reports
          </CardTitle>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Report
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create Weekly Report</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="start-date">Week Start Date *</Label>
                    <Input
                      id="start-date"
                      type="date"
                      value={newReport.week_start_date}
                      onChange={(e) => setNewReport({ ...newReport, week_start_date: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="end-date">Week End Date *</Label>
                    <Input
                      id="end-date"
                      type="date"
                      value={newReport.week_end_date}
                      onChange={(e) => setNewReport({ ...newReport, week_end_date: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hours">Hours Worked</Label>
                  <Input
                    id="hours"
                    type="number"
                    value={newReport.hours_worked}
                    onChange={(e) => setNewReport({ ...newReport, hours_worked: Number(e.target.value) })}
                    placeholder="40"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="accomplishments">Accomplishments *</Label>
                  <Textarea
                    id="accomplishments"
                    value={newReport.accomplishments}
                    onChange={(e) => setNewReport({ ...newReport, accomplishments: e.target.value })}
                    placeholder="What did you accomplish this week?"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="challenges">Challenges</Label>
                  <Textarea
                    id="challenges"
                    value={newReport.challenges}
                    onChange={(e) => setNewReport({ ...newReport, challenges: e.target.value })}
                    placeholder="What challenges did you face?"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="goals">Next Week Goals</Label>
                  <Textarea
                    id="goals"
                    value={newReport.next_week_goals}
                    onChange={(e) => setNewReport({ ...newReport, next_week_goals: e.target.value })}
                    placeholder="What are your goals for next week?"
                  />
                </div>

                <Button 
                  onClick={handleCreateReport} 
                  className="w-full" 
                  disabled={createWeeklyReport.isPending}
                >
                  {createWeeklyReport.isPending ? "Creating..." : "Create Report"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      
      <CardContent>
        {reports.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No weekly reports yet. Create your first report to get started.
          </div>
        ) : (
          <div className="space-y-4">
            {reports.map((report) => (
              <Card key={report.id} className="glass-card">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <h4 className="font-medium">
                          Week of {format(new Date(report.week_start_date), 'MMM dd')} - {format(new Date(report.week_end_date), 'MMM dd, yyyy')}
                        </h4>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{report.hours_worked} hours</span>
                          </div>
                          {report.submitted_at && (
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              <span>Submitted {format(new Date(report.submitted_at), 'MMM dd')}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <Badge className={getStatusColor(report.status)}>
                        {report.status}
                      </Badge>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div>
                        <strong>Accomplishments:</strong>
                        <p className="mt-1">{report.accomplishments}</p>
                      </div>
                      
                      {report.challenges && (
                        <div>
                          <strong>Challenges:</strong>
                          <p className="mt-1">{report.challenges}</p>
                        </div>
                      )}
                      
                      {report.next_week_goals && (
                        <div>
                          <strong>Next Week Goals:</strong>
                          <p className="mt-1">{report.next_week_goals}</p>
                        </div>
                      )}
                    </div>

                    {report.review_comments && (
                      <div className="mt-3 p-3 bg-muted/50 rounded">
                        <p className="text-sm">
                          <strong>Review Comments:</strong> {report.review_comments}
                        </p>
                        {report.reviewer && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Reviewed by: {report.reviewer.full_name}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};


import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, CheckCircle, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useStaffOperations } from "@/hooks/useStaffOperations";
import { Badge } from "@/components/ui/badge";
import { format, startOfWeek, endOfWeek } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const WeeklyReport = () => {
  const { useWeeklyReports, createWeeklyReport, updateWeeklyReport } = useStaffOperations();
  const { data: reports = [], isLoading } = useWeeklyReports();
  const { toast } = useToast();
  
  const [selectedWeek, setSelectedWeek] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [reportForm, setReportForm] = useState({
    accomplishments: '',
    challenges: '',
    next_week_goals: '',
    hours_worked: 0,
    projects_worked_on: [] as string[],
    projectInput: '',
  });

  const weekStart = startOfWeek(new Date(selectedWeek), { weekStartsOn: 1 });
  const weekEnd = endOfWeek(new Date(selectedWeek), { weekStartsOn: 1 });
  
  const existingReport = reports.find(report => 
    report.week_start_date === format(weekStart, 'yyyy-MM-dd')
  );

  const handleSubmitReport = () => {
    if (!reportForm.accomplishments) {
      toast({
        title: "Missing Information",
        description: "Please provide accomplishments for the week.",
        variant: "destructive",
      });
      return;
    }

    const reportData = {
      week_start_date: format(weekStart, 'yyyy-MM-dd'),
      week_end_date: format(weekEnd, 'yyyy-MM-dd'),
      accomplishments: reportForm.accomplishments,
      challenges: reportForm.challenges,
      next_week_goals: reportForm.next_week_goals,
      hours_worked: reportForm.hours_worked,
      projects_worked_on: reportForm.projects_worked_on,
      status: 'submitted' as const,
      submitted_at: new Date().toISOString(),
    };

    if (existingReport) {
      updateWeeklyReport.mutate({ id: existingReport.id, ...reportData });
    } else {
      createWeeklyReport.mutate(reportData);
    }
  };

  const addProject = () => {
    if (reportForm.projectInput.trim()) {
      setReportForm({
        ...reportForm,
        projects_worked_on: [...reportForm.projects_worked_on, reportForm.projectInput.trim()],
        projectInput: '',
      });
    }
  };

  const removeProject = (index: number) => {
    setReportForm({
      ...reportForm,
      projects_worked_on: reportForm.projects_worked_on.filter((_, i) => i !== index),
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'submitted': return 'bg-blue-100 text-blue-800';
      case 'reviewed': return 'bg-purple-100 text-purple-800';
      case 'approved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return <div>Loading weekly reports...</div>;
  }

  return (
    <div className="space-y-6">
      <Card className="bg-black/10 dark:bg-white/5 backdrop-blur-lg border-none">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-medium">
            <Calendar className="h-5 w-5 text-primary" />
            Weekly Report
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="week">Select Week</Label>
              <Input
                id="week"
                type="date"
                value={selectedWeek}
                onChange={(e) => setSelectedWeek(e.target.value)}
                className="w-full"
              />
              <p className="text-sm text-muted-foreground">
                Week: {format(weekStart, 'MMM dd')} - {format(weekEnd, 'MMM dd, yyyy')}
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="hours">Hours Worked</Label>
              <Input
                id="hours"
                type="number"
                value={reportForm.hours_worked}
                onChange={(e) => setReportForm({ ...reportForm, hours_worked: Number(e.target.value) })}
                placeholder="40"
                min="0"
                max="168"
              />
            </div>
          </div>

          {existingReport && (
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Existing Report Found</p>
                  <p className="text-sm text-muted-foreground">
                    Status: <Badge className={getStatusColor(existingReport.status)}>
                      {existingReport.status}
                    </Badge>
                  </p>
                </div>
                {existingReport.status !== 'draft' && (
                  <Badge variant="outline">Read Only</Badge>
                )}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="accomplishments">Weekly Accomplishments *</Label>
            <Textarea
              id="accomplishments"
              value={reportForm.accomplishments}
              onChange={(e) => setReportForm({ ...reportForm, accomplishments: e.target.value })}
              placeholder="Describe what you accomplished this week..."
              className="min-h-[100px]"
              disabled={!!existingReport && existingReport.status !== 'draft'}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="challenges">Challenges Faced</Label>
            <Textarea
              id="challenges"
              value={reportForm.challenges}
              onChange={(e) => setReportForm({ ...reportForm, challenges: e.target.value })}
              placeholder="Describe any challenges or blockers..."
              className="min-h-[80px]"
              disabled={!!existingReport && existingReport.status !== 'draft'}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="goals">Next Week Goals</Label>
            <Textarea
              id="goals"
              value={reportForm.next_week_goals}
              onChange={(e) => setReportForm({ ...reportForm, next_week_goals: e.target.value })}
              placeholder="What do you plan to accomplish next week?"
              className="min-h-[80px]"
              disabled={!!existingReport && existingReport.status !== 'draft'}
            />
          </div>

          <div className="space-y-2">
            <Label>Projects Worked On</Label>
            <div className="flex gap-2">
              <Input
                value={reportForm.projectInput}
                onChange={(e) => setReportForm({ ...reportForm, projectInput: e.target.value })}
                placeholder="Project name"
                disabled={!!existingReport && existingReport.status !== 'draft'}
                onKeyPress={(e) => e.key === 'Enter' && addProject()}
              />
              <Button 
                type="button" 
                onClick={addProject}
                disabled={!!existingReport && existingReport.status !== 'draft'}
              >
                Add
              </Button>
            </div>
            {reportForm.projects_worked_on.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {reportForm.projects_worked_on.map((project, index) => (
                  <Badge 
                    key={index} 
                    variant="secondary"
                    className="cursor-pointer"
                    onClick={() => (!existingReport || existingReport.status === 'draft') ? removeProject(index) : undefined}
                  >
                    {project} {(!existingReport || existingReport.status === 'draft') && '×'}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {(!existingReport || existingReport.status === 'draft') && (
            <Button 
              onClick={handleSubmitReport} 
              className="w-full md:w-auto"
              disabled={createWeeklyReport.isPending || updateWeeklyReport.isPending}
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              {existingReport ? 'Update Report' : 'Submit Weekly Report'}
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Recent Reports */}
      <Card className="bg-black/10 dark:bg-white/5 backdrop-blur-lg border-none">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-medium">
            <FileText className="h-5 w-5 text-primary" />
            Recent Reports
          </CardTitle>
        </CardHeader>
        <CardContent>
          {reports.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">No reports submitted yet.</p>
          ) : (
            <div className="space-y-3">
              {reports.slice(0, 5).map((report) => (
                <div key={report.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div>
                    <p className="font-medium">
                      Week of {format(new Date(report.week_start_date), 'MMM dd, yyyy')}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {report.hours_worked} hours worked
                    </p>
                  </div>
                  <Badge className={getStatusColor(report.status)}>
                    {report.status}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};


import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileText, Plus, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const ProjectReportManagement = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    project_id: "none",
    report_title: "",
    report_type: "progress",
    report_content: "",
    progress_percentage: "",
    budget_used: "",
    budget_remaining: "",
    issues_encountered: "",
    next_steps: "",
  });

  const { data: projects } = useQuery({
    queryKey: ['user-projects'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Authentication required");

      const { data, error } = await supabase
        .from('project_members')
        .select(`
          project_id,
          projects!inner(id, name)
        `)
        .eq('user_id', user.id);

      if (error) throw error;
      return data.map(pm => pm.projects);
    },
  });

  const { data: reports, isLoading } = useQuery({
    queryKey: ['project-reports'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('project_reports')
        .select(`
          *,
          projects(name),
          profiles!project_reports_created_by_fkey(full_name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const createReport = useMutation({
    mutationFn: async (data: typeof formData) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Authentication required");

      const { error } = await supabase
        .from('project_reports')
        .insert([{
          project_id: data.project_id === "none" ? null : data.project_id,
          report_title: data.report_title,
          report_type: data.report_type,
          report_content: data.report_content,
          progress_percentage: data.progress_percentage ? parseFloat(data.progress_percentage) : null,
          budget_used: data.budget_used ? parseFloat(data.budget_used) : 0,
          budget_remaining: data.budget_remaining ? parseFloat(data.budget_remaining) : 0,
          issues_encountered: data.issues_encountered || null,
          next_steps: data.next_steps || null,
          created_by: user.id,
        }]);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-reports'] });
      setIsDialogOpen(false);
      setFormData({
        project_id: "none",
        report_title: "",
        report_type: "progress",
        report_content: "",
        progress_percentage: "",
        budget_used: "",
        budget_remaining: "",
        issues_encountered: "",
        next_steps: "",
      });
      toast({
        title: "Success",
        description: "Project report created successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create project report",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createReport.mutate(formData);
  };

  const getStatusBadge = (status: string) => {
    const statusColors = {
      pending: 'bg-yellow-500',
      approved: 'bg-green-500',
      rejected: 'bg-red-500',
      needs_revision: 'bg-orange-500'
    };
    
    return (
      <Badge className={`${statusColors[status as keyof typeof statusColors] || 'bg-gray-500'} text-white`}>
        {status.replace('_', ' ').charAt(0).toUpperCase() + status.replace('_', ' ').slice(1)}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold font-unica">Project Reports</h2>
          <p className="text-muted-foreground">Create and manage project progress reports</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="button-enhanced">
              <Plus className="h-4 w-4 mr-2" />
              Create Report
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create Project Report</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="project_id">Project</Label>
                <Select value={formData.project_id} onValueChange={(value) => setFormData(prev => ({ ...prev, project_id: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select project" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No project selected</SelectItem>
                    {projects?.map((project) => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="report_title">Report Title</Label>
                <Input
                  id="report_title"
                  value={formData.report_title}
                  onChange={(e) => setFormData(prev => ({ ...prev, report_title: e.target.value }))}
                  required
                />
              </div>

              <div>
                <Label htmlFor="report_type">Report Type</Label>
                <Select value={formData.report_type} onValueChange={(value) => setFormData(prev => ({ ...prev, report_type: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select report type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="progress">Progress Report</SelectItem>
                    <SelectItem value="financial">Financial Report</SelectItem>
                    <SelectItem value="completion">Completion Report</SelectItem>
                    <SelectItem value="milestone">Milestone Report</SelectItem>
                    <SelectItem value="issue">Issue Report</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="report_content">Report Content</Label>
                <Textarea
                  id="report_content"
                  value={formData.report_content}
                  onChange={(e) => setFormData(prev => ({ ...prev, report_content: e.target.value }))}
                  required
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="progress_percentage">Progress (%)</Label>
                  <Input
                    id="progress_percentage"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.progress_percentage}
                    onChange={(e) => setFormData(prev => ({ ...prev, progress_percentage: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="budget_used">Budget Used ($)</Label>
                  <Input
                    id="budget_used"
                    type="number"
                    step="0.01"
                    value={formData.budget_used}
                    onChange={(e) => setFormData(prev => ({ ...prev, budget_used: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="budget_remaining">Budget Remaining ($)</Label>
                  <Input
                    id="budget_remaining"
                    type="number"
                    step="0.01"
                    value={formData.budget_remaining}
                    onChange={(e) => setFormData(prev => ({ ...prev, budget_remaining: e.target.value }))}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="issues_encountered">Issues Encountered</Label>
                <Textarea
                  id="issues_encountered"
                  value={formData.issues_encountered}
                  onChange={(e) => setFormData(prev => ({ ...prev, issues_encountered: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="next_steps">Next Steps</Label>
                <Textarea
                  id="next_steps"
                  value={formData.next_steps}
                  onChange={(e) => setFormData(prev => ({ ...prev, next_steps: e.target.value }))}
                />
              </div>

              <Button type="submit" disabled={createReport.isPending}>
                {createReport.isPending ? "Creating..." : "Create Report"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="enhanced-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-unica">
            <FileText className="h-5 w-5 text-primary" />
            Recent Reports
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : reports && reports.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Project</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created By</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell className="font-medium">{report.report_title}</TableCell>
                    <TableCell>{report.projects?.name}</TableCell>
                    <TableCell className="capitalize">{report.report_type}</TableCell>
                    <TableCell>
                      {report.progress_percentage ? (
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4" />
                          {report.progress_percentage}%
                        </div>
                      ) : 'N/A'}
                    </TableCell>
                    <TableCell>{getStatusBadge(report.review_status)}</TableCell>
                    <TableCell>{report.profiles?.full_name}</TableCell>
                    <TableCell>{new Date(report.created_at).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No reports found. Create your first project report to get started.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

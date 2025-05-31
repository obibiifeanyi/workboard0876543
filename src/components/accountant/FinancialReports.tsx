
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PieChart, Download, Plus, Calendar, TrendingUp } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

export const FinancialReports = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [newReport, setNewReport] = useState({
    name: "",
    type: "",
    period_start: "",
    period_end: ""
  });

  const { data: reports, isLoading } = useQuery({
    queryKey: ['financial_reports'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('financial_reports')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const createReportMutation = useMutation({
    mutationFn: async (reportData: typeof newReport) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('financial_reports')
        .insert({
          report_name: reportData.name,
          report_type: reportData.type,
          period_start: reportData.period_start,
          period_end: reportData.period_end,
          generated_by: user.id,
          status: 'draft'
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['financial_reports'] });
      setNewReport({ name: "", type: "", period_start: "", period_end: "" });
      toast({
        title: "Success",
        description: "Financial report created successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create report",
        variant: "destructive",
      });
    },
  });

  const handleCreateReport = () => {
    if (!newReport.name || !newReport.type || !newReport.period_start || !newReport.period_end) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    createReportMutation.mutate(newReport);
  };

  if (isLoading) {
    return (
      <Card className="bg-black/10 dark:bg-white/5 backdrop-blur-lg border-none">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-medium">
            <PieChart className="h-5 w-5 text-primary" />
            Financial Reports
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">Loading reports...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-black/10 dark:bg-white/5 backdrop-blur-lg border-none">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg font-medium">
          <PieChart className="h-5 w-5 text-primary" />
          Financial Reports
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Create New Report Form */}
          <div className="p-4 bg-white/5 rounded-lg border border-primary/20">
            <h3 className="font-medium mb-4 flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Create New Report
            </h3>
            <div className="grid gap-4 md:grid-cols-2">
              <Input
                placeholder="Report Name"
                value={newReport.name}
                onChange={(e) => setNewReport(prev => ({ ...prev, name: e.target.value }))}
              />
              <Select value={newReport.type} onValueChange={(value) => setNewReport(prev => ({ ...prev, type: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Report Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="income_statement">Income Statement</SelectItem>
                  <SelectItem value="balance_sheet">Balance Sheet</SelectItem>
                  <SelectItem value="cash_flow">Cash Flow</SelectItem>
                  <SelectItem value="expense_report">Expense Report</SelectItem>
                  <SelectItem value="custom">Custom Report</SelectItem>
                </SelectContent>
              </Select>
              <div>
                <label className="text-sm text-muted-foreground">Start Date</label>
                <Input
                  type="date"
                  value={newReport.period_start}
                  onChange={(e) => setNewReport(prev => ({ ...prev, period_start: e.target.value }))}
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground">End Date</label>
                <Input
                  type="date"
                  value={newReport.period_end}
                  onChange={(e) => setNewReport(prev => ({ ...prev, period_end: e.target.value }))}
                />
              </div>
            </div>
            <Button 
              onClick={handleCreateReport} 
              className="mt-4"
              disabled={createReportMutation.isPending}
            >
              {createReportMutation.isPending ? 'Creating...' : 'Create Report'}
            </Button>
          </div>

          {/* Reports List */}
          <div className="space-y-4">
            <h3 className="font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Recent Reports
            </h3>
            {!reports?.length ? (
              <div className="text-center text-muted-foreground py-8">
                No financial reports found. Create your first report above.
              </div>
            ) : (
              reports.map((report) => (
                <Card key={report.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{report.report_name}</h4>
                      <p className="text-sm text-muted-foreground capitalize">
                        {report.report_type.replace('_', ' ')} • {report.status}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(report.period_start), 'MMM dd, yyyy')} - {format(new Date(report.period_end), 'MMM dd, yyyy')}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Calendar className="h-4 w-4 mr-2" />
                        View
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Export
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

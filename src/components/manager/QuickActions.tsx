
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Users, BarChart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export const QuickActions = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const [isCreatingReport, setIsCreatingReport] = useState(false);
  const [reportData, setReportData] = useState({
    title: "",
    content: "",
    type: "project"
  });

  const handleCreateReport = async () => {
    setIsCreatingReport(true);
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from('site_reports')
        .insert({
          title: reportData.title,
          description: reportData.content,
          report_type: reportData.type,
          reported_by: user.user.id,
          report_date: new Date().toISOString(),
          status: 'draft'
        });

      if (error) throw error;

      toast({
        title: "Report Created",
        description: "Your report has been created successfully",
      });

      setReportData({ title: "", content: "", type: "project" });
      setIsReportDialogOpen(false);
    } catch (error) {
      console.error('Error creating report:', error);
      toast({
        title: "Error",
        description: "Failed to create report",
        variant: "destructive",
      });
    } finally {
      setIsCreatingReport(false);
    }
  };

  const handleTeamOverview = () => {
    // Navigate to team tab in current dashboard
    const event = new CustomEvent('switchTab', { detail: 'team' });
    window.dispatchEvent(event);
    toast({
      title: "Team Overview",
      description: "Switched to team overview section",
    });
  };

  const handleViewAnalytics = async () => {
    try {
      // Fetch recent analytics data
      const { data: reportsData } = await supabase
        .from('site_reports')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      const { data: projectsData } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      toast({
        title: "Analytics Data",
        description: `Found ${reportsData?.length || 0} recent reports and ${projectsData?.length || 0} active projects`,
      });

      // You could navigate to a dedicated analytics page here
      // navigate('/analytics');
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast({
        title: "Error",
        description: "Failed to fetch analytics data",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="glass-card p-6 bg-gradient-to-br from-manager-primary/10 to-manager-secondary/5">
      <CardHeader className="p-0 pb-4">
        <CardTitle className="text-lg font-semibold text-manager-primary">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="space-y-2">
          <Dialog open={isReportDialogOpen} onOpenChange={setIsReportDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full justify-start rounded-[30px]" variant="ghost">
                <FileText className="mr-2 h-4 w-4 text-manager-secondary" />
                Create New Report
              </Button>
            </DialogTrigger>
            <DialogContent className="rounded-[30px]">
              <DialogHeader>
                <DialogTitle>Create New Report</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="reportTitle">Report Title</Label>
                  <Input
                    id="reportTitle"
                    value={reportData.title}
                    onChange={(e) => setReportData({ ...reportData, title: e.target.value })}
                    className="rounded-[30px]"
                    placeholder="Enter report title"
                  />
                </div>
                <div>
                  <Label htmlFor="reportContent">Report Content</Label>
                  <Textarea
                    id="reportContent"
                    value={reportData.content}
                    onChange={(e) => setReportData({ ...reportData, content: e.target.value })}
                    className="rounded-[30px]"
                    placeholder="Enter report details"
                    rows={6}
                  />
                </div>
                <Button 
                  onClick={handleCreateReport} 
                  disabled={isCreatingReport || !reportData.title || !reportData.content}
                  className="w-full rounded-[30px]"
                >
                  {isCreatingReport ? "Creating..." : "Create Report"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Button 
            className="w-full justify-start rounded-[30px]" 
            variant="ghost"
            onClick={handleTeamOverview}
          >
            <Users className="mr-2 h-4 w-4 text-manager-secondary" />
            Team Overview
          </Button>

          <Button 
            className="w-full justify-start rounded-[30px]" 
            variant="ghost"
            onClick={handleViewAnalytics}
          >
            <BarChart className="mr-2 h-4 w-4 text-manager-secondary" />
            View Analytics
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

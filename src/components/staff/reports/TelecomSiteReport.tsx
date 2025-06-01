import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Radio, Plus, MapPin, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
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
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface SiteReport {
  id: string;
  site_id?: string;
  title: string;
  description?: string;
  report_type: string;
  status: string;
  report_date: string;
  data?: any;
  created_at: string;
  updated_at: string;
  site?: {
    name: string;
    location: string;
  };
  reported_by?: {
    full_name: string;
  };
}

export const TelecomSiteReport = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newReport, setNewReport] = useState({
    site_id: '',
    title: '',
    description: '',
    report_type: 'maintenance',
    signal_strength: '',
    equipment_status: '',
    power_status: '',
    connectivity_issues: '',
    maintenance_performed: '',
    recommendations: '',
    photos: [] as string[],
  });

  // Fetch site reports
  const { data: reports = [], isLoading } = useQuery({
    queryKey: ['site-reports'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_reports')
        .select(`
          *,
          site:telecom_sites!site_id(name, location)
        `)
        .order('report_date', { ascending: false });
      
      if (error) throw error;
      return data.map(item => ({
        ...item,
        reported_by: { full_name: 'User' }, // Fallback for now
      })) as SiteReport[];
    },
  });

  // Fetch telecom sites for dropdown
  const { data: sites = [] } = useQuery({
    queryKey: ['telecom-sites'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('telecom_sites')
        .select('id, name, location')
        .order('name');
      
      if (error) throw error;
      return data;
    },
  });

  // Create site report
  const createReport = useMutation({
    mutationFn: async (reportData: any) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('site_reports')
        .insert({
          ...reportData,
          reported_by: user.id,
          report_date: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['site-reports'] });
      toast({
        title: "Success",
        description: "Site report created successfully",
      });
      setIsCreateDialogOpen(false);
      setNewReport({
        site_id: '',
        title: '',
        description: '',
        report_type: 'maintenance',
        signal_strength: '',
        equipment_status: '',
        power_status: '',
        connectivity_issues: '',
        maintenance_performed: '',
        recommendations: '',
        photos: [],
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to create report: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const handleSubmitReport = () => {
    if (!newReport.title || !newReport.report_type) {
      toast({
        title: "Missing Information",
        description: "Please fill in the required fields.",
        variant: "destructive",
      });
      return;
    }

    const reportData = {
      title: newReport.title,
      description: newReport.description,
      report_type: newReport.report_type,
      site_id: newReport.site_id || null,
      data: {
        signal_strength: newReport.signal_strength,
        equipment_status: newReport.equipment_status,
        power_status: newReport.power_status,
        connectivity_issues: newReport.connectivity_issues,
        maintenance_performed: newReport.maintenance_performed,
        recommendations: newReport.recommendations,
        photos: newReport.photos,
      },
    };

    createReport.mutate(reportData);
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
    return <div>Loading site reports...</div>;
  }

  return (
    <Card className="bg-black/10 dark:bg-white/5 backdrop-blur-lg border-none">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg font-medium">
            <Radio className="h-5 w-5 text-primary" />
            Telecom Site Reports
          </CardTitle>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Report
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create Site Report</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      value={newReport.title}
                      onChange={(e) => setNewReport({ ...newReport, title: e.target.value })}
                      placeholder="Report title"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="report-type">Report Type *</Label>
                    <Select
                      value={newReport.report_type}
                      onValueChange={(value) => setNewReport({ ...newReport, report_type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="maintenance">Maintenance</SelectItem>
                        <SelectItem value="inspection">Inspection</SelectItem>
                        <SelectItem value="incident">Incident</SelectItem>
                        <SelectItem value="upgrade">Upgrade</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="site">Site</Label>
                  <Select
                    value={newReport.site_id}
                    onValueChange={(value) => setNewReport({ ...newReport, site_id: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select site" />
                    </SelectTrigger>
                    <SelectContent>
                      {sites.map((site) => (
                        <SelectItem key={site.id} value={site.id}>
                          {site.name} - {site.location}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newReport.description}
                    onChange={(e) => setNewReport({ ...newReport, description: e.target.value })}
                    placeholder="Report description"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="signal">Signal Strength</Label>
                    <Input
                      id="signal"
                      value={newReport.signal_strength}
                      onChange={(e) => setNewReport({ ...newReport, signal_strength: e.target.value })}
                      placeholder="Signal strength details"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="equipment">Equipment Status</Label>
                    <Input
                      id="equipment"
                      value={newReport.equipment_status}
                      onChange={(e) => setNewReport({ ...newReport, equipment_status: e.target.value })}
                      placeholder="Equipment status"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maintenance">Maintenance Performed</Label>
                  <Textarea
                    id="maintenance"
                    value={newReport.maintenance_performed}
                    onChange={(e) => setNewReport({ ...newReport, maintenance_performed: e.target.value })}
                    placeholder="Describe maintenance activities..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="recommendations">Recommendations</Label>
                  <Textarea
                    id="recommendations"
                    value={newReport.recommendations}
                    onChange={(e) => setNewReport({ ...newReport, recommendations: e.target.value })}
                    placeholder="Recommendations for future..."
                  />
                </div>

                <Button onClick={handleSubmitReport} className="w-full">
                  Submit Site Report
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {reports.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No site reports found. Create your first report to get started.
          </div>
        ) : (
          <div className="space-y-4">
            {reports.map((report) => (
              <Card key={report.id} className="glass-card">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{report.title}</h4>
                        <Badge className={getStatusColor(report.status)}>
                          {report.status}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-muted-foreground">
                        Type: {report.report_type}
                      </p>
                      
                      {report.site && (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          <span>{report.site.name} - {report.site.location}</span>
                        </div>
                      )}

                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>{format(new Date(report.report_date), 'MMM dd, yyyy')}</span>
                      </div>

                      {report.description && (
                        <p className="text-sm mt-2">{report.description}</p>
                      )}
                    </div>
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

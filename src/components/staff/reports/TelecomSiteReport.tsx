
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
  site_id: string;
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
          site:site_id(name, location),
          reported_by:reported_by(full_name)
        `)
        .order('report_date', { ascending: false });
      
      if (error) throw error;
      return data as SiteReport[];
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
          site_id: reportData.site_id,
          title: reportData.title,
          description: reportData.description,
          report_type: reportData.report_type,
          reported_by: user.id,
          report_date: new Date().toISOString(),
          status: 'submitted',
          data: {
            signal_strength: reportData.signal_strength,
            equipment_status: reportData.equipment_status,
            power_status: reportData.power_status,
            connectivity_issues: reportData.connectivity_issues,
            maintenance_performed: reportData.maintenance_performed,
            recommendations: reportData.recommendations,
            photos: reportData.photos,
          }
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
        description: "Telecom site report submitted successfully",
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
        description: `Failed to submit report: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const handleSubmitReport = () => {
    if (!newReport.site_id || !newReport.title) {
      toast({
        title: "Missing Information",
        description: "Please select a site and provide a title.",
        variant: "destructive",
      });
      return;
    }

    createReport.mutate(newReport);
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
    return <div>Loading telecom site reports...</div>;
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
                <DialogTitle>Create Telecom Site Report</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="site">Site *</Label>
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
                    <Label htmlFor="type">Report Type</Label>
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
                        <SelectItem value="repair">Repair</SelectItem>
                        <SelectItem value="upgrade">Upgrade</SelectItem>
                        <SelectItem value="emergency">Emergency</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title">Report Title *</Label>
                  <Input
                    id="title"
                    value={newReport.title}
                    onChange={(e) => setNewReport({ ...newReport, title: e.target.value })}
                    placeholder="Brief description of the report"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newReport.description}
                    onChange={(e) => setNewReport({ ...newReport, description: e.target.value })}
                    placeholder="Detailed description of the site visit..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="signal">Signal Strength</Label>
                    <Select
                      value={newReport.signal_strength}
                      onValueChange={(value) => setNewReport({ ...newReport, signal_strength: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select strength" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="excellent">Excellent</SelectItem>
                        <SelectItem value="good">Good</SelectItem>
                        <SelectItem value="fair">Fair</SelectItem>
                        <SelectItem value="poor">Poor</SelectItem>
                        <SelectItem value="critical">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="equipment">Equipment Status</Label>
                    <Select
                      value={newReport.equipment_status}
                      onValueChange={(value) => setNewReport({ ...newReport, equipment_status: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="operational">Operational</SelectItem>
                        <SelectItem value="maintenance-needed">Maintenance Needed</SelectItem>
                        <SelectItem value="repair-required">Repair Required</SelectItem>
                        <SelectItem value="replacement-needed">Replacement Needed</SelectItem>
                        <SelectItem value="offline">Offline</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="power">Power Status</Label>
                  <Select
                    value={newReport.power_status}
                    onValueChange={(value) => setNewReport({ ...newReport, power_status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select power status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="backup">On Backup Power</SelectItem>
                      <SelectItem value="low-voltage">Low Voltage</SelectItem>
                      <SelectItem value="power-issues">Power Issues</SelectItem>
                      <SelectItem value="no-power">No Power</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="connectivity">Connectivity Issues</Label>
                  <Textarea
                    id="connectivity"
                    value={newReport.connectivity_issues}
                    onChange={(e) => setNewReport({ ...newReport, connectivity_issues: e.target.value })}
                    placeholder="Describe any connectivity problems..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maintenance">Maintenance Performed</Label>
                  <Textarea
                    id="maintenance"
                    value={newReport.maintenance_performed}
                    onChange={(e) => setNewReport({ ...newReport, maintenance_performed: e.target.value })}
                    placeholder="Describe maintenance work performed..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="recommendations">Recommendations</Label>
                  <Textarea
                    id="recommendations"
                    value={newReport.recommendations}
                    onChange={(e) => setNewReport({ ...newReport, recommendations: e.target.value })}
                    placeholder="Recommendations for future work..."
                  />
                </div>

                <Button onClick={handleSubmitReport} className="w-full" disabled={createReport.isPending}>
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
            No telecom site reports found. Create your first report to get started.
          </div>
        ) : (
          <div className="space-y-4">
            {reports.map((report) => (
              <Card key={report.id} className="glass-card">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{report.title}</h4>
                        <Badge className={getStatusColor(report.status)}>
                          {report.status}
                        </Badge>
                        <Badge variant="outline">{report.report_type}</Badge>
                      </div>
                      
                      {report.site && (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          <span>{report.site.name} - {report.site.location}</span>
                        </div>
                      )}

                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>{format(new Date(report.report_date), 'MMM dd, yyyy')}</span>
                      </div>

                      {report.description && (
                        <p className="text-sm text-muted-foreground">{report.description}</p>
                      )}

                      {report.data && (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-3 text-sm">
                          {report.data.signal_strength && (
                            <div>
                              <p className="text-xs text-muted-foreground">Signal</p>
                              <p className="font-medium capitalize">{report.data.signal_strength}</p>
                            </div>
                          )}
                          {report.data.equipment_status && (
                            <div>
                              <p className="text-xs text-muted-foreground">Equipment</p>
                              <p className="font-medium capitalize">{report.data.equipment_status}</p>
                            </div>
                          )}
                          {report.data.power_status && (
                            <div>
                              <p className="text-xs text-muted-foreground">Power</p>
                              <p className="font-medium capitalize">{report.data.power_status}</p>
                            </div>
                          )}
                        </div>
                      )}

                      {report.reported_by && (
                        <p className="text-xs text-muted-foreground mt-2">
                          Reported by: {report.reported_by.full_name}
                        </p>
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

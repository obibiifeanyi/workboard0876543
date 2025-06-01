
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Radio, Plus, Signal, Antenna } from "lucide-react";
import { useStaffOperations } from "@/hooks/useStaffOperations";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";

export const TelecomSiteReport = () => {
  const { useTelecomReports, createTelecomReport, useSites } = useStaffOperations();
  const { data: reports = [], isLoading } = useTelecomReports();
  const { data: sites = [] } = useSites();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newReport, setNewReport] = useState({
    site_id: '',
    signal_strength: 0,
    network_status: 'operational',
    equipment_status: 'good',
    issues_reported: '',
    maintenance_required: false,
    recommendations: '',
  });

  const handleCreateReport = () => {
    if (!newReport.site_id) {
      return;
    }

    createTelecomReport.mutate(newReport, {
      onSuccess: () => {
        setIsCreateDialogOpen(false);
        setNewReport({
          site_id: '',
          signal_strength: 0,
          network_status: 'operational',
          equipment_status: 'good',
          issues_reported: '',
          maintenance_required: false,
          recommendations: '',
        });
      },
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational': return 'bg-green-100 text-green-800';
      case 'degraded': return 'bg-yellow-100 text-yellow-800';
      case 'down': return 'bg-red-100 text-red-800';
      case 'maintenance': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getEquipmentStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'bg-green-100 text-green-800';
      case 'good': return 'bg-blue-100 text-blue-800';
      case 'fair': return 'bg-yellow-100 text-yellow-800';
      case 'poor': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return <div>Loading telecom reports...</div>;
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
                Create Report
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create Telecom Site Report</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="site">Site *</Label>
                  <Select value={newReport.site_id} onValueChange={(value) => setNewReport({ ...newReport, site_id: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a site" />
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

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="signal">Signal Strength (dBm)</Label>
                    <Input
                      id="signal"
                      type="number"
                      value={newReport.signal_strength}
                      onChange={(e) => setNewReport({ ...newReport, signal_strength: Number(e.target.value) })}
                      placeholder="-75"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="network-status">Network Status</Label>
                    <Select value={newReport.network_status} onValueChange={(value) => setNewReport({ ...newReport, network_status: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="operational">Operational</SelectItem>
                        <SelectItem value="degraded">Degraded</SelectItem>
                        <SelectItem value="down">Down</SelectItem>
                        <SelectItem value="maintenance">Maintenance</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="equipment-status">Equipment Status</Label>
                  <Select value={newReport.equipment_status} onValueChange={(value) => setNewReport({ ...newReport, equipment_status: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="excellent">Excellent</SelectItem>
                      <SelectItem value="good">Good</SelectItem>
                      <SelectItem value="fair">Fair</SelectItem>
                      <SelectItem value="poor">Poor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="issues">Issues Reported</Label>
                  <Textarea
                    id="issues"
                    value={newReport.issues_reported}
                    onChange={(e) => setNewReport({ ...newReport, issues_reported: e.target.value })}
                    placeholder="Any network or equipment issues observed..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="recommendations">Recommendations</Label>
                  <Textarea
                    id="recommendations"
                    value={newReport.recommendations}
                    onChange={(e) => setNewReport({ ...newReport, recommendations: e.target.value })}
                    placeholder="Recommended actions or improvements..."
                  />
                </div>

                <Button 
                  onClick={handleCreateReport} 
                  className="w-full" 
                  disabled={createTelecomReport.isPending}
                >
                  {createTelecomReport.isPending ? "Creating..." : "Create Report"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      
      <CardContent>
        {reports.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No telecom reports yet. Create your first report to get started.
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
                          {report.site?.name || 'Unknown Site'}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          Report Date: {format(new Date(report.report_date), 'MMM dd, yyyy')}
                        </p>
                        {report.reporter && (
                          <p className="text-sm text-muted-foreground">
                            Reported by: {report.reporter.full_name}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Badge className={getStatusColor(report.network_status)}>
                          {report.network_status}
                        </Badge>
                        <Badge className={getEquipmentStatusColor(report.equipment_status)}>
                          {report.equipment_status}
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                      {report.signal_strength && (
                        <div className="flex items-center gap-2">
                          <Signal className="h-4 w-4 text-muted-foreground" />
                          <span>{report.signal_strength} dBm</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Radio className="h-4 w-4 text-muted-foreground" />
                        <span>{report.network_status}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Antenna className="h-4 w-4 text-muted-foreground" />
                        <span>{report.equipment_status}</span>
                      </div>
                    </div>

                    {report.issues_reported && (
                      <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 rounded">
                        <p className="text-sm">
                          <strong>Issues:</strong> {report.issues_reported}
                        </p>
                      </div>
                    )}

                    {report.recommendations && (
                      <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded">
                        <p className="text-sm">
                          <strong>Recommendations:</strong> {report.recommendations}
                        </p>
                      </div>
                    )}

                    {report.maintenance_required && (
                      <div className="mt-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded">
                        <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                          🔧 Maintenance Required
                        </p>
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

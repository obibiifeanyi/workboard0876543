
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Battery, Plus, Thermometer, Zap } from "lucide-react";
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

export const BatteryReport = () => {
  const { useBatteryReports, createBatteryReport } = useStaffOperations();
  const { data: reports = [], isLoading } = useBatteryReports();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newReport, setNewReport] = useState({
    site_name: '',
    battery_voltage: 0,
    current_capacity: 0,
    temperature: 0,
    charging_status: 'float',
    health_status: 'good',
    runtime_hours: 0,
    load_current: 0,
    backup_time_remaining: 0,
    maintenance_required: false,
    issues_reported: '',
    recommendations: '',
  });

  const handleCreateReport = () => {
    if (!newReport.site_name) {
      return;
    }

    createBatteryReport.mutate(newReport, {
      onSuccess: () => {
        setIsCreateDialogOpen(false);
        setNewReport({
          site_name: '',
          battery_voltage: 0,
          current_capacity: 0,
          temperature: 0,
          charging_status: 'float',
          health_status: 'good',
          runtime_hours: 0,
          load_current: 0,
          backup_time_remaining: 0,
          maintenance_required: false,
          issues_reported: '',
          recommendations: '',
        });
      },
    });
  };

  const getHealthStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'bg-green-100 text-green-800';
      case 'good': return 'bg-blue-100 text-blue-800';
      case 'fair': return 'bg-yellow-100 text-yellow-800';
      case 'poor': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return <div>Loading battery reports...</div>;
  }

  return (
    <Card className="bg-black/10 dark:bg-white/5 backdrop-blur-lg border-none">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg font-medium">
            <Battery className="h-5 w-5 text-primary" />
            Battery Reports
          </CardTitle>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Report
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create Battery Report</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="site-name">Site Name *</Label>
                  <Input
                    id="site-name"
                    value={newReport.site_name}
                    onChange={(e) => setNewReport({ ...newReport, site_name: e.target.value })}
                    placeholder="Lagos Central Tower"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="voltage">Battery Voltage (V)</Label>
                    <Input
                      id="voltage"
                      type="number"
                      step="0.1"
                      value={newReport.battery_voltage}
                      onChange={(e) => setNewReport({ ...newReport, battery_voltage: Number(e.target.value) })}
                      placeholder="12.6"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="capacity">Current Capacity (%)</Label>
                    <Input
                      id="capacity"
                      type="number"
                      min="0"
                      max="100"
                      value={newReport.current_capacity}
                      onChange={(e) => setNewReport({ ...newReport, current_capacity: Number(e.target.value) })}
                      placeholder="85"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="temperature">Temperature (°C)</Label>
                    <Input
                      id="temperature"
                      type="number"
                      value={newReport.temperature}
                      onChange={(e) => setNewReport({ ...newReport, temperature: Number(e.target.value) })}
                      placeholder="25"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="runtime">Runtime Hours</Label>
                    <Input
                      id="runtime"
                      type="number"
                      value={newReport.runtime_hours}
                      onChange={(e) => setNewReport({ ...newReport, runtime_hours: Number(e.target.value) })}
                      placeholder="72"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="charging-status">Charging Status</Label>
                    <Select value={newReport.charging_status} onValueChange={(value) => setNewReport({ ...newReport, charging_status: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="charging">Charging</SelectItem>
                        <SelectItem value="discharging">Discharging</SelectItem>
                        <SelectItem value="float">Float</SelectItem>
                        <SelectItem value="bulk">Bulk</SelectItem>
                        <SelectItem value="absorption">Absorption</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="health-status">Health Status</Label>
                    <Select value={newReport.health_status} onValueChange={(value) => setNewReport({ ...newReport, health_status: value })}>
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
                </div>

                <div className="space-y-2">
                  <Label htmlFor="issues">Issues Reported</Label>
                  <Textarea
                    id="issues"
                    value={newReport.issues_reported}
                    onChange={(e) => setNewReport({ ...newReport, issues_reported: e.target.value })}
                    placeholder="Any issues or anomalies observed..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="recommendations">Recommendations</Label>
                  <Textarea
                    id="recommendations"
                    value={newReport.recommendations}
                    onChange={(e) => setNewReport({ ...newReport, recommendations: e.target.value })}
                    placeholder="Maintenance recommendations..."
                  />
                </div>

                <Button 
                  onClick={handleCreateReport} 
                  className="w-full" 
                  disabled={createBatteryReport.isPending}
                >
                  {createBatteryReport.isPending ? "Creating..." : "Create Report"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      
      <CardContent>
        {reports.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No battery reports yet. Create your first report to get started.
          </div>
        ) : (
          <div className="space-y-4">
            {reports.map((report) => (
              <Card key={report.id} className="glass-card">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <h4 className="font-medium">{report.site_name}</h4>
                        <p className="text-sm text-muted-foreground">
                          Report Date: {format(new Date(report.report_date), 'MMM dd, yyyy')}
                        </p>
                        {report.reporter && (
                          <p className="text-sm text-muted-foreground">
                            Reported by: {report.reporter.full_name}
                          </p>
                        )}
                      </div>
                      <Badge className={getHealthStatusColor(report.health_status)}>
                        {report.health_status}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      {report.battery_voltage && (
                        <div className="flex items-center gap-2">
                          <Zap className="h-4 w-4 text-muted-foreground" />
                          <span>{report.battery_voltage}V</span>
                        </div>
                      )}
                      {report.current_capacity && (
                        <div className="flex items-center gap-2">
                          <Battery className="h-4 w-4 text-muted-foreground" />
                          <span>{report.current_capacity}%</span>
                        </div>
                      )}
                      {report.temperature && (
                        <div className="flex items-center gap-2">
                          <Thermometer className="h-4 w-4 text-muted-foreground" />
                          <span>{report.temperature}°C</span>
                        </div>
                      )}
                      {report.runtime_hours && (
                        <div className="text-sm">
                          <span className="text-muted-foreground">Runtime:</span> {report.runtime_hours}h
                        </div>
                      )}
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
                          ⚠️ Maintenance Required
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

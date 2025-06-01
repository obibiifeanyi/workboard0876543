
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Battery, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useStaffOperations } from "@/hooks/useStaffOperations";
import { BatteryInventory } from "@/components/battery/BatteryInventory";
import { BatterySales } from "@/components/battery/BatterySales";
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type ChargingStatus = 'charging' | 'discharging' | 'float' | 'bulk' | 'absorption';
type HealthStatus = 'excellent' | 'good' | 'fair' | 'poor' | 'critical';

export const BatteryReport = () => {
  const { useBatteryReports, createBatteryReport } = useStaffOperations();
  const { data: reports = [], isLoading } = useBatteryReports();
  const { toast } = useToast();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newReport, setNewReport] = useState({
    site_id: '',
    battery_id: '',
    report_date: format(new Date(), 'yyyy-MM-dd'),
    battery_voltage: '',
    current_capacity: '',
    temperature: '',
    charging_status: '' as ChargingStatus | '',
    health_status: 'good' as HealthStatus,
    runtime_hours: '',
    load_current: '',
    backup_time_remaining: '',
    maintenance_required: false,
    maintenance_notes: '',
    issues_reported: '',
    recommendations: '',
    next_maintenance_date: '',
  });

  const handleSubmitReport = () => {
    if (!newReport.health_status) {
      toast({
        title: "Missing Information",
        description: "Please select a health status.",
        variant: "destructive",
      });
      return;
    }

    const reportData = {
      ...newReport,
      battery_voltage: newReport.battery_voltage ? Number(newReport.battery_voltage) : undefined,
      current_capacity: newReport.current_capacity ? Number(newReport.current_capacity) : undefined,
      temperature: newReport.temperature ? Number(newReport.temperature) : undefined,
      runtime_hours: newReport.runtime_hours ? Number(newReport.runtime_hours) : undefined,
      load_current: newReport.load_current ? Number(newReport.load_current) : undefined,
      backup_time_remaining: newReport.backup_time_remaining ? Number(newReport.backup_time_remaining) : undefined,
      charging_status: newReport.charging_status || undefined,
    };

    createBatteryReport.mutate(reportData, {
      onSuccess: () => {
        setIsCreateDialogOpen(false);
        setNewReport({
          site_id: '',
          battery_id: '',
          report_date: format(new Date(), 'yyyy-MM-dd'),
          battery_voltage: '',
          current_capacity: '',
          temperature: '',
          charging_status: '',
          health_status: 'good',
          runtime_hours: '',
          load_current: '',
          backup_time_remaining: '',
          maintenance_required: false,
          maintenance_notes: '',
          issues_reported: '',
          recommendations: '',
          next_maintenance_date: '',
        });
      },
    });
  };

  const getHealthStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'bg-green-100 text-green-800';
      case 'good': return 'bg-blue-100 text-blue-800';
      case 'fair': return 'bg-yellow-100 text-yellow-800';
      case 'poor': return 'bg-orange-100 text-orange-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return <div>Loading battery reports...</div>;
  }

  return (
    <Tabs defaultValue="report" className="space-y-6">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="report">Battery Reports</TabsTrigger>
        <TabsTrigger value="inventory">Inventory</TabsTrigger>
        <TabsTrigger value="sales">Sales</TabsTrigger>
      </TabsList>

      <TabsContent value="report" className="space-y-6">
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
                    New Report
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Create Battery Report</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="report-date">Report Date</Label>
                        <Input
                          id="report-date"
                          type="date"
                          value={newReport.report_date}
                          onChange={(e) => setNewReport({ ...newReport, report_date: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="health-status">Health Status *</Label>
                        <Select
                          value={newReport.health_status}
                          onValueChange={(value: HealthStatus) => setNewReport({ ...newReport, health_status: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
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
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="voltage">Battery Voltage (V)</Label>
                        <Input
                          id="voltage"
                          type="number"
                          value={newReport.battery_voltage}
                          onChange={(e) => setNewReport({ ...newReport, battery_voltage: e.target.value })}
                          placeholder="12.5"
                          step="0.1"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="capacity">Current Capacity (%)</Label>
                        <Input
                          id="capacity"
                          type="number"
                          value={newReport.current_capacity}
                          onChange={(e) => setNewReport({ ...newReport, current_capacity: e.target.value })}
                          placeholder="85"
                          min="0"
                          max="100"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="temperature">Temperature (°C)</Label>
                        <Input
                          id="temperature"
                          type="number"
                          value={newReport.temperature}
                          onChange={(e) => setNewReport({ ...newReport, temperature: e.target.value })}
                          placeholder="25"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="charging-status">Charging Status</Label>
                        <Select
                          value={newReport.charging_status}
                          onValueChange={(value: ChargingStatus) => setNewReport({ ...newReport, charging_status: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
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
                        <Label htmlFor="runtime">Runtime Hours</Label>
                        <Input
                          id="runtime"
                          type="number"
                          value={newReport.runtime_hours}
                          onChange={(e) => setNewReport({ ...newReport, runtime_hours: e.target.value })}
                          placeholder="8"
                          min="0"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="issues">Issues Reported</Label>
                      <Textarea
                        id="issues"
                        value={newReport.issues_reported}
                        onChange={(e) => setNewReport({ ...newReport, issues_reported: e.target.value })}
                        placeholder="Describe any issues..."
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="maintenance-notes">Maintenance Notes</Label>
                      <Textarea
                        id="maintenance-notes"
                        value={newReport.maintenance_notes}
                        onChange={(e) => setNewReport({ ...newReport, maintenance_notes: e.target.value })}
                        placeholder="Maintenance details..."
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="recommendations">Recommendations</Label>
                      <Textarea
                        id="recommendations"
                        value={newReport.recommendations}
                        onChange={(e) => setNewReport({ ...newReport, recommendations: e.target.value })}
                        placeholder="Recommendations for improvement..."
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="maintenance-required"
                        checked={newReport.maintenance_required}
                        onChange={(e) => setNewReport({ ...newReport, maintenance_required: e.target.checked })}
                      />
                      <Label htmlFor="maintenance-required">Maintenance Required</Label>
                    </div>

                    <Button onClick={handleSubmitReport} className="w-full">
                      Submit Battery Report
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            {reports.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No battery reports found. Create your first report to get started.
              </div>
            ) : (
              <div className="space-y-4">
                {reports.map((report) => (
                  <Card key={report.id} className="glass-card">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">
                              Battery Report - {format(new Date(report.report_date), 'MMM dd, yyyy')}
                            </h4>
                            <Badge className={getHealthStatusColor(report.health_status)}>
                              {report.health_status}
                            </Badge>
                          </div>
                          
                          {report.site && (
                            <p className="text-sm text-muted-foreground">
                              Site: {report.site.name}
                            </p>
                          )}
                          
                          {report.battery && (
                            <p className="text-sm text-muted-foreground">
                              Battery: {report.battery.manufacturer} {report.battery.model_name}
                            </p>
                          )}

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
                            {report.battery_voltage && (
                              <div>
                                <p className="text-xs text-muted-foreground">Voltage</p>
                                <p className="font-medium">{report.battery_voltage}V</p>
                              </div>
                            )}
                            {report.current_capacity && (
                              <div>
                                <p className="text-xs text-muted-foreground">Capacity</p>
                                <p className="font-medium">{report.current_capacity}%</p>
                              </div>
                            )}
                            {report.temperature && (
                              <div>
                                <p className="text-xs text-muted-foreground">Temperature</p>
                                <p className="font-medium">{report.temperature}°C</p>
                              </div>
                            )}
                            {report.runtime_hours && (
                              <div>
                                <p className="text-xs text-muted-foreground">Runtime</p>
                                <p className="font-medium">{report.runtime_hours}h</p>
                              </div>
                            )}
                          </div>

                          {report.issues_reported && (
                            <div className="mt-3">
                              <p className="text-xs text-muted-foreground">Issues</p>
                              <p className="text-sm">{report.issues_reported}</p>
                            </div>
                          )}

                          {report.maintenance_required && (
                            <Badge variant="destructive" className="mt-2">
                              Maintenance Required
                            </Badge>
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
      </TabsContent>

      <TabsContent value="inventory">
        <BatteryInventory />
      </TabsContent>

      <TabsContent value="sales">
        <BatterySales />
      </TabsContent>
    </Tabs>
  );
};

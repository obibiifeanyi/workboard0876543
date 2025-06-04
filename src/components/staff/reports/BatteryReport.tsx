import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useStaffOperations } from "@/hooks/useStaffOperations";

interface BatteryReportForm {
  site_name: string;
  battery_voltage: number;
  current_capacity: number;
  temperature: number;
  charging_status: string;
  health_status: string;
  runtime_hours: number;
  load_current: number;
  backup_time_remaining: number;
  maintenance_required: boolean;
  issues_reported: string;
  recommendations: string;
}

export const BatteryReport = () => {
  const { createBatteryReport } = useStaffOperations();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState<BatteryReportForm>({
    site_name: '',
    battery_voltage: 0,
    current_capacity: 0,
    temperature: 0,
    charging_status: '',
    health_status: '',
    runtime_hours: 0,
    load_current: 0,
    backup_time_remaining: 0,
    maintenance_required: false,
    issues_reported: '',
    recommendations: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);
    
    // Validate required fields
    if (!formData.site_name || !formData.health_status) {
      setErrorMessage('Please fill in all required fields');
      setIsSubmitting(false);
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }
    
    createBatteryReport.mutate({
      site_name: formData.site_name,
      battery_voltage: formData.battery_voltage,
      current_capacity: formData.current_capacity,
      temperature: formData.temperature,
      charging_status: formData.charging_status,
      health_status: formData.health_status,
      runtime_hours: formData.runtime_hours,
      load_current: formData.load_current,
      backup_time_remaining: formData.backup_time_remaining,
      maintenance_required: formData.maintenance_required,
      issues_reported: formData.issues_reported,
      recommendations: formData.recommendations,
      report_date: new Date().toISOString().split('T')[0] // Add current date
    }, {
      onSuccess: () => {
        setIsSuccess(true);
        setIsSubmitting(false);
        toast({
          title: "Success",
          description: "Battery report submitted successfully.",
        });
        
        // Reset form after successful submission
        setFormData({
          site_name: '',
          battery_voltage: 0,
          current_capacity: 0,
          temperature: 0,
          charging_status: '',
          health_status: '',
          runtime_hours: 0,
          load_current: 0,
          backup_time_remaining: 0,
          maintenance_required: false,
          issues_reported: '',
          recommendations: '',
        });
        
        // Reset success state after a delay
        setTimeout(() => {
          setIsSuccess(false);
        }, 3000);
      },
      onError: (error: any) => {
        setIsSubmitting(false);
        setErrorMessage(error?.message || 'Failed to submit report');
        toast({
          title: 'Error',
          description: error?.message || 'Failed to submit battery report.',
          variant: 'destructive',
        });
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Submit Battery Report</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="site_name">Site Name</Label>
            <Input
              id="site_name"
              value={formData.site_name}
              onChange={(e) => setFormData({ ...formData, site_name: e.target.value })}
              placeholder="Enter site name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="battery_voltage">Battery Voltage</Label>
            <Input
              id="battery_voltage"
              type="number"
              value={formData.battery_voltage}
              onChange={(e) => setFormData({ ...formData, battery_voltage: parseFloat(e.target.value) || 0 })}
              placeholder="Enter battery voltage"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="current_capacity">Current Capacity</Label>
            <Input
              id="current_capacity"
              type="number"
              value={formData.current_capacity}
              onChange={(e) => setFormData({ ...formData, current_capacity: parseFloat(e.target.value) || 0 })}
              placeholder="Enter current capacity"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="temperature">Temperature (°C)</Label>
            <Input
              id="temperature"
              type="number"
              value={formData.temperature}
              onChange={(e) => setFormData({ ...formData, temperature: parseFloat(e.target.value) || 0 })}
              placeholder="Enter temperature"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="charging_status">Charging Status</Label>
            <Input
              id="charging_status"
              value={formData.charging_status}
              onChange={(e) => setFormData({ ...formData, charging_status: e.target.value })}
              placeholder="Enter charging status"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="health_status">Health Status</Label>
            <Select 
              value={formData.health_status} 
              onValueChange={(value) => setFormData({ ...formData, health_status: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select health status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="good">Good</SelectItem>
                <SelectItem value="fair">Fair</SelectItem>
                <SelectItem value="poor">Poor</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="runtime_hours">Runtime Hours</Label>
            <Input
              id="runtime_hours"
              type="number"
              value={formData.runtime_hours}
              onChange={(e) => setFormData({ ...formData, runtime_hours: parseFloat(e.target.value) || 0 })}
              placeholder="Enter runtime hours"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="load_current">Load Current</Label>
            <Input
              id="load_current"
              type="number"
              value={formData.load_current}
              onChange={(e) => setFormData({ ...formData, load_current: parseFloat(e.target.value) || 0 })}
              placeholder="Enter load current"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="backup_time_remaining">Backup Time Remaining</Label>
            <Input
              id="backup_time_remaining"
              type="number"
              value={formData.backup_time_remaining}
              onChange={(e) => setFormData({ ...formData, backup_time_remaining: parseFloat(e.target.value) || 0 })}
              placeholder="Enter backup time remaining"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Input
              type="checkbox"
              id="maintenance_required"
              checked={formData.maintenance_required}
              onChange={(e) => setFormData({ ...formData, maintenance_required: e.target.checked })}
            />
            <Label htmlFor="maintenance_required">Maintenance Required</Label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="issues_reported">Issues Reported</Label>
            <Textarea
              id="issues_reported"
              value={formData.issues_reported}
              onChange={(e) => setFormData({ ...formData, issues_reported: e.target.value })}
              placeholder="Enter issues reported"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="recommendations">Recommendations</Label>
            <Textarea
              id="recommendations"
              value={formData.recommendations}
              onChange={(e) => setFormData({ ...formData, recommendations: e.target.value })}
              placeholder="Enter recommendations"
            />
          </div>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit Report'}
          </Button>
          {errorMessage && (
            <p className="text-red-500 text-xs mt-2">{errorMessage}</p>
          )}
          {isSuccess && (
            <p className="text-green-600 text-xs mt-2">Report submitted successfully!</p>
          )}
        </form>
      </CardContent>
    </Card>
  );
};

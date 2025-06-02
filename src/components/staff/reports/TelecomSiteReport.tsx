import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useStaffOperations } from "@/hooks/useStaffOperations";

interface TelecomSiteReportForm {
  site_id?: string;
  signal_strength?: number;
  network_status: string;
  equipment_status: string;
  issues_reported?: string;
  maintenance_required: boolean;
  recommendations?: string;
}

export const TelecomSiteReport = () => {
  const { createTelecomReport } = useStaffOperations();
  const { toast } = useToast();
  const [formData, setFormData] = useState<TelecomSiteReportForm>({
    site_id: '',
    signal_strength: 0,
    network_status: '',
    equipment_status: '',
    issues_reported: '',
    maintenance_required: false,
    recommendations: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createTelecomReport.mutate({
      site_id: formData.site_id,
      signal_strength: formData.signal_strength,
      network_status: formData.network_status,
      equipment_status: formData.equipment_status,
      issues_reported: formData.issues_reported,
      maintenance_required: formData.maintenance_required,
      recommendations: formData.recommendations,
      report_date: new Date().toISOString().split('T')[0] // Add current date
    });
    toast({
      title: "Success",
      description: "Telecom site report submitted successfully.",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Report Telecom Site Condition</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="site_id">Site ID</Label>
            <Input
              id="site_id"
              value={formData.site_id}
              onChange={(e) => setFormData({ ...formData, site_id: e.target.value })}
              placeholder="Enter Site ID"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="signal_strength">Signal Strength (dBm)</Label>
            <Input
              id="signal_strength"
              type="number"
              value={formData.signal_strength}
              onChange={(e) => setFormData({ ...formData, signal_strength: parseFloat(e.target.value) || 0 })}
              placeholder="Enter Signal Strength"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="network_status">Network Status</Label>
            <Select onValueChange={(value) => setFormData({ ...formData, network_status: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select Network Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="excellent">Excellent</SelectItem>
                <SelectItem value="good">Good</SelectItem>
                <SelectItem value="average">Average</SelectItem>
                <SelectItem value="poor">Poor</SelectItem>
                <SelectItem value="no_signal">No Signal</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="equipment_status">Equipment Status</Label>
            <Textarea
              id="equipment_status"
              value={formData.equipment_status}
              onChange={(e) => setFormData({ ...formData, equipment_status: e.target.value })}
              placeholder="Describe Equipment Status"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="issues_reported">Issues Reported</Label>
            <Textarea
              id="issues_reported"
              value={formData.issues_reported}
              onChange={(e) => setFormData({ ...formData, issues_reported: e.target.value })}
              placeholder="Report any issues"
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
            <Label htmlFor="recommendations">Recommendations</Label>
            <Textarea
              id="recommendations"
              value={formData.recommendations}
              onChange={(e) => setFormData({ ...formData, recommendations: e.target.value })}
              placeholder="Enter Recommendations"
            />
          </div>

          <Button type="submit">Submit Report</Button>
        </form>
      </CardContent>
    </Card>
  );
};

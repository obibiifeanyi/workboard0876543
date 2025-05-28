
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";

const mockSites = [
  { id: "SITE-001", name: "Tower Alpha" },
  { id: "SITE-002", name: "Station Beta" },
];

export const TelecomSiteReport = () => {
  const [selectedSite, setSelectedSite] = useState("");
  const { toast } = useToast();
  const [reportDateTime, setReportDateTime] = useState(new Date().toISOString().slice(0, 16));
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitReport = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setIsSubmitting(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('You must be logged in to submit reports');
      }

      const { error } = await supabase
        .from('ct_power_reports')
        .insert([{
          site_id: selectedSite,
          report_datetime: formData.get('reportDateTime') as string,
          generator_runtime: Number(formData.get('generatorRuntime')),
          diesel_level: Number(formData.get('dieselLevel')),
          comments: formData.get('comments') as string,
          status: formData.get('status') as string,
          created_by: user.id,
        }]);

      if (error) throw error;

      toast({
        title: "Site Report Submitted",
        description: `Report for site ${selectedSite} has been submitted successfully`,
      });

      // Reset form
      e.currentTarget.reset();
      setSelectedSite("");
      setReportDateTime(new Date().toISOString().slice(0, 16));
    } catch (error) {
      console.error('Error submitting report:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to submit report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="bg-black/10 dark:bg-white/5 backdrop-blur-lg border-none">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg font-medium">
          <MapPin className="h-5 w-5 text-primary" />
          Telecom Site Report
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmitReport} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Select Site</label>
            <Select
              value={selectedSite}
              onValueChange={setSelectedSite}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a site" />
              </SelectTrigger>
              <SelectContent>
                {mockSites.map((site) => (
                  <SelectItem key={site.id} value={site.id}>
                    {site.id} - {site.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Report Date & Time</label>
            <Input
              type="datetime-local"
              name="reportDateTime"
              value={reportDateTime}
              onChange={(e) => setReportDateTime(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Generator Runtime (hours)</label>
            <Input
              type="number"
              name="generatorRuntime"
              placeholder="Enter generator runtime in hours"
              min="0"
              step="0.1"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Diesel Level (%)</label>
            <Input
              type="number"
              name="dieselLevel"
              placeholder="Enter diesel level percentage"
              min="0"
              max="100"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Site Status</label>
            <Select name="status" defaultValue="operational">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="operational">Operational</SelectItem>
                <SelectItem value="maintenance">Under Maintenance</SelectItem>
                <SelectItem value="offline">Offline</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Comments</label>
            <textarea
              name="comments"
              className="w-full rounded-md border border-white/10 bg-white/5 p-2 min-h-[100px]"
              placeholder="Enter any additional comments or observations..."
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Upload Site Images</label>
            <div className="border-2 border-dashed border-white/10 rounded-lg p-4 text-center">
              <Upload className="h-8 w-8 mx-auto text-primary" />
              <p className="text-sm text-muted-foreground mt-2">
                Drop files here or click to upload
              </p>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                multiple
              />
            </div>
          </div>

          <Button type="submit" className="w-full md:w-auto" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit Site Report'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

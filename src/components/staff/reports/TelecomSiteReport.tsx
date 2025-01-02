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

const mockSites = [
  { id: "SITE-001", name: "Tower Alpha" },
  { id: "SITE-002", name: "Station Beta" },
];

export const TelecomSiteReport = () => {
  const [selectedSite, setSelectedSite] = useState("");
  const { toast } = useToast();

  const handleSubmitReport = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    toast({
      title: "Site Report Submitted",
      description: `Report for site ${selectedSite} has been submitted successfully`,
    });
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
            <label className="text-sm font-medium">Maintenance Report</label>
            <textarea
              name="report"
              className="w-full rounded-md border border-white/10 bg-white/5 p-2 min-h-[100px]"
              placeholder="Enter maintenance details..."
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

          <Button type="submit" className="w-full md:w-auto">
            Submit Site Report
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const TelecomSiteReport = () => {
  const { toast } = useToast();

  const handleSubmitReport = () => {
    toast({
      title: "Site Report Submitted",
      description: "Your telecom site report has been submitted successfully",
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
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">Site Location</label>
            <input
              type="text"
              className="w-full rounded-md border border-gray-300 bg-white/5 p-2"
              placeholder="Enter site location"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Site Status</label>
            <select className="w-full rounded-md border border-gray-300 bg-white/5 p-2">
              <option value="operational">Operational</option>
              <option value="maintenance">Under Maintenance</option>
              <option value="offline">Offline</option>
            </select>
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Maintenance Report</label>
          <textarea
            className="w-full rounded-md border border-gray-300 bg-white/5 p-2 min-h-[100px]"
            placeholder="Enter maintenance details..."
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Upload Site Images</label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
            <Upload className="h-8 w-8 mx-auto text-gray-400" />
            <p className="text-sm text-gray-500 mt-2">Drop files here or click to upload</p>
          </div>
        </div>
        <Button onClick={handleSubmitReport} className="w-full md:w-auto">
          Submit Site Report
        </Button>
      </CardContent>
    </Card>
  );
};
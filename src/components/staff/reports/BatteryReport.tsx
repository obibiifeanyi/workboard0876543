import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Battery, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const BatteryReport = () => {
  const [selectedBattery, setSelectedBattery] = useState("");
  const { toast } = useToast();

  const handleSubmitReport = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    toast({
      title: "Battery Report Submitted",
      description: `Report for battery ${selectedBattery} has been submitted successfully`,
    });
  };

  return (
    <Card className="bg-black/10 dark:bg-white/5 backdrop-blur-lg border-none">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg font-medium">
          <Battery className="h-5 w-5 text-primary" />
          Solar Battery Report
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmitReport} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Select Battery</label>
            <Select
              value={selectedBattery}
              onValueChange={setSelectedBattery}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a battery" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="BAT-001">BAT-001 - Main Storage</SelectItem>
                <SelectItem value="BAT-002">BAT-002 - Backup Unit</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Battery Status</label>
            <Select name="status" defaultValue="operational">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="operational">Operational</SelectItem>
                <SelectItem value="maintenance">Needs Maintenance</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Charge Level (%)</label>
            <Input 
              type="number" 
              name="chargeLevel" 
              min="0" 
              max="100" 
              defaultValue="100" 
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Maintenance Notes</label>
            <textarea
              name="notes"
              className="w-full rounded-md border border-white/10 bg-white/5 p-2 min-h-[100px]"
              placeholder="Enter maintenance details..."
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Upload Diagnostics Data</label>
            <div className="border-2 border-dashed border-white/10 rounded-lg p-4 text-center">
              <Upload className="h-8 w-8 mx-auto text-primary" />
              <p className="text-sm text-muted-foreground mt-2">
                Drop files here or click to upload
              </p>
              <input
                type="file"
                className="hidden"
                accept=".csv,.xlsx,.pdf"
                multiple
              />
            </div>
          </div>

          <Button type="submit" className="w-full md:w-auto">
            Submit Battery Report
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
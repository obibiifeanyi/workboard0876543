
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FleetExpenseTracking } from "@/components/fleet/FleetExpenseTracking";
import { Button } from "@/components/ui/button";
import { Download, FileText } from "lucide-react";

export const FleetAccountingManagement = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="h-6 w-6 text-red-600" />
          <h1 className="text-2xl font-bold">Fleet Accounting</h1>
        </div>
        <Button variant="outline" className="border-red-600 text-red-600">
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>

      <FleetExpenseTracking />
    </div>
  );
};

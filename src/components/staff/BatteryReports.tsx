
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BatteryReport } from "@/components/staff/reports/BatteryReport";
import { Battery } from "lucide-react";

export const BatteryReports = () => {
  return (
    <Card className="bg-black/10 dark:bg-white/5 backdrop-blur-lg border-none">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl md:text-2xl">
          <Battery className="h-6 w-6 text-primary" />
          Battery Reports
        </CardTitle>
      </CardHeader>
      <CardContent>
        <BatteryReport />
      </CardContent>
    </Card>
  );
};

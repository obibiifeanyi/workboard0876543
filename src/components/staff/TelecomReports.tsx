
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TelecomSiteReport } from "@/components/staff/reports/TelecomSiteReport";
import { Radio } from "lucide-react";

export const TelecomReports = () => {
  return (
    <Card className="bg-black/10 dark:bg-white/5 backdrop-blur-lg border-none">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl md:text-2xl">
          <Radio className="h-6 w-6 text-primary" />
          Telecom Reports
        </CardTitle>
      </CardHeader>
      <CardContent>
        <TelecomSiteReport />
      </CardContent>
    </Card>
  );
};

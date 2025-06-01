
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WeeklyReport } from "@/components/staff/reports/WeeklyReport";
import { BatteryReport } from "@/components/staff/reports/BatteryReport";
import { TelecomSiteReport } from "@/components/staff/reports/TelecomSiteReport";
import { FileText } from "lucide-react";

export const Reports = () => {
  return (
    <Card className="bg-black/10 dark:bg-white/5 backdrop-blur-lg border-none">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl md:text-2xl">
          <FileText className="h-6 w-6 text-primary" />
          Reports
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="weekly" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="weekly">Weekly Reports</TabsTrigger>
            <TabsTrigger value="battery">Battery Reports</TabsTrigger>
            <TabsTrigger value="telecom">Telecom Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="weekly">
            <WeeklyReport />
          </TabsContent>

          <TabsContent value="battery">
            <BatteryReport />
          </TabsContent>

          <TabsContent value="telecom">
            <TelecomSiteReport />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

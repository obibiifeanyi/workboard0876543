
import { DashboardLayout } from "@/components/DashboardLayout";
import { TelecomReportForm } from "@/components/telecom/TelecomReportForm";
import { TelecomReportsDashboard } from "@/components/telecom/TelecomReportsDashboard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const TelecomReports = () => {
  return (
    <DashboardLayout title="Telecom Reports">
      <div className="space-y-6 p-4 md:p-6 max-w-7xl mx-auto animate-fade-in">
        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="dashboard">View Reports</TabsTrigger>
            <TabsTrigger value="create">Create Report</TabsTrigger>
          </TabsList>
          
          <TabsContent value="dashboard" className="mt-6">
            <TelecomReportsDashboard />
          </TabsContent>
          
          <TabsContent value="create" className="mt-6">
            <TelecomReportForm />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default TelecomReports;

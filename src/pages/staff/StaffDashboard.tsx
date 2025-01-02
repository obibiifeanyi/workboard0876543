import { DashboardLayout } from "@/components/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PerformanceMetrics } from "@/components/staff/PerformanceMetrics";
import { ProjectReport } from "@/components/staff/reports/ProjectReport";
import { TelecomSiteReport } from "@/components/staff/reports/TelecomSiteReport";
import { WeeklyReport } from "@/components/staff/reports/WeeklyReport";
import { MemoGeneration } from "@/components/staff/MemoGeneration";
import { ProjectTracking } from "@/components/staff/ProjectTracking";
import { ChatBox } from "@/components/ChatBox";

const StaffDashboard = () => {
  return (
    <DashboardLayout title="Staff Dashboard">
      <div className="space-y-6 p-4 md:p-6">
        <PerformanceMetrics />

        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
          <ProjectTracking />
          <MemoGeneration />
        </div>

        <Tabs defaultValue="project" className="space-y-4">
          <TabsList className="grid grid-cols-1 sm:grid-cols-4 gap-2">
            <TabsTrigger value="project">Project Report</TabsTrigger>
            <TabsTrigger value="site">Site Report</TabsTrigger>
            <TabsTrigger value="weekly">Weekly Report</TabsTrigger>
            <TabsTrigger value="memo">Memos</TabsTrigger>
          </TabsList>

          <div className="mt-6 bg-black/5 dark:bg-black/20 rounded-3xl p-4 md:p-6">
            <TabsContent value="project" className="mt-0">
              <ProjectReport />
            </TabsContent>

            <TabsContent value="site" className="mt-0">
              <TelecomSiteReport />
            </TabsContent>

            <TabsContent value="weekly" className="mt-0">
              <WeeklyReport />
            </TabsContent>

            <TabsContent value="memo" className="mt-0">
              <MemoGeneration />
            </TabsContent>
          </div>
        </Tabs>
      </div>

      {/* Collapsible AI Chat Box */}
      <ChatBox />
    </DashboardLayout>
  );
};

export default StaffDashboard;
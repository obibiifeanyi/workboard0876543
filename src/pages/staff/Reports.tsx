import { DashboardLayout } from "@/components/DashboardLayout";
import { WeeklyReport } from "@/components/staff/reports/WeeklyReport";
import { ProjectReport } from "@/components/staff/reports/ProjectReport";
import { TelecomSiteReport } from "@/components/staff/reports/TelecomSiteReport";

const Reports = () => {
  return (
    <DashboardLayout title="Reports">
      <div className="space-y-6 p-4 md:p-6 max-w-7xl mx-auto animate-fade-in">
        <div className="grid gap-6">
          <WeeklyReport />
          <ProjectReport />
          <TelecomSiteReport />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Reports;
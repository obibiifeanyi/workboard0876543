import { DashboardLayout } from "@/components/DashboardLayout";
import { ProjectReport } from "@/components/staff/reports/ProjectReport";
import { WeeklyReport } from "@/components/staff/reports/WeeklyReport";

const Reports = () => {
  return (
    <DashboardLayout title="Reports">
      <div className="space-y-6 p-4 md:p-6 max-w-7xl mx-auto animate-fade-in">
        <ProjectReport />
        <WeeklyReport />
      </div>
    </DashboardLayout>
  );
};

export default Reports;
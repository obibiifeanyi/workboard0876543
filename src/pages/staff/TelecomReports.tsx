import { DashboardLayout } from "@/components/DashboardLayout";
import { TelecomSiteReport } from "@/components/staff/reports/TelecomSiteReport";

const TelecomReports = () => {
  return (
    <DashboardLayout title="Telecom Reports">
      <div className="space-y-6 p-4 md:p-6 max-w-7xl mx-auto animate-fade-in">
        <TelecomSiteReport />
      </div>
    </DashboardLayout>
  );
};

export default TelecomReports;
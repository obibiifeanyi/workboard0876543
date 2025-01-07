import { DashboardLayout } from "@/components/DashboardLayout";
import { BatteryReport } from "@/components/staff/reports/BatteryReport";

const BatteryReports = () => {
  return (
    <DashboardLayout title="Battery Reports">
      <div className="space-y-6 p-4 md:p-6 max-w-7xl mx-auto animate-fade-in">
        <BatteryReport />
      </div>
    </DashboardLayout>
  );
};

export default BatteryReports;
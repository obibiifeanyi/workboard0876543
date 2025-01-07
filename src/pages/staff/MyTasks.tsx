import { DashboardLayout } from "@/components/DashboardLayout";
import { ProjectTracking } from "@/components/staff/ProjectTracking";
import { PerformanceMetrics } from "@/components/staff/PerformanceMetrics";

const MyTasks = () => {
  return (
    <DashboardLayout title="My Tasks">
      <div className="space-y-6 p-4 md:p-6 max-w-7xl mx-auto animate-fade-in">
        <PerformanceMetrics />
        <ProjectTracking />
      </div>
    </DashboardLayout>
  );
};

export default MyTasks;
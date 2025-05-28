
import { DashboardLayout } from "@/components/DashboardLayout";
import { CurrentTasks as CurrentTasksComponent } from "@/components/staff/CurrentTasks";

const CurrentTasks = () => {
  return (
    <DashboardLayout title="Current Tasks">
      <div className="p-6">
        <CurrentTasksComponent />
      </div>
    </DashboardLayout>
  );
};

export default CurrentTasks;

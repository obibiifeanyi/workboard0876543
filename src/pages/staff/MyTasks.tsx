
import { DashboardLayout } from "@/components/DashboardLayout";
import { MyTasks as MyTasksComponent } from "@/components/staff/MyTasks";

const MyTasks = () => {
  return (
    <DashboardLayout title="My Tasks">
      <div className="p-6">
        <MyTasksComponent />
      </div>
    </DashboardLayout>
  );
};

export default MyTasks;

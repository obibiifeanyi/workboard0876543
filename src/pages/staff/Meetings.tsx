
import { DashboardLayout } from "@/components/DashboardLayout";
import { Meetings as MeetingsComponent } from "@/components/staff/Meetings";

const Meetings = () => {
  return (
    <DashboardLayout title="Meetings">
      <div className="space-y-6 p-4 md:p-6 max-w-7xl mx-auto animate-fade-in">
        <MeetingsComponent />
      </div>
    </DashboardLayout>
  );
};

export default Meetings;

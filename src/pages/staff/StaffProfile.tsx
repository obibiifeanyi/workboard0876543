import { DashboardLayout } from "@/components/DashboardLayout";
import { ProfileSection } from "@/components/staff/ProfileSection";
import { LeaveApplication } from "@/components/staff/LeaveApplication";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const StaffProfile = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const { toast } = useToast();

  return (
    <DashboardLayout title="Profile">
      <div className="space-y-6 p-4 md:p-6 max-w-7xl mx-auto animate-fade-in">
        <ProfileSection />
        <LeaveApplication
          date={date}
          onDateSelect={setDate}
          onLeaveRequest={() => {
            toast({
              title: "Leave Request Submitted",
              description: `Your leave request for ${date?.toLocaleDateString()} has been submitted.`,
            });
          }}
        />
      </div>
    </DashboardLayout>
  );
};

export default StaffProfile;
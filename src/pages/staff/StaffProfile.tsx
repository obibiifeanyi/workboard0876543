import { DashboardLayout } from "@/components/DashboardLayout";
import { ProfileSection } from "@/components/staff/ProfileSection";

const StaffProfile = () => {
  return (
    <DashboardLayout title="My Profile">
      <div className="space-y-6 p-4 md:p-6 max-w-7xl mx-auto animate-fade-in">
        <ProfileSection />
      </div>
    </DashboardLayout>
  );
};

export default StaffProfile;
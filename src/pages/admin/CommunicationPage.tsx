import { DashboardLayout } from "@/components/DashboardLayout";
import { CommunicationCenter } from "@/components/admin/CommunicationCenter";

export const CommunicationPage = () => {
  return (
    <DashboardLayout>
      <div className="container mx-auto p-6">
        <CommunicationCenter />
      </div>
    </DashboardLayout>
  );
};

export default CommunicationPage;
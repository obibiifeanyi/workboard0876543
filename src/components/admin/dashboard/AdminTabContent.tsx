
import { useAdminOperations } from "@/hooks/admin/useAdminOperations";
import { AdminOverview } from "./AdminOverview";
import { UserManagement } from "../UserManagement";
import { DepartmentManagement } from "../DepartmentManagement";
import { ProjectManagement } from "../ProjectManagement";
import { TelecomSiteManagement } from "../TelecomSiteManagement";
import { TimeAttendanceManagement } from "../TimeAttendanceManagement";
import { LeaveManagement } from "../LeaveManagement";
import { StaffMemoManagement } from "../StaffMemoManagement";
import { FleetManagement } from "../FleetManagement";
import { CommunicationCenter } from "../CommunicationCenter";
import { AdminDashboardModule } from "./AdminDashboardModule";
import { SettingsPage } from "@/components/settings/SettingsPage";
import { Loader } from "lucide-react";

interface AdminTabContentProps {
  activeTab: string;
}

export const AdminTabContent = ({ activeTab }: AdminTabContentProps) => {
  const adminOps = useAdminOperations();
  
  const isLoading = false;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="h-8 w-8 animate-spin text-red-600" />
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return <AdminOverview />;
      case "users":
        return <UserManagement />;
      case "departments":
        return <DepartmentManagement />;
      case "projects":
        return <ProjectManagement />;
      case "telecom":
        return <TelecomSiteManagement />;
      case "time":
        return <TimeAttendanceManagement />;
      case "leave":
        return <LeaveManagement />;
      case "memos":
        return <StaffMemoManagement />;
      case "fleet":
        return <FleetManagement />;
      case "communications":
        return <CommunicationCenter />;
      case "analytics":
        return <AdminDashboardModule activeTab={activeTab} />;
      case "settings":
        return <SettingsPage />;
      default:
        return <AdminOverview />;
    }
  };

  return (
    <div className="flex-1 space-y-6">
      {renderContent()}
    </div>
  );
};

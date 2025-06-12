import { AdminOverview } from "./AdminOverview";
import { UserManagement } from "@/components/staff-admin/UserManagement";
import { DepartmentManagement } from "../DepartmentManagement";
import { SettingsPage } from "../SettingsPage";
import { useAdminOperations } from "@/hooks/admin/useAdminOperations";
import { Loader2 } from "lucide-react";

interface AdminTabContentProps {
  activeTab: string;
}

export const AdminTabContent = ({ activeTab }: AdminTabContentProps) => {
  const { useAdminStats } = useAdminOperations();
  const { isLoading } = useAdminStats();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  switch (activeTab) {
    case "overview":
      return <AdminOverview />;
    case "users":
      return <UserManagement />;
    case "departments":
      return <DepartmentManagement />;
    case "settings":
      return <SettingsPage />;
    default:
      return <AdminOverview />;
  }
};

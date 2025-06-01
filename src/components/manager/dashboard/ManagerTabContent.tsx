
import { useManagerOperations } from "@/hooks/manager/useManagerOperations";
import { TaskAssignment } from "../TaskAssignment";
import { ProjectManagement } from "../ProjectManagement";
import { TeamOverview } from "../TeamOverview";
import { DepartmentManagement } from "../DepartmentManagement";
import { AnalyticsDashboard } from "../AnalyticsDashboard";
import { Loader } from "lucide-react";

interface ManagerTabContentProps {
  activeTab: string;
}

export const ManagerTabContent = ({ activeTab }: ManagerTabContentProps) => {
  const { 
    managedDepartments, 
    teamMembers, 
    projects, 
    tasks,
    isLoadingDepartments,
    isLoadingTeamMembers,
    isLoadingProjects,
    isLoadingTasks
  } = useManagerOperations();

  const isLoading = isLoadingDepartments || isLoadingTeamMembers || isLoadingProjects || isLoadingTasks;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="h-8 w-8 animate-spin text-red-600" />
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case "team":
        return <TeamOverview teamMembers={teamMembers} departments={managedDepartments} />;
      case "sites":
        return <ProjectManagement />;
      case "workboard":
        return <TaskAssignment />;
      case "construction":
        return <DepartmentManagement />;
      case "analytics":
        return <AnalyticsDashboard />;
      default:
        return <TeamOverview teamMembers={teamMembers} departments={managedDepartments} />;
    }
  };

  return (
    <div className="flex-1 space-y-6">
      {renderContent()}
    </div>
  );
};

import { TimeManagement } from "@/components/admin/TimeManagement";
import { AIManagementSystem } from "@/components/ai/AIManagementSystem";
import { AIKnowledgeBase } from "@/components/ai/AIKnowledgeBase";
import { TelecomSites } from "@/components/admin/TelecomSites";
import { ProjectManagement } from "@/components/admin/ProjectManagement";
import { LeaveManagement } from "@/components/admin/LeaveManagement";
import { UserManagement } from "@/components/admin/UserManagement";
import { DepartmentManagement } from "@/components/admin/DepartmentManagement";
import { ActivityManagement } from "@/components/admin/ActivityManagement";
import { TabsContent } from "@/components/ui/tabs";

export const AdminTabContent = () => {
  return (
    <>
      <TabsContent value="time" className="space-y-4">
        <TimeManagement />
      </TabsContent>

      <TabsContent value="ai" className="space-y-4">
        <AIManagementSystem />
      </TabsContent>

      <TabsContent value="knowledge" className="space-y-4">
        <AIKnowledgeBase />
      </TabsContent>

      <TabsContent value="telecom" className="space-y-4">
        <TelecomSites />
      </TabsContent>

      <TabsContent value="projects" className="space-y-4">
        <ProjectManagement />
      </TabsContent>

      <TabsContent value="leave" className="space-y-4">
        <LeaveManagement />
      </TabsContent>

      <TabsContent value="users" className="space-y-4">
        <UserManagement />
      </TabsContent>

      <TabsContent value="departments" className="space-y-4">
        <DepartmentManagement />
      </TabsContent>

      <TabsContent value="activity" className="space-y-4">
        <ActivityManagement />
      </TabsContent>
    </>
  );
};
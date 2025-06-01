
import { TabsContent } from "@/components/ui/tabs";
import { UserManagement } from "@/components/admin/UserManagement";
import { ProjectManagement } from "@/components/admin/ProjectManagement";
import { TimeAttendanceManagement } from "@/components/admin/TimeAttendanceManagement";
import { LeaveManagement } from "@/components/admin/LeaveManagement";
import { CommunicationCenter } from "@/components/admin/CommunicationCenter";
import { APIKeyManagement } from "@/components/admin/APIKeyManagement";
import { AdminOverview } from "./AdminOverview";

export const AdminTabContent = () => {
  return (
    <>
      <TabsContent value="overview" className="space-y-6 mt-0">
        <AdminOverview />
      </TabsContent>

      <TabsContent value="users" className="space-y-6 mt-0">
        <UserManagement />
      </TabsContent>

      <TabsContent value="projects" className="space-y-6 mt-0">
        <ProjectManagement />
      </TabsContent>

      <TabsContent value="time" className="space-y-6 mt-0">
        <TimeAttendanceManagement />
      </TabsContent>

      <TabsContent value="leave" className="space-y-6 mt-0">
        <LeaveManagement />
      </TabsContent>

      <TabsContent value="communication" className="space-y-6 mt-0">
        <CommunicationCenter />
      </TabsContent>

      <TabsContent value="settings" className="space-y-6 mt-0">
        <APIKeyManagement />
      </TabsContent>
    </>
  );
};

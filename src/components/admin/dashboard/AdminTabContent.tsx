
import { TabsContent } from "@/components/ui/tabs";
import { UserManagement } from "@/components/admin/UserManagement";
import { ProjectManagement } from "@/components/admin/ProjectManagement";
import { TimeManagement } from "@/components/admin/TimeManagement";
import { LeaveManagement } from "@/components/admin/LeaveManagement";
import { CommunicationCenter } from "@/components/admin/CommunicationCenter";
import { APIKeyManagement } from "@/components/admin/APIKeyManagement";
import { TelecomSiteManagement } from "@/components/telecom/TelecomSiteManagement";

export const AdminTabContent = () => {
  return (
    <>
      <TabsContent value="overview" className="space-y-6 mt-0">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">System Overview</h3>
            <p className="text-muted-foreground">
              Monitor system performance and user activity from this central dashboard.
            </p>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="users" className="space-y-6 mt-0">
        <UserManagement />
      </TabsContent>

      <TabsContent value="projects" className="space-y-6 mt-0">
        <div className="grid gap-6">
          <ProjectManagement />
          <TelecomSiteManagement />
        </div>
      </TabsContent>

      <TabsContent value="time" className="space-y-6 mt-0">
        <TimeManagement />
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

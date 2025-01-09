import { WorkBoard } from "@/components/manager/WorkBoard";
import { LeaveManagement } from "@/components/manager/LeaveManagement";
import { TeamOverview } from "@/components/manager/TeamOverview";
import { TelecomSites } from "@/components/manager/TelecomSites";
import { TeamTimeManagement } from "@/components/manager/TeamTimeManagement";
import { EmailNotificationCenter } from "@/components/notifications/EmailNotificationCenter";
import { ProjectReportForm } from "@/components/reports/ProjectReportForm";
import { MemoManagement } from "@/components/memos/MemoManagement";
import { InvoiceManagement } from "@/components/manager/InvoiceManagement";
import { TabsContent } from "@/components/ui/tabs";

export const ManagerTabContent = () => {
  return (
    <>
      <TabsContent value="time" className="space-y-6 mt-0">
        <TeamTimeManagement />
      </TabsContent>

      <TabsContent value="workboard" className="space-y-6 mt-0">
        <WorkBoard />
      </TabsContent>

      <TabsContent value="leave" className="space-y-6 mt-0">
        <LeaveManagement />
      </TabsContent>

      <TabsContent value="team" className="space-y-6 mt-0">
        <TeamOverview />
      </TabsContent>

      <TabsContent value="sites" className="space-y-6 mt-0">
        <TelecomSites />
      </TabsContent>

      <TabsContent value="reports" className="space-y-6 mt-0">
        <ProjectReportForm />
      </TabsContent>

      <TabsContent value="memos" className="space-y-6 mt-0">
        <MemoManagement />
      </TabsContent>

      <TabsContent value="invoices" className="space-y-6 mt-0">
        <InvoiceManagement />
      </TabsContent>

      <TabsContent value="settings" className="space-y-6 mt-0">
        <EmailNotificationCenter />
      </TabsContent>
    </>
  );
};
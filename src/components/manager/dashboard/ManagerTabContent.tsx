
import { WorkBoard } from "@/components/manager/WorkBoard";
import { LeaveManagement } from "@/components/manager/LeaveManagement";
import { TeamOverview } from "@/components/manager/TeamOverview";
import { TelecomSites } from "@/components/manager/TelecomSites";
import { TeamTimeManagement } from "@/components/manager/TeamTimeManagement";
import { EmailNotificationCenter } from "@/components/notifications/EmailNotificationCenter";
import { MemoManagement } from "@/components/memos/MemoManagement";
import { InvoiceManagement } from "@/components/manager/InvoiceManagement";
import { InvoiceGenerator } from "@/components/invoices/InvoiceGenerator";
import { InvoiceTable } from "@/components/invoices/InvoiceTable";
import { ConstructionSiteManagement } from "@/components/construction/ConstructionSiteManagement";
import { ProjectReportManagement } from "@/components/reports/ProjectReportManagement";
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

      <TabsContent value="construction" className="space-y-6 mt-0">
        <ConstructionSiteManagement />
      </TabsContent>

      <TabsContent value="reports" className="space-y-6 mt-0">
        <ProjectReportManagement />
      </TabsContent>

      <TabsContent value="memos" className="space-y-6 mt-0">
        <MemoManagement />
      </TabsContent>

      <TabsContent value="invoices" className="space-y-6 mt-0">
        <div className="space-y-6">
          <InvoiceGenerator />
          <InvoiceTable />
        </div>
      </TabsContent>

      <TabsContent value="settings" className="space-y-6 mt-0">
        <EmailNotificationCenter />
      </TabsContent>
    </>
  );
};

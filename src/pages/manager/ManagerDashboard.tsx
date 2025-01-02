import { DashboardLayout } from "@/components/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WorkBoard } from "@/components/manager/WorkBoard";
import { LeaveManagement } from "@/components/manager/LeaveManagement";
import { TeamOverview } from "@/components/manager/TeamOverview";
import { TelecomSites } from "@/components/manager/TelecomSites";
import { NotificationCenter } from "@/components/NotificationCenter";

const ManagerDashboard = () => {
  return (
    <DashboardLayout title="Manager Dashboard">
      <div className="space-y-6 animate-fade-in">
        <Tabs defaultValue="workboard" className="space-y-4">
          <TabsList className="grid w-full grid-cols-1 md:grid-cols-4 gap-4">
            <TabsTrigger value="workboard">Work Board</TabsTrigger>
            <TabsTrigger value="leave">Leave Management</TabsTrigger>
            <TabsTrigger value="team">Team Overview</TabsTrigger>
            <TabsTrigger value="sites">Telecom Sites</TabsTrigger>
          </TabsList>

          <TabsContent value="workboard" className="space-y-4">
            <WorkBoard />
          </TabsContent>

          <TabsContent value="leave" className="space-y-4">
            <LeaveManagement />
          </TabsContent>

          <TabsContent value="team" className="space-y-4">
            <TeamOverview />
          </TabsContent>

          <TabsContent value="sites" className="space-y-4">
            <TelecomSites />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default ManagerDashboard;
import { DashboardLayout } from "@/components/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WorkBoard } from "@/components/manager/WorkBoard";
import { LeaveManagement } from "@/components/manager/LeaveManagement";
import { TeamOverview } from "@/components/manager/TeamOverview";
import { TelecomSites } from "@/components/manager/TelecomSites";
import { TeamTimeManagement } from "@/components/manager/TeamTimeManagement";

const ManagerDashboard = () => {
  return (
    <DashboardLayout title="Manager Dashboard">
      <div className="space-y-6 animate-fade-in p-6">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">My Dashboard</h1>
          <div className="flex items-center gap-4">
            <div className="relative w-64">
              <input
                type="text"
                placeholder="Search..."
                className="w-full px-4 py-2 rounded-full bg-black/10 border border-white/10 focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>
        </div>

        <Tabs defaultValue="time" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 gap-2 bg-black/20 p-1 rounded-xl">
            <TabsTrigger value="time" className="rounded-lg data-[state=active]:bg-primary">
              Time Logs
            </TabsTrigger>
            <TabsTrigger value="workboard" className="rounded-lg data-[state=active]:bg-primary">
              Work Board
            </TabsTrigger>
            <TabsTrigger value="leave" className="rounded-lg data-[state=active]:bg-primary">
              Leave Management
            </TabsTrigger>
            <TabsTrigger value="team" className="rounded-lg data-[state=active]:bg-primary">
              Team Overview
            </TabsTrigger>
            <TabsTrigger value="sites" className="rounded-lg data-[state=active]:bg-primary">
              Telecom Sites
            </TabsTrigger>
          </TabsList>

          <div className="mt-6 bg-black/10 rounded-3xl p-6">
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
          </div>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default ManagerDashboard;
import { DashboardLayout } from "@/components/DashboardLayout";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ManagerStats } from "@/components/manager/dashboard/ManagerStats";
import { ManagerTabContent } from "@/components/manager/dashboard/ManagerTabContent";
import { ChatBox } from "@/components/ChatBox";
import { DocumentAnalytics } from "@/components/documents/DocumentAnalytics";

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

        <ManagerStats />

        <DocumentAnalytics />

        <Tabs defaultValue="time" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-8 gap-2 bg-black/20 p-1 rounded-xl">
            <TabsTrigger value="time" className="rounded-lg data-[state=active]:bg-primary">
              Time Logs
            </TabsTrigger>
            <TabsTrigger value="workboard" className="rounded-lg data-[state=active]:bg-primary">
              Work Board
            </TabsTrigger>
            <TabsTrigger value="leave" className="rounded-lg data-[state=active]:bg-primary">
              Leave
            </TabsTrigger>
            <TabsTrigger value="team" className="rounded-lg data-[state=active]:bg-primary">
              Team
            </TabsTrigger>
            <TabsTrigger value="sites" className="rounded-lg data-[state=active]:bg-primary">
              Sites
            </TabsTrigger>
            <TabsTrigger value="reports" className="rounded-lg data-[state=active]:bg-primary">
              Reports
            </TabsTrigger>
            <TabsTrigger value="memos" className="rounded-lg data-[state=active]:bg-primary">
              Memos
            </TabsTrigger>
            <TabsTrigger value="settings" className="rounded-lg data-[state=active]:bg-primary">
              Settings
            </TabsTrigger>
          </TabsList>

          <div className="mt-6 bg-black/10 rounded-3xl p-6">
            <ManagerTabContent />
          </div>
        </Tabs>

        <ChatBox />
      </div>
    </DashboardLayout>
  );
};

export default ManagerDashboard;
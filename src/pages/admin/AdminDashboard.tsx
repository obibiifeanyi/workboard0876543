import { DashboardLayout } from "@/components/DashboardLayout";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminStats } from "@/components/admin/dashboard/AdminStats";
import { AdminTabContent } from "@/components/admin/dashboard/AdminTabContent";
import { Card, CardContent } from "@/components/ui/card";
import { ActivityOverview } from "@/components/admin/ActivityOverview";
import { AIDocumentUpload } from "@/components/admin/AIDocumentUpload";
import { ClockInMonitor } from "@/components/admin/ClockInMonitor";
import { ChatBox } from "@/components/ChatBox";
import { WorkProgressDonut } from "@/components/admin/dashboard/WorkProgressDonut";
import { AdminPerformanceChart } from "@/components/admin/dashboard/AdminPerformanceChart";

const AdminDashboard = () => {
  return (
    <DashboardLayout title="Admin Dashboard">
      <div className="space-y-6 p-6 animate-fade-in bg-admin-muted/5">
        {/* Top Stats Section */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <AdminStats />
        </div>

        {/* Charts and Activity Section */}
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
          {/* Activity Overview - Takes 1 column */}
          <Card className="lg:col-span-1 bg-gradient-to-br from-admin-primary/10 to-admin-secondary/5 border-admin-accent/20 shadow-lg">
            <CardContent className="p-6">
              <ActivityOverview />
            </CardContent>
          </Card>

          {/* Performance and Work Progress Charts - Take 2 columns */}
          <div className="lg:col-span-2 grid gap-6 grid-cols-1 md:grid-cols-2">
            <AdminPerformanceChart />
            <WorkProgressDonut />
          </div>
        </div>

        {/* Document Upload and Clock In Section */}
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
          <AIDocumentUpload />
          <ClockInMonitor />
        </div>

        {/* Tabs Section */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-4 bg-admin-primary/5 p-1 rounded-xl">
            <TabsTrigger 
              value="overview"
              className="data-[state=active]:bg-admin-primary data-[state=active]:text-white"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger 
              value="users"
              className="data-[state=active]:bg-admin-primary data-[state=active]:text-white"
            >
              Users
            </TabsTrigger>
            <TabsTrigger 
              value="departments"
              className="data-[state=active]:bg-admin-primary data-[state=active]:text-white"
            >
              Departments
            </TabsTrigger>
            <TabsTrigger 
              value="telecom"
              className="data-[state=active]:bg-admin-primary data-[state=active]:text-white"
            >
              Telecom Sites
            </TabsTrigger>
            <TabsTrigger 
              value="activity"
              className="data-[state=active]:bg-admin-primary data-[state=active]:text-white"
            >
              Activity Log
            </TabsTrigger>
          </TabsList>

          <div className="mt-6 bg-admin-primary/5 backdrop-blur-xl rounded-3xl p-6 border border-admin-accent/20">
            <AdminTabContent />
          </div>
        </Tabs>

        <ChatBox />
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
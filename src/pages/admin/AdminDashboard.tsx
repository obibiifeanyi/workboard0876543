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
import { CalendarDays, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

const AdminDashboard = () => {
  return (
    <DashboardLayout title="Dashboard Overview">
      <div className="space-y-6 p-6 animate-fade-in bg-[#111] min-h-screen">
        {/* Date Range and Export Section */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2 bg-[#1a1a1a] rounded-lg p-2">
            <CalendarDays className="h-4 w-4 text-primary" />
            <span className="text-sm text-muted-foreground">15 Mar 2024 - 15 Apr 2024</span>
          </div>
          <Button className="bg-[#86efac] hover:bg-[#86efac]/90 text-black">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>

        {/* Top Stats Section */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <AdminStats />
        </div>

        {/* Charts and Activity Section */}
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
          {/* Activity Overview - Takes 1 column */}
          <Card className="lg:col-span-1 bg-[#1a1a1a] border-none shadow-xl">
            <CardContent className="p-6">
              <ActivityOverview />
            </CardContent>
          </Card>

          {/* Performance and Work Progress Charts - Take 2 columns */}
          <div className="lg:col-span-2 grid gap-6 grid-cols-1 md:grid-cols-2">
            <Card className="bg-[#1a1a1a] border-none shadow-xl">
              <CardContent className="p-6">
                <AdminPerformanceChart />
              </CardContent>
            </Card>
            <Card className="bg-[#1a1a1a] border-none shadow-xl">
              <CardContent className="p-6">
                <WorkProgressDonut />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Document Upload and Clock In Section */}
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
          <Card className="bg-[#1a1a1a] border-none shadow-xl">
            <CardContent className="p-6">
              <AIDocumentUpload />
            </CardContent>
          </Card>
          <Card className="bg-[#1a1a1a] border-none shadow-xl">
            <CardContent className="p-6">
              <ClockInMonitor />
            </CardContent>
          </Card>
        </div>

        {/* Tabs Section */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-4 bg-[#1a1a1a] p-1 rounded-xl">
            <TabsTrigger 
              value="overview"
              className="data-[state=active]:bg-[#86efac] data-[state=active]:text-black"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger 
              value="users"
              className="data-[state=active]:bg-[#86efac] data-[state=active]:text-black"
            >
              Users
            </TabsTrigger>
            <TabsTrigger 
              value="departments"
              className="data-[state=active]:bg-[#86efac] data-[state=active]:text-black"
            >
              Departments
            </TabsTrigger>
            <TabsTrigger 
              value="telecom"
              className="data-[state=active]:bg-[#86efac] data-[state=active]:text-black"
            >
              Telecom Sites
            </TabsTrigger>
            <TabsTrigger 
              value="activity"
              className="data-[state=active]:bg-[#86efac] data-[state=active]:text-black"
            >
              Activity Log
            </TabsTrigger>
          </TabsList>

          <div className="mt-6 bg-[#1a1a1a] backdrop-blur-xl rounded-3xl p-6 border-none shadow-xl">
            <AdminTabContent />
          </div>
        </Tabs>

        <ChatBox />
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
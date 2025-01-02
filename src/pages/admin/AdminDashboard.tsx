import { DashboardLayout } from "@/components/DashboardLayout";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminStats } from "@/components/admin/dashboard/AdminStats";
import { AdminPerformanceChart } from "@/components/admin/dashboard/AdminPerformanceChart";
import { AdminTabContent } from "@/components/admin/dashboard/AdminTabContent";

const AdminDashboard = () => {
  return (
    <DashboardLayout title="Admin Dashboard">
      <div className="space-y-6 animate-fade-in">
        <AdminStats />
        <AdminPerformanceChart />

        <Tabs defaultValue="time" className="space-y-4">
          <TabsList className="grid w-full grid-cols-1 md:grid-cols-9 lg:grid-cols-9 gap-4">
            <TabsTrigger value="time">Time Logs</TabsTrigger>
            <TabsTrigger value="ai">AI Management</TabsTrigger>
            <TabsTrigger value="knowledge">Knowledge Base</TabsTrigger>
            <TabsTrigger value="telecom">Telecom Sites</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="leave">Leave Management</TabsTrigger>
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="departments">Departments</TabsTrigger>
            <TabsTrigger value="activity">Activity Log</TabsTrigger>
          </TabsList>

          <AdminTabContent />
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
import { DashboardLayout } from "@/components/DashboardLayout";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminStats } from "@/components/admin/dashboard/AdminStats";
import { AdminTabContent } from "@/components/admin/dashboard/AdminTabContent";
import { Card, CardContent } from "@/components/ui/card";
import { ActivityOverview } from "@/components/admin/ActivityOverview";

const AdminDashboard = () => {
  return (
    <DashboardLayout title="Admin Dashboard">
      <div className="space-y-6 p-6 animate-fade-in">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <AdminStats />
          <Card className="col-span-full lg:col-span-2">
            <CardContent className="p-6">
              <ActivityOverview />
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="departments">Departments</TabsTrigger>
            <TabsTrigger value="telecom">Telecom Sites</TabsTrigger>
            <TabsTrigger value="activity">Activity Log</TabsTrigger>
          </TabsList>

          <AdminTabContent />
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
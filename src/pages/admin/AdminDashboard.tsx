import { DashboardLayout } from "@/components/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TelecomSites } from "@/components/admin/TelecomSites";
import { ProjectManagement } from "@/components/admin/ProjectManagement";
import { LeaveManagement } from "@/components/admin/LeaveManagement";
import { UserManagement } from "@/components/admin/UserManagement";

const AdminDashboard = () => {
  return (
    <DashboardLayout title="Admin Dashboard">
      <div className="space-y-6 animate-fade-in">
        <Tabs defaultValue="telecom" className="space-y-4">
          <TabsList className="grid w-full grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-4">
            <TabsTrigger value="telecom">Telecom Sites</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="leave">Leave Management</TabsTrigger>
            <TabsTrigger value="users">User Management</TabsTrigger>
          </TabsList>

          <TabsContent value="telecom" className="space-y-4">
            <TelecomSites />
          </TabsContent>

          <TabsContent value="projects" className="space-y-4">
            <ProjectManagement />
          </TabsContent>

          <TabsContent value="leave" className="space-y-4">
            <LeaveManagement />
          </TabsContent>

          <TabsContent value="users" className="space-y-4">
            <UserManagement />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
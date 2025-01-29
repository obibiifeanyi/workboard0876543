import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminDashboardModule } from "./dashboard/AdminDashboardModule";
import { UserList } from "@/components/admin/UserList";
import { UserForm } from "@/components/admin/UserForm";

export const UserManagement = () => {
  return (
    <Tabs defaultValue="dashboard" className="space-y-6">
      <TabsList className="grid w-full grid-cols-1 md:grid-cols-3 gap-4">
        <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
        <TabsTrigger value="users">User List</TabsTrigger>
        <TabsTrigger value="new">Add User</TabsTrigger>
      </TabsList>

      <TabsContent value="dashboard" className="space-y-4">
        <AdminDashboardModule />
      </TabsContent>

      <TabsContent value="users" className="space-y-4">
        <UserList />
      </TabsContent>

      <TabsContent value="new" className="space-y-4">
        <UserForm />
      </TabsContent>
    </Tabs>
  );
};
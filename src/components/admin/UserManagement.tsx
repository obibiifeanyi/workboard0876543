import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminDashboardModule } from "./dashboard/AdminDashboardModule";
import { UserList } from "@/components/admin/UserList";
import { UserForm } from "@/components/admin/UserForm";
import { useToast } from "@/components/ui/use-toast";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  avatar?: string;
}

export const UserManagement = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    // Switch to the edit form tab
    const tabsElement = document.querySelector('[role="tablist"]');
    const newTab = tabsElement?.querySelector('[value="new"]') as HTMLButtonElement;
    if (newTab) {
      newTab.click();
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const userData = {
      id: selectedUser?.id || crypto.randomUUID(),
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      role: formData.get('role') as string,
      department: formData.get('department') as string,
    };

    if (selectedUser) {
      // Update existing user
      setUsers(users.map(user => 
        user.id === selectedUser.id ? { ...user, ...userData } : user
      ));
      toast({
        title: "Success",
        description: "User updated successfully",
      });
    } else {
      // Add new user
      setUsers([...users, userData]);
      toast({
        title: "Success",
        description: "User added successfully",
      });
    }

    // Reset form and selected user
    setSelectedUser(null);
    e.currentTarget.reset();
  };

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
        <UserList 
          users={users} 
          onEditUser={handleEditUser}
        />
      </TabsContent>

      <TabsContent value="new" className="space-y-4">
        <UserForm 
          onSubmit={handleSubmit}
          defaultValues={selectedUser || undefined}
        />
      </TabsContent>
    </Tabs>
  );
};
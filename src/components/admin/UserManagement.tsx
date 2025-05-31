
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminDashboardModule } from "./dashboard/AdminDashboardModule";
import { UserList } from "@/components/admin/UserList";
import { UserForm } from "@/components/admin/UserForm";
import { DepartmentManagement } from "@/components/admin/DepartmentManagement";
import { ProjectManagement } from "@/components/admin/ProjectManagement";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Transform the data to match the User interface
      const transformedUsers: User[] = (data || []).map(profile => ({
        id: profile.id,
        name: profile.full_name || 'No Name',
        email: profile.email || '',
        role: profile.account_type || 'staff',
        department: profile.department || 'Not Assigned',
        avatar: profile.avatar_url || undefined
      }));
      
      setUsers(transformedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error",
        description: "Failed to fetch users",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    // Switch to the edit form tab
    const tabsElement = document.querySelector('[role="tablist"]');
    const newTab = tabsElement?.querySelector('[value="new"]') as HTMLButtonElement;
    if (newTab) {
      newTab.click();
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const userData = {
      full_name: formData.get('name') as string,
      email: formData.get('email') as string,
      account_type: formData.get('role') as string,
      department: formData.get('department') as string,
    };

    try {
      if (selectedUser) {
        // Update existing user
        const { error } = await supabase
          .from('profiles')
          .update(userData)
          .eq('id', selectedUser.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "User updated successfully",
        });
      } else {
        // For new users, you'd typically handle this through auth signup
        toast({
          title: "Info",
          description: "New user creation requires invitation system",
        });
      }

      // Reset form and selected user
      setSelectedUser(null);
      e.currentTarget.reset();
      fetchUsers();
    } catch (error) {
      console.error('Error saving user:', error);
      toast({
        title: "Error",
        description: "Failed to save user",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading users...</div>;
  }

  return (
    <Tabs defaultValue="dashboard" className="space-y-6">
      <TabsList className="grid w-full grid-cols-1 md:grid-cols-5 gap-4">
        <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
        <TabsTrigger value="users">Users</TabsTrigger>
        <TabsTrigger value="new">Add User</TabsTrigger>
        <TabsTrigger value="departments">Departments</TabsTrigger>
        <TabsTrigger value="projects">Projects</TabsTrigger>
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
          defaultValues={selectedUser ? {
            name: selectedUser.name,
            email: selectedUser.email,
            role: selectedUser.role,
            department: selectedUser.department
          } : undefined}
        />
      </TabsContent>

      <TabsContent value="departments" className="space-y-4">
        <DepartmentManagement />
      </TabsContent>

      <TabsContent value="projects" className="space-y-4">
        <ProjectManagement />
      </TabsContent>
    </Tabs>
  );
};

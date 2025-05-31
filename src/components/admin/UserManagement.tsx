
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserList } from "@/components/admin/UserList";
import { UserForm } from "@/components/admin/UserForm";
import { DepartmentManagement } from "@/components/admin/DepartmentManagement";
import { ProjectManagement } from "@/components/admin/ProjectManagement";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Users, UserPlus, Building2, FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

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
  const [activeTab, setActiveTab] = useState("users");

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
    setActiveTab("new");
  };

  const handleCreateUser = () => {
    setSelectedUser(null);
    setActiveTab("new");
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
        const { data, error } = await supabase.auth.signUp({
          email: userData.email,
          password: "TemporaryPassword123!",
          options: {
            data: {
              full_name: userData.full_name,
              account_type: userData.account_type,
            }
          }
        });

        if (error) throw error;
        
        toast({
          title: "Success",
          description: "User created successfully. A verification email has been sent.",
        });
      }

      setSelectedUser(null);
      e.currentTarget.reset();
      setActiveTab("users");
      fetchUsers();
    } catch (error: any) {
      console.error('Error saving user:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save user",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Enhanced Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-red-600/10 to-red-500/10 
                     border border-red-600/20 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-gradient-to-r from-red-600 to-red-700 shadow-lg">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">
                User Management
              </h2>
              <p className="text-muted-foreground">Manage users, departments, and projects</p>
            </div>
          </div>
          <Button 
            onClick={handleCreateUser}
            className="bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 shadow-lg hover:shadow-red-600/25 rounded-[30px]"
          >
            <UserPlus className="mr-2 h-4 w-4" />
            Add New User
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="p-2 rounded-3xl bg-gradient-to-r from-red-600/5 to-red-500/5 
                       border border-red-600/20 backdrop-blur-sm">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 gap-2 bg-transparent p-1">
            <TabsTrigger 
              value="users"
              className="rounded-2xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600 
                       data-[state=active]:to-red-700 data-[state=active]:text-white
                       hover:bg-red-600/10 transition-all duration-300 font-medium
                       data-[state=active]:shadow-lg data-[state=active]:shadow-red-600/25"
            >
              <Users className="h-4 w-4 mr-2" />
              Users
            </TabsTrigger>
            <TabsTrigger 
              value="new"
              className="rounded-2xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600 
                       data-[state=active]:to-red-700 data-[state=active]:text-white
                       hover:bg-red-600/10 transition-all duration-300 font-medium
                       data-[state=active]:shadow-lg data-[state=active]:shadow-red-600/25"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              {selectedUser ? "Edit User" : "Add User"}
            </TabsTrigger>
            <TabsTrigger 
              value="departments"
              className="rounded-2xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600 
                       data-[state=active]:to-red-700 data-[state=active]:text-white
                       hover:bg-red-600/10 transition-all duration-300 font-medium
                       data-[state=active]:shadow-lg data-[state=active]:shadow-red-600/25"
            >
              <Building2 className="h-4 w-4 mr-2" />
              Departments
            </TabsTrigger>
            <TabsTrigger 
              value="projects"
              className="rounded-2xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600 
                       data-[state=active]:to-red-700 data-[state=active]:text-white
                       hover:bg-red-600/10 transition-all duration-300 font-medium
                       data-[state=active]:shadow-lg data-[state=active]:shadow-red-600/25"
            >
              <FolderOpen className="h-4 w-4 mr-2" />
              Projects
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="rounded-3xl bg-gradient-to-br from-white/90 to-white/60 dark:from-black/30 dark:to-black/20 
                       backdrop-blur-xl border border-red-600/20 shadow-2xl shadow-red-600/10 p-6">
          <TabsContent value="users" className="space-y-4 mt-0">
            <UserList 
              users={users} 
              onEditUser={handleEditUser}
            />
          </TabsContent>

          <TabsContent value="new" className="space-y-4 mt-0">
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

          <TabsContent value="departments" className="space-y-4 mt-0">
            <DepartmentManagement />
          </TabsContent>

          <TabsContent value="projects" className="space-y-4 mt-0">
            <ProjectManagement />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

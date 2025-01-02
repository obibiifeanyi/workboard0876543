import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { UserPlus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { UserList } from "./UserList";
import { UserForm } from "./UserForm";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  avatar?: string;
}

const mockUsers: User[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    role: "staff",
    department: "Operations",
    avatar: "/placeholder.svg",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    role: "manager",
    department: "HR",
    avatar: "/placeholder.svg",
  },
];

export const UserManagement = () => {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const { toast } = useToast();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const generatePassword = () => {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    return Array.from({ length: 12 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  };

  const handleAddUser = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const password = generatePassword();
    
    const newUser: User = {
      id: Date.now().toString(),
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      role: formData.get("role") as string,
      department: formData.get("department") as string,
      avatar: "/placeholder.svg",
    };

    setUsers([...users, newUser]);
    toast({
      title: "User Added Successfully",
      description: `Temporary password: ${password}`,
    });
  };

  const handleUpdateUser = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedUser) return;

    const formData = new FormData(e.currentTarget);
    const updatedUsers = users.map(user => {
      if (user.id === selectedUser.id) {
        return {
          ...user,
          name: formData.get("name") as string,
          email: formData.get("email") as string,
          role: formData.get("role") as string,
          department: formData.get("department") as string,
        };
      }
      return user;
    });

    setUsers(updatedUsers);
    setSelectedUser(null);
    toast({
      title: "User Updated Successfully",
      description: "User profile has been updated.",
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-2xl">User Management</CardTitle>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Add New User
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
            </DialogHeader>
            <UserForm onSubmit={handleAddUser} />
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <UserList users={users} onEditUser={setSelectedUser} />
        {selectedUser && (
          <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit User</DialogTitle>
              </DialogHeader>
              <UserForm 
                defaultValues={selectedUser}
                onSubmit={handleUpdateUser}
              />
            </DialogContent>
          </Dialog>
        )}
      </CardContent>
    </Card>
  );
};
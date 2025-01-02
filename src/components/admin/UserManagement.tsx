import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { UserPlus, Pencil, UserCog } from "lucide-react";

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
            <form onSubmit={handleAddUser} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" name="name" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select name="role" defaultValue="staff">
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="staff">Staff</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Select name="department" defaultValue="Operations">
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Operations">Operations</SelectItem>
                    <SelectItem value="HR">HR</SelectItem>
                    <SelectItem value="IT">IT</SelectItem>
                    <SelectItem value="Finance">Finance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full">Add User</Button>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    {user.name}
                  </div>
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell className="capitalize">{user.role}</TableCell>
                <TableCell>{user.department}</TableCell>
                <TableCell>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => setSelectedUser(user)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit User</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleUpdateUser} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="edit-name">Full Name</Label>
                          <Input 
                            id="edit-name" 
                            name="name" 
                            defaultValue={user.name}
                            required 
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="edit-email">Email</Label>
                          <Input 
                            id="edit-email" 
                            name="email" 
                            type="email" 
                            defaultValue={user.email}
                            required 
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="edit-role">Role</Label>
                          <Select name="role" defaultValue={user.role}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="admin">Admin</SelectItem>
                              <SelectItem value="manager">Manager</SelectItem>
                              <SelectItem value="staff">Staff</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="edit-department">Department</Label>
                          <Select name="department" defaultValue={user.department}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select department" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Operations">Operations</SelectItem>
                              <SelectItem value="HR">HR</SelectItem>
                              <SelectItem value="IT">IT</SelectItem>
                              <SelectItem value="Finance">Finance</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <Button type="submit" className="w-full">Update User</Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
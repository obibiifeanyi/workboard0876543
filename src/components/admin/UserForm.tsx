
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
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface UserFormProps {
  defaultValues?: {
    name: string;
    email: string;
    role: string;
    department: string;
  };
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export const UserForm = ({ defaultValues, onSubmit }: UserFormProps) => {
  const [departments, setDepartments] = useState<{id: string, name: string}[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('departments')
        .select('id, name')
        .order('name', { ascending: true });

      if (error) throw error;
      setDepartments(data || []);
    } catch (error) {
      console.error('Error fetching departments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-medium">Full Name</Label>
          <Input 
            id="name" 
            name="name" 
            defaultValue={defaultValues?.name}
            placeholder="Enter user's full name"
            className="rounded-[30px]"
            required 
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium">Email</Label>
          <Input 
            id="email" 
            name="email" 
            type="email"
            placeholder="user@example.com" 
            defaultValue={defaultValues?.email}
            className="rounded-[30px]"
            required 
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="role" className="text-sm font-medium">Role</Label>
          <Select name="role" defaultValue={defaultValues?.role || "staff"}>
            <SelectTrigger className="rounded-[30px]">
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="manager">Manager</SelectItem>
              <SelectItem value="accountant">Accountant</SelectItem>
              <SelectItem value="hr">HR</SelectItem>
              <SelectItem value="staff">Staff</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="department" className="text-sm font-medium">Department</Label>
          <Select name="department" defaultValue={defaultValues?.department || ""}>
            <SelectTrigger className="rounded-[30px]">
              <SelectValue placeholder="Select department" />
            </SelectTrigger>
            <SelectContent>
              {isLoading ? (
                <SelectItem value="" disabled>Loading departments...</SelectItem>
              ) : departments.length > 0 ? (
                departments.map(dept => (
                  <SelectItem key={dept.id} value={dept.name}>{dept.name}</SelectItem>
                ))
              ) : (
                <>
                  <SelectItem value="Operations">Operations</SelectItem>
                  <SelectItem value="HR">HR</SelectItem>
                  <SelectItem value="IT">IT</SelectItem>
                  <SelectItem value="Finance">Finance</SelectItem>
                </>
              )}
            </SelectContent>
          </Select>
        </div>
      </div>

      {!defaultValues && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-[20px] border border-yellow-200 dark:border-yellow-800/30">
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            A temporary password will be generated and the user will be required to change it on first login.
          </p>
        </div>
      )}

      <div className="flex gap-4 justify-end">
        <Button 
          type="submit" 
          className="bg-gradient-to-r from-admin-primary to-admin-secondary text-white hover:shadow-lg hover:shadow-admin-primary/25 transition-all duration-300"
        >
          {defaultValues ? "Update User" : "Create User"}
        </Button>
      </div>
    </form>
  );
};

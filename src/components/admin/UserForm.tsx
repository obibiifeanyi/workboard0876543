
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
    <form onSubmit={onSubmit} className="space-y-4 md:space-y-6">
      <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-medium text-red-700">Full Name</Label>
          <Input 
            id="name" 
            name="name" 
            defaultValue={defaultValues?.name}
            placeholder="Enter user's full name"
            className="rounded-[30px] border-red-300 focus:border-red-500 focus:ring-red-500"
            required 
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium text-red-700">Email</Label>
          <Input 
            id="email" 
            name="email" 
            type="email"
            placeholder="user@example.com" 
            defaultValue={defaultValues?.email}
            className="rounded-[30px] border-red-300 focus:border-red-500 focus:ring-red-500"
            required 
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="role" className="text-sm font-medium text-red-700">Role</Label>
          <Select name="role" defaultValue={defaultValues?.role || "staff"}>
            <SelectTrigger className="rounded-[30px] border-red-300 focus:border-red-500">
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
          <Label htmlFor="department" className="text-sm font-medium text-red-700">Department</Label>
          <Select name="department" defaultValue={defaultValues?.department || "none"}>
            <SelectTrigger className="rounded-[30px] border-red-300 focus:border-red-500">
              <SelectValue placeholder="Select department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No department assigned</SelectItem>
              {isLoading ? (
                <SelectItem value="loading" disabled>Loading departments...</SelectItem>
              ) : departments.length > 0 ? (
                departments.map(dept => (
                  <SelectItem key={dept.id} value={dept.id}>{dept.name}</SelectItem>
                ))
              ) : (
                <SelectItem value="no-departments" disabled>No departments available</SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>
      </div>

      {!defaultValues && (
        <div className="bg-red-50 dark:bg-red-900/20 p-3 md:p-4 rounded-[20px] border border-red-200 dark:border-red-800/30">
          <p className="text-sm text-red-800 dark:text-red-200">
            A temporary password will be generated and the user will be required to change it on first login.
          </p>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4 justify-end pt-4">
        <Button 
          type="submit" 
          className="bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 hover:shadow-lg hover:shadow-red-600/25 transition-all duration-300 rounded-[30px] w-full sm:w-auto"
        >
          {defaultValues ? "Update User" : "Create User"}
        </Button>
      </div>
    </form>
  );
};

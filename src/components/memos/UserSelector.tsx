
import { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { Users, Building } from "lucide-react";

interface User {
  id: string;
  full_name: string;
  email: string;
  role: string;
  account_type: string;
  department: string;
}

interface UserSelectorProps {
  selectedUserId: string;
  onUserSelect: (userId: string) => void;
  filterByDepartment?: string;
  includeAdmins?: boolean;
}

export const UserSelector = ({ 
  selectedUserId, 
  onUserSelect, 
  filterByDepartment, 
  includeAdmins = true 
}: UserSelectorProps) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [departments, setDepartments] = useState<string[]>([]);

  useEffect(() => {
    fetchUsers();
  }, [filterByDepartment, includeAdmins]);

  const fetchUsers = async () => {
    try {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      
      if (!currentUser) return;

      let query = supabase
        .from('profiles')
        .select('id, full_name, email, role, account_type, department')
        .neq('id', currentUser.id)
        .order('full_name');

      if (filterByDepartment) {
        query = query.eq('department', filterByDepartment);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching users:', error);
        return;
      }

      let filteredUsers = data || [];

      if (!includeAdmins) {
        filteredUsers = filteredUsers.filter(user => 
          user.account_type !== 'admin' && user.role !== 'admin'
        );
      }

      setUsers(filteredUsers);

      // Extract unique departments
      const uniqueDepartments = [...new Set(filteredUsers.map(user => user.department).filter(Boolean))];
      setDepartments(uniqueDepartments);

    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const groupedUsers = users.reduce((acc, user) => {
    const dept = user.department || 'No Department';
    if (!acc[dept]) acc[dept] = [];
    acc[dept].push(user);
    return acc;
  }, {} as Record<string, User[]>);

  return (
    <div className="space-y-2">
      <Select value={selectedUserId} onValueChange={onUserSelect}>
        <SelectTrigger className="bg-white/5 border-white/10 rounded-[30px]">
          <SelectValue placeholder="Select recipient..." />
        </SelectTrigger>
        <SelectContent className="bg-white/95 dark:bg-black/95 backdrop-blur-lg border-white/10">
          {loading ? (
            <SelectItem value="loading" disabled>Loading users...</SelectItem>
          ) : (
            Object.entries(groupedUsers).map(([department, departmentUsers]) => (
              <div key={department}>
                <div className="px-2 py-1 text-xs font-semibold text-muted-foreground flex items-center gap-1">
                  <Building className="h-3 w-3" />
                  {department}
                </div>
                {departmentUsers.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <div>
                        <div className="font-medium">{user.full_name || user.email}</div>
                        <div className="text-xs text-muted-foreground">
                          {user.role} • {user.account_type}
                        </div>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </div>
            ))
          )}
        </SelectContent>
      </Select>
    </div>
  );
};


import { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { Users, Building, Loader } from "lucide-react";

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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, [filterByDepartment, includeAdmins]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      
      if (!currentUser) {
        setError('User not authenticated');
        return;
      }

      console.log('Fetching users for memo recipient selection...');

      let query = supabase
        .from('profiles')
        .select('id, full_name, email, role, account_type, department')
        .neq('id', currentUser.id)
        .order('full_name');

      if (filterByDepartment) {
        query = query.eq('department', filterByDepartment);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) {
        console.error('Error fetching users:', fetchError);
        setError('Failed to load users');
        return;
      }

      let filteredUsers = data || [];

      if (!includeAdmins) {
        filteredUsers = filteredUsers.filter(user => 
          user.account_type !== 'admin' && user.role !== 'admin'
        );
      }

      console.log('Users fetched successfully:', filteredUsers);
      setUsers(filteredUsers);

    } catch (error) {
      console.error('Error fetching users:', error);
      setError('An unexpected error occurred');
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

  const selectedUser = users.find(user => user.id === selectedUserId);

  return (
    <div className="space-y-2">
      <Select value={selectedUserId} onValueChange={onUserSelect}>
        <SelectTrigger className="bg-white/5 border-white/10 rounded-[30px]">
          <SelectValue placeholder="Select recipient...">
            {selectedUser && (
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>{selectedUser.full_name || selectedUser.email}</span>
              </div>
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="bg-white/95 dark:bg-black/95 backdrop-blur-lg border-white/10 max-h-[300px]">
          {loading ? (
            <div className="flex items-center justify-center p-4">
              <Loader className="h-4 w-4 animate-spin mr-2" />
              Loading users...
            </div>
          ) : error ? (
            <div className="p-4 text-center text-red-500">
              {error}
            </div>
          ) : users.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              No users found
            </div>
          ) : (
            Object.entries(groupedUsers).map(([department, departmentUsers]) => (
              <div key={department}>
                <div className="px-2 py-1 text-xs font-semibold text-muted-foreground flex items-center gap-1 sticky top-0 bg-white/95 dark:bg-black/95">
                  <Building className="h-3 w-3" />
                  {department}
                </div>
                {departmentUsers.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    <div className="flex items-center gap-2 w-full">
                      <Users className="h-4 w-4" />
                      <div className="flex-1">
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
      
      {error && (
        <button 
          onClick={fetchUsers}
          className="text-xs text-blue-500 hover:text-blue-700 underline"
        >
          Retry loading users
        </button>
      )}
    </div>
  );
};

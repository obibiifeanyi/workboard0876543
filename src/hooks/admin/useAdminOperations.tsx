
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useAdminOperations = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get all users
  const useUsers = () => useQuery({
    queryKey: ['adminUsers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          *,
          departments (
            id,
            name
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
  });

  // Get all departments
  const useDepartments = () => useQuery({
    queryKey: ['adminDepartments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('departments')
        .select(`
          *,
          profiles!departments_manager_id_fkey (
            id,
            full_name
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
  });

  // Get all projects
  const useProjects = () => useQuery({
    queryKey: ['adminProjects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          departments (
            id,
            name
          ),
          profiles!projects_manager_id_fkey (
            id,
            full_name
          ),
          project_members (
            id,
            user_id,
            role,
            profiles (
              id,
              full_name,
              email
            )
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
  });

  // Get system activities
  const useSystemActivities = () => useQuery({
    queryKey: ['systemActivities'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('system_activities')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);
      
      if (error) throw error;
      return data || [];
    },
  });

  // Get invoices
  const useInvoices = () => useQuery({
    queryKey: ['adminInvoices'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
  });

  // Get memos
  const useMemos = () => useQuery({
    queryKey: ['adminMemos'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('memos')
        .select(`
          *,
          profiles!memos_created_by_fkey (
            id,
            full_name
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
  });

  // Create user mutation
  const createUser = useMutation({
    mutationFn: async (userData: any) => {
      // First create the auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password || 'TempPassword123!',
        options: {
          data: {
            full_name: userData.full_name,
            role: userData.role,
            account_type: userData.account_type || userData.role,
          }
        }
      });

      if (authError) throw authError;

      // Update the profile with additional data
      if (authData.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            department_id: userData.department_id === "none" ? null : userData.department_id,
            phone: userData.phone,
            position: userData.position,
          })
          .eq('id', authData.user.id);

        if (profileError) throw profileError;
      }

      return authData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
      toast({
        title: "Success",
        description: "User created successfully",
      });
    },
    onError: (error) => {
      console.error('Error creating user:', error);
      toast({
        title: "Error",
        description: "Failed to create user",
        variant: "destructive",
      });
    },
  });

  // Create department mutation
  const createDepartment = useMutation({
    mutationFn: async (departmentData: any) => {
      const { data, error } = await supabase
        .from('departments')
        .insert({
          ...departmentData,
          manager_id: departmentData.manager_id === "none" ? null : departmentData.manager_id,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminDepartments'] });
      toast({
        title: "Success",
        description: "Department created successfully",
      });
    },
    onError: (error) => {
      console.error('Error creating department:', error);
      toast({
        title: "Error",
        description: "Failed to create department",
        variant: "destructive",
      });
    },
  });

  // Create invoice mutation
  const createInvoice = useMutation({
    mutationFn: async (invoiceData: any) => {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from('invoices')
        .insert({
          ...invoiceData,
          created_by: user?.id,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminInvoices'] });
      toast({
        title: "Success",
        description: "Invoice created successfully",
      });
    },
    onError: (error) => {
      console.error('Error creating invoice:', error);
      toast({
        title: "Error",
        description: "Failed to create invoice",
        variant: "destructive",
      });
    },
  });

  // Create memo mutation
  const createMemo = useMutation({
    mutationFn: async (memoData: any) => {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from('memos')
        .insert({
          ...memoData,
          created_by: user?.id,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminMemos'] });
      toast({
        title: "Success",
        description: "Memo created successfully",
      });
    },
    onError: (error) => {
      console.error('Error creating memo:', error);
      toast({
        title: "Error",
        description: "Failed to create memo",
        variant: "destructive",
      });
    },
  });

  return {
    useUsers,
    useDepartments,
    useProjects,
    useSystemActivities,
    useInvoices,
    useMemos,
    createUser,
    createDepartment,
    createInvoice,
    createMemo,
  };
};

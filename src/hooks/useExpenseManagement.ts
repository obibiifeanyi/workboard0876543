
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ExpenseRecord, DynamicExpenseTable, ExpenseImport } from '@/types/expenses';
import { useToast } from '@/hooks/use-toast';

export const useExpenseManagement = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch all expense records
  const useExpenses = () => {
    return useQuery({
      queryKey: ['expenses'],
      queryFn: async () => {
        const { data, error } = await supabase
          .from('expenses')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        return data as ExpenseRecord[];
      },
    });
  };

  // Fetch dynamic expense tables
  const useDynamicTables = () => {
    return useQuery({
      queryKey: ['dynamic_expense_tables'],
      queryFn: async () => {
        const { data, error } = await supabase
          .from('dynamic_expense_tables')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        return data as DynamicExpenseTable[];
      },
    });
  };

  // Fetch data from a dynamic table
  const useDynamicTableData = (tableName: string) => {
    return useQuery({
      queryKey: ['dynamic_table_data', tableName],
      queryFn: async () => {
        if (!tableName) return [];
        
        const { data, error } = await supabase
          .from(tableName)
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        return data;
      },
      enabled: !!tableName,
    });
  };

  // Create expense record
  const createExpense = useMutation({
    mutationFn: async (expense: Partial<ExpenseRecord>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('expenses')
        .insert({
          ...expense,
          created_by: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      toast({
        title: "Success",
        description: "Expense record created successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to create expense: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Update expense record
  const updateExpense = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<ExpenseRecord> & { id: string }) => {
      const { data, error } = await supabase
        .from('expenses')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      toast({
        title: "Success",
        description: "Expense record updated successfully",
      });
    },
  });

  // Delete expense record
  const deleteExpense = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      toast({
        title: "Success",
        description: "Expense record deleted successfully",
      });
    },
  });

  // Create dynamic table
  const createDynamicTable = useMutation({
    mutationFn: async (tableConfig: Partial<DynamicExpenseTable>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // First create the table configuration
      const { data, error } = await supabase
        .from('dynamic_expense_tables')
        .insert({
          ...tableConfig,
          created_by: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dynamic_expense_tables'] });
      toast({
        title: "Success",
        description: "Dynamic table created successfully",
      });
    },
  });

  return {
    useExpenses,
    useDynamicTables,
    useDynamicTableData,
    createExpense,
    updateExpense,
    deleteExpense,
    createDynamicTable,
  };
};

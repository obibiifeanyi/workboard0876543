
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ExpenseRecord } from '@/types/expenses';
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
        
        // Transform the data to match our ExpenseRecord interface
        return data.map(expense => ({
          ...expense,
          date: expense.expense_date, // Map expense_date to date for compatibility
        })) as ExpenseRecord[];
      },
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
          title: expense.title,
          description: expense.description,
          amount: expense.amount,
          expense_date: expense.expense_date,
          category: expense.category,
          receipt_url: expense.receipt_url,
          status: expense.status || 'pending',
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
        .update({
          title: updates.title,
          description: updates.description,
          amount: updates.amount,
          expense_date: updates.expense_date,
          category: updates.category,
          receipt_url: updates.receipt_url,
          status: updates.status,
        })
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

  return {
    useExpenses,
    createExpense,
    updateExpense,
    deleteExpense,
  };
};

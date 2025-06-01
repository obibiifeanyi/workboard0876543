
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface FinancialMetrics {
  totalRevenue: number;
  pendingInvoices: number;
  monthlyExpenses: number;
  profitMargin: number;
  revenueGrowth: number;
  expenseGrowth: number;
  invoiceGrowth: number;
  profitGrowth: number;
}

export const useFinancialData = () => {
  // Fetch total revenue from invoices
  const { data: revenueData } = useQuery({
    queryKey: ['total_revenue'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('invoices')
        .select('total_amount')
        .eq('status', 'paid');
      
      if (error) throw error;
      
      const total = data?.reduce((sum, invoice) => sum + Number(invoice.total_amount || 0), 0) || 0;
      return total;
    },
  });

  // Fetch pending invoices count
  const { data: pendingInvoicesData } = useQuery({
    queryKey: ['pending_invoices'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('invoices')
        .select('id')
        .eq('status', 'pending');
      
      if (error) throw error;
      return data?.length || 0;
    },
  });

  // Fetch monthly expenses
  const { data: expensesData } = useQuery({
    queryKey: ['monthly_expenses'],
    queryFn: async () => {
      const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM format
      const { data, error } = await supabase
        .from('expenses')
        .select('amount')
        .gte('expense_date', `${currentMonth}-01`)
        .lt('expense_date', `${currentMonth}-32`);
      
      if (error) throw error;
      
      const total = data?.reduce((sum, expense) => sum + Number(expense.amount || 0), 0) || 0;
      return total;
    },
  });

  // Fetch previous month data for growth calculations
  const { data: previousMonthData } = useQuery({
    queryKey: ['previous_month_data'],
    queryFn: async () => {
      const currentDate = new Date();
      const previousMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
      const previousMonthStr = previousMonth.toISOString().slice(0, 7);
      
      // Previous month revenue
      const { data: prevRevenue, error: revenueError } = await supabase
        .from('invoices')
        .select('total_amount')
        .eq('status', 'paid')
        .gte('created_at', `${previousMonthStr}-01`)
        .lt('created_at', `${previousMonthStr}-32`);
      
      if (revenueError) throw revenueError;
      
      // Previous month expenses
      const { data: prevExpenses, error: expensesError } = await supabase
        .from('expenses')
        .select('amount')
        .gte('expense_date', `${previousMonthStr}-01`)
        .lt('expense_date', `${previousMonthStr}-32`);
      
      if (expensesError) throw expensesError;
      
      const prevRevenueTotal = prevRevenue?.reduce((sum, invoice) => sum + Number(invoice.total_amount || 0), 0) || 0;
      const prevExpensesTotal = prevExpenses?.reduce((sum, expense) => sum + Number(expense.amount || 0), 0) || 0;
      
      return {
        revenue: prevRevenueTotal,
        expenses: prevExpensesTotal,
      };
    },
  });

  // Calculate metrics
  const totalRevenue = revenueData || 0;
  const pendingInvoices = pendingInvoicesData || 0;
  const monthlyExpenses = expensesData || 0;
  const profitMargin = totalRevenue > 0 ? ((totalRevenue - monthlyExpenses) / totalRevenue) * 100 : 0;

  // Calculate growth percentages
  const revenueGrowth = previousMonthData?.revenue 
    ? ((totalRevenue - previousMonthData.revenue) / previousMonthData.revenue) * 100 
    : 0;
  
  const expenseGrowth = previousMonthData?.expenses 
    ? ((monthlyExpenses - previousMonthData.expenses) / previousMonthData.expenses) * 100 
    : 0;

  const metrics: FinancialMetrics = {
    totalRevenue,
    pendingInvoices,
    monthlyExpenses,
    profitMargin,
    revenueGrowth,
    expenseGrowth,
    invoiceGrowth: revenueGrowth, // Simplified for now
    profitGrowth: revenueGrowth - expenseGrowth,
  };

  return {
    metrics,
    isLoading: !revenueData && !pendingInvoicesData && !expensesData,
  };
};

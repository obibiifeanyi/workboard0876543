
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface FinancialMetrics {
  totalRevenue: number;
  revenueGrowth: number;
  pendingInvoices: number;
  invoiceGrowth: number;
  monthlyExpenses: number;
  expenseGrowth: number;
  profitMargin: number;
  profitGrowth: number;
}

export const useFinancialData = () => {
  const { data: metrics, isLoading } = useQuery({
    queryKey: ['financial-metrics'],
    queryFn: async (): Promise<FinancialMetrics> => {
      // Get current month's data
      const currentMonth = new Date();
      const lastMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
      const currentMonthStart = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);

      // Fetch invoices
      const { data: invoices } = await supabase
        .from('invoices')
        .select('total_amount, status, created_at');

      // Fetch expenses
      const { data: expenses } = await supabase
        .from('expenses')
        .select('amount, status, created_at');

      // Calculate revenue metrics
      const currentMonthInvoices = invoices?.filter(invoice => 
        new Date(invoice.created_at) >= currentMonthStart
      ) || [];
      
      const lastMonthInvoices = invoices?.filter(invoice => {
        const invoiceDate = new Date(invoice.created_at);
        return invoiceDate >= lastMonth && invoiceDate < currentMonthStart;
      }) || [];

      const totalRevenue = currentMonthInvoices.reduce((sum, invoice) => 
        sum + Number(invoice.total_amount || 0), 0
      );
      
      const lastMonthRevenue = lastMonthInvoices.reduce((sum, invoice) => 
        sum + Number(invoice.total_amount || 0), 0
      );

      const revenueGrowth = lastMonthRevenue > 0 
        ? ((totalRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 
        : 0;

      // Calculate pending invoices
      const pendingInvoices = invoices?.filter(invoice => 
        invoice.status === 'draft' || invoice.status === 'sent'
      ).length || 0;

      const lastMonthPending = invoices?.filter(invoice => {
        const invoiceDate = new Date(invoice.created_at);
        return (invoice.status === 'draft' || invoice.status === 'sent') &&
               invoiceDate >= lastMonth && invoiceDate < currentMonthStart;
      }).length || 0;

      const invoiceGrowth = lastMonthPending > 0 
        ? ((pendingInvoices - lastMonthPending) / lastMonthPending) * 100 
        : 0;

      // Calculate expenses
      const currentMonthExpenses = expenses?.filter(expense => 
        new Date(expense.created_at) >= currentMonthStart
      ) || [];
      
      const lastMonthExpensesData = expenses?.filter(expense => {
        const expenseDate = new Date(expense.created_at);
        return expenseDate >= lastMonth && expenseDate < currentMonthStart;
      }) || [];

      const monthlyExpenses = currentMonthExpenses.reduce((sum, expense) => 
        sum + Number(expense.amount || 0), 0
      );
      
      const lastMonthExpensesTotal = lastMonthExpensesData.reduce((sum, expense) => 
        sum + Number(expense.amount || 0), 0
      );

      const expenseGrowth = lastMonthExpensesTotal > 0 
        ? ((monthlyExpenses - lastMonthExpensesTotal) / lastMonthExpensesTotal) * 100 
        : 0;

      // Calculate profit margin
      const profit = totalRevenue - monthlyExpenses;
      const profitMargin = totalRevenue > 0 ? (profit / totalRevenue) * 100 : 0;
      
      const lastMonthProfit = lastMonthRevenue - lastMonthExpensesTotal;
      const lastMonthProfitMargin = lastMonthRevenue > 0 ? (lastMonthProfit / lastMonthRevenue) * 100 : 0;
      
      const profitGrowth = lastMonthProfitMargin > 0 
        ? ((profitMargin - lastMonthProfitMargin) / lastMonthProfitMargin) * 100 
        : 0;

      return {
        totalRevenue,
        revenueGrowth,
        pendingInvoices,
        invoiceGrowth,
        monthlyExpenses,
        expenseGrowth,
        profitMargin,
        profitGrowth,
      };
    },
  });

  return {
    metrics: metrics || {
      totalRevenue: 0,
      revenueGrowth: 0,
      pendingInvoices: 0,
      invoiceGrowth: 0,
      monthlyExpenses: 0,
      expenseGrowth: 0,
      profitMargin: 0,
      profitGrowth: 0,
    },
    isLoading,
  };
};

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2, CheckCircle2, XCircle } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const ExpenseManagement = () => {
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState("all");

  const { data: expenses, isLoading } = useQuery({
    queryKey: ['expense_claims'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('expense_claims')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const approveMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('expense_claims')
        .update({ status: 'approved' })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['expense_claims'] }),
  });

  const rejectMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('expense_claims')
        .update({ status: 'rejected' })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['expense_claims'] }),
  });

  const filteredExpenses = expenses?.filter(expense =>
    statusFilter === "all" || expense.status === statusFilter
  ) || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "pending_approval":
        return "bg-yellow-100 text-yellow-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-primary">Expense Management</h2>
      <div className="flex gap-2 mb-4">
        <Button variant={statusFilter === "all" ? "default" : "outline"} onClick={() => setStatusFilter("all")}>All</Button>
        <Button variant={statusFilter === "pending_approval" ? "default" : "outline"} onClick={() => setStatusFilter("pending_approval")}>Pending</Button>
        <Button variant={statusFilter === "approved" ? "default" : "outline"} onClick={() => setStatusFilter("approved")}>Approved</Button>
        <Button variant={statusFilter === "rejected" ? "default" : "outline"} onClick={() => setStatusFilter("rejected")}>Rejected</Button>
      </div>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>All Expenses</CardTitle>
          <Button><Plus className="mr-2 h-4 w-4" /> Add Expense</Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Description</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredExpenses.map((expense) => (
                <TableRow key={expense.id}>
                  <TableCell className="font-medium">{expense.description}</TableCell>
                  <TableCell>${expense.amount?.toFixed(2)}</TableCell>
                  <TableCell>{expense.created_at ? new Date(expense.created_at).toLocaleDateString() : ''}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(expense.status)}>{expense.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    {expense.status === 'pending_approval' && (
                      <>
                        <Button variant="ghost" size="sm" onClick={() => approveMutation.mutate(expense.id)}><CheckCircle2 className="h-4 w-4" /> Approve</Button>
                        <Button variant="ghost" size="sm" onClick={() => rejectMutation.mutate(expense.id)}><XCircle className="h-4 w-4" /> Reject</Button>
                      </>
                    )}
                    <Button variant="ghost" size="sm" className="mr-2"><Edit className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="sm"><Trash2 className="h-4 w-4" /></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}; 
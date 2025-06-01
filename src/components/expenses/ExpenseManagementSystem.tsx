
import { useState } from "react";
import { ExpenseTable } from "./ExpenseTable";
import { ExpenseForm } from "./ExpenseForm";
import { FileUploadProcessor } from "./FileUploadProcessor";
import { useExpenseManagement } from "@/hooks/useExpenseManagement";
import { ExpenseRecord } from "@/types/expenses";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Download, Plus, Database } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { formatCurrency } from "@/utils/currency";
import * as XLSX from 'xlsx';

export const ExpenseManagementSystem = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<ExpenseRecord | null>(null);
  const [uploadedData, setUploadedData] = useState<any[]>([]);
  const [uploadedColumns, setUploadedColumns] = useState<string[]>([]);

  const {
    useExpenses,
    createExpense,
    updateExpense,
    deleteExpense,
  } = useExpenseManagement();

  const { data: expenses = [], isLoading } = useExpenses();

  const handleEdit = (expense: ExpenseRecord) => {
    setEditingExpense(expense);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this expense?')) {
      deleteExpense.mutate(id);
    }
  };

  const handleFormSubmit = (expenseData: Partial<ExpenseRecord>) => {
    if (editingExpense) {
      updateExpense.mutate({ ...expenseData, id: editingExpense.id });
    } else {
      createExpense.mutate(expenseData);
    }
    setEditingExpense(null);
    setIsFormOpen(false);
  };

  const handleExport = () => {
    const ws = XLSX.utils.json_to_sheet(expenses);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Expenses");
    XLSX.writeFile(wb, "expenses_export.xlsx");
  };

  const handleDataProcessed = (data: any[], columns: string[]) => {
    setUploadedData(data);
    setUploadedColumns(columns);
  };

  const handleImportData = () => {
    // Convert uploaded data to expense format and bulk insert
    const expensesToCreate = uploadedData.map(row => ({
      date: row.date || new Date().toISOString().split('T')[0],
      category: row.category || 'other',
      description: row.description || row.title || 'Imported expense',
      amount: parseFloat(row.amount) || 0,
      vendor: row.vendor || row.supplier || '',
      payment_method: row.payment_method || '',
      reference_number: row.reference_number || row.ref || '',
      department: row.department || '',
      status: row.status || 'pending',
    }));

    expensesToCreate.forEach(expense => {
      createExpense.mutate(expense);
    });

    setUploadedData([]);
    setUploadedColumns([]);
  };

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const pendingExpenses = expenses.filter(e => e.status === 'pending').length;
  const paidExpenses = expenses.filter(e => e.status === 'paid').length;

  if (isLoading) {
    return <div>Loading expenses...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(totalExpenses)}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {pendingExpenses}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Paid Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {paidExpenses}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="expenses" className="space-y-6">
        <TabsList>
          <TabsTrigger value="expenses">Expense Records</TabsTrigger>
          <TabsTrigger value="upload">File Upload</TabsTrigger>
        </TabsList>

        <TabsContent value="expenses">
          <ExpenseTable
            expenses={expenses}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onExport={handleExport}
            onAdd={() => setIsFormOpen(true)}
          />
        </TabsContent>

        <TabsContent value="upload" className="space-y-6">
          <FileUploadProcessor onDataProcessed={handleDataProcessed} />
          
          {uploadedData.length > 0 && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Preview Uploaded Data</CardTitle>
                  <Button onClick={handleImportData}>
                    <Database className="h-4 w-4 mr-2" />
                    Import {uploadedData.length} Records
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border">
                    <thead>
                      <tr>
                        {uploadedColumns.map(column => (
                          <th key={column} className="border p-2 bg-gray-50">
                            {column.replace(/_/g, ' ').toUpperCase()}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {uploadedData.slice(0, 10).map((row, index) => (
                        <tr key={index}>
                          {uploadedColumns.map(column => (
                            <td key={column} className="border p-2">
                              {row[column]}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {uploadedData.length > 10 && (
                    <div className="text-center py-2 text-muted-foreground">
                      ... and {uploadedData.length - 10} more records
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingExpense ? 'Edit Expense' : 'Add New Expense'}</DialogTitle>
          </DialogHeader>
          <ExpenseForm
            onSubmit={handleFormSubmit}
            onClose={() => setIsFormOpen(false)}
            initialData={editingExpense ? {
              title: editingExpense.title,
              amount: editingExpense.amount,
              category: editingExpense.category,
              expense_date: editingExpense.expense_date,
              description: editingExpense.description,
            } : undefined}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

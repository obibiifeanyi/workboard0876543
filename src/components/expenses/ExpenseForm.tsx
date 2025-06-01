
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { useExpenseManagement } from "@/hooks/useExpenseManagement";
import { ExpenseRecord } from "@/types/expenses";

interface ExpenseFormProps {
  expense?: ExpenseRecord;
  onClose?: () => void;
  onSuccess?: () => void;
  isOpen?: boolean;
  onSubmit?: (data: Partial<ExpenseRecord>) => void;
  initialData?: ExpenseRecord | null;
}

export const ExpenseForm = ({ 
  expense, 
  onClose, 
  onSuccess,
  isOpen = false,
  onSubmit,
  initialData 
}: ExpenseFormProps) => {
  const { createExpense, updateExpense } = useExpenseManagement();
  const [isDialogOpen, setIsDialogOpen] = useState(isOpen);
  const currentExpense = expense || initialData;
  
  const [formData, setFormData] = useState({
    title: currentExpense?.title || '',
    description: currentExpense?.description || '',
    amount: currentExpense?.amount || 0,
    expense_date: currentExpense?.expense_date?.split('T')[0] || new Date().toISOString().split('T')[0],
    category: currentExpense?.category || '',
    receipt_url: currentExpense?.receipt_url || '',
    status: currentExpense?.status || 'pending' as const,
    vendor: currentExpense?.vendor || '',
    payment_method: currentExpense?.payment_method || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const submitData = {
      ...formData,
      date: formData.expense_date, // Add for compatibility
    };

    if (onSubmit) {
      onSubmit(submitData);
      handleClose();
      return;
    }
    
    if (currentExpense) {
      updateExpense.mutate({ id: currentExpense.id, ...submitData }, {
        onSuccess: () => {
          handleClose();
          onSuccess?.();
        }
      });
    } else {
      createExpense.mutate(submitData, {
        onSuccess: () => {
          handleClose();
          onSuccess?.();
          resetForm();
        }
      });
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      amount: 0,
      expense_date: new Date().toISOString().split('T')[0],
      category: '',
      receipt_url: '',
      status: 'pending',
      vendor: '',
      payment_method: '',
    });
  };

  const handleClose = () => {
    setIsDialogOpen(false);
    onClose?.();
  };

  const form = (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title *</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Expense title"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Expense description"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="amount">Amount *</Label>
          <Input
            id="amount"
            type="number"
            step="0.01"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
            placeholder="0.00"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="date">Date *</Label>
          <Input
            id="date"
            type="date"
            value={formData.expense_date}
            onChange={(e) => setFormData({ ...formData, expense_date: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Category *</Label>
        <Select
          value={formData.category}
          onValueChange={(value) => setFormData({ ...formData, category: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="office-supplies">Office Supplies</SelectItem>
            <SelectItem value="travel">Travel</SelectItem>
            <SelectItem value="meals">Meals</SelectItem>
            <SelectItem value="fuel">Fuel</SelectItem>
            <SelectItem value="maintenance">Maintenance</SelectItem>
            <SelectItem value="equipment">Equipment</SelectItem>
            <SelectItem value="utilities">Utilities</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="vendor">Vendor</Label>
        <Input
          id="vendor"
          value={formData.vendor}
          onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
          placeholder="Vendor name"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="payment-method">Payment Method</Label>
        <Select
          value={formData.payment_method}
          onValueChange={(value) => setFormData({ ...formData, payment_method: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select payment method" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="cash">Cash</SelectItem>
            <SelectItem value="credit-card">Credit Card</SelectItem>
            <SelectItem value="debit-card">Debit Card</SelectItem>
            <SelectItem value="bank-transfer">Bank Transfer</SelectItem>
            <SelectItem value="check">Check</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <Select
          value={formData.status}
          onValueChange={(value: any) => setFormData({ ...formData, status: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="receipt">Receipt URL</Label>
        <Input
          id="receipt"
          value={formData.receipt_url}
          onChange={(e) => setFormData({ ...formData, receipt_url: e.target.value })}
          placeholder="Receipt file URL"
        />
      </div>

      <Button type="submit" className="w-full">
        {currentExpense ? 'Update Expense' : 'Create Expense'}
      </Button>
    </form>
  );

  if (currentExpense || isOpen) {
    return form;
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Expense
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Expense</DialogTitle>
        </DialogHeader>
        {form}
      </DialogContent>
    </Dialog>
  );
};

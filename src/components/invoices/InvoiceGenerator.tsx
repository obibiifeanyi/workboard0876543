
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Plus, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface InvoiceFormData {
  client_name: string;
  client_email: string;
  client_address: string;
  amount: string;
  tax_amount: string;
  description: string;
  due_date: string;
}

export const InvoiceGenerator = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<InvoiceFormData>({
    client_name: "",
    client_email: "",
    client_address: "",
    amount: "",
    tax_amount: "",
    description: "",
    due_date: "",
  });

  const generateInvoiceNumber = () => {
    const timestamp = Date.now();
    return `INV-${timestamp.toString().slice(-8)}`;
  };

  const createInvoice = useMutation({
    mutationFn: async (data: InvoiceFormData) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Authentication required");

      const amount = parseFloat(data.amount);
      const taxAmount = parseFloat(data.tax_amount) || 0;
      const totalAmount = amount + taxAmount;

      const { error } = await supabase
        .from('invoices')
        .insert([{
          invoice_number: generateInvoiceNumber(),
          client_name: data.client_name,
          client_email: data.client_email,
          client_address: data.client_address,
          amount: amount,
          tax_amount: taxAmount,
          total_amount: totalAmount,
          description: data.description,
          due_date: data.due_date,
          created_by: user.id,
          status: 'draft'
        }]);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      setFormData({
        client_name: "",
        client_email: "",
        client_address: "",
        amount: "",
        tax_amount: "",
        description: "",
        due_date: "",
      });
      toast({
        title: "Success",
        description: "Invoice created successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create invoice",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createInvoice.mutate(formData);
  };

  const handleInputChange = (field: keyof InvoiceFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="enhanced-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-unica">
          <FileText className="h-5 w-5 text-primary" />
          Invoice Generator
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="client_name">Client Name</Label>
              <Input
                id="client_name"
                value={formData.client_name}
                onChange={(e) => handleInputChange('client_name', e.target.value)}
                required
                className="shadow-soft"
              />
            </div>
            <div>
              <Label htmlFor="client_email">Client Email</Label>
              <Input
                id="client_email"
                type="email"
                value={formData.client_email}
                onChange={(e) => handleInputChange('client_email', e.target.value)}
                className="shadow-soft"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="client_address">Client Address</Label>
            <Textarea
              id="client_address"
              value={formData.client_address}
              onChange={(e) => handleInputChange('client_address', e.target.value)}
              className="shadow-soft"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="amount">Amount ($)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => handleInputChange('amount', e.target.value)}
                required
                className="shadow-soft"
              />
            </div>
            <div>
              <Label htmlFor="tax_amount">Tax Amount ($)</Label>
              <Input
                id="tax_amount"
                type="number"
                step="0.01"
                value={formData.tax_amount}
                onChange={(e) => handleInputChange('tax_amount', e.target.value)}
                className="shadow-soft"
              />
            </div>
            <div>
              <Label htmlFor="due_date">Due Date</Label>
              <Input
                id="due_date"
                type="date"
                value={formData.due_date}
                onChange={(e) => handleInputChange('due_date', e.target.value)}
                className="shadow-soft"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Describe the services or products..."
              className="shadow-soft"
            />
          </div>

          <Button 
            type="submit" 
            disabled={createInvoice.isPending}
            className="w-full button-enhanced"
          >
            <Plus className="h-4 w-4 mr-2" />
            {createInvoice.isPending ? "Creating..." : "Generate Invoice"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

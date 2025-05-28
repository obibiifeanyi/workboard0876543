
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Plus, Receipt } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

export const InvoiceManagement = () => {
  const { toast } = useToast();

  const { data: memos, isLoading } = useQuery({
    queryKey: ['memos'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('memos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const handleCreateInvoice = async (memo: any) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('You must be logged in to create invoices');
      }

      // Generate invoice number
      const invoiceNumber = `INV-${Date.now()}`;

      const { error } = await supabase
        .from('accounts_invoices')
        .insert([{
          invoice_number: invoiceNumber,
          vendor_name: `Memo: ${memo.title}`,
          amount: 0, // Default amount, should be updated
          payment_status: 'pending',
          created_by: user.id,
        }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Invoice ${invoiceNumber} created for memo: ${memo.title}`,
      });
    } catch (error) {
      console.error('Error creating invoice:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create invoice",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <Card className="bg-black/10 dark:bg-white/5 backdrop-blur-lg border-none">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-medium">
            <Receipt className="h-5 w-5 text-primary" />
            Invoice Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">Loading memos...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-black/10 dark:bg-white/5 backdrop-blur-lg border-none">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg font-medium">
          <Receipt className="h-5 w-5 text-primary" />
          Invoice Management
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid gap-4">
            {memos && memos.length > 0 ? (
              memos.map((memo) => (
                <Card key={memo.id} className="p-4 bg-white/5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">{memo.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {memo.department} - {format(new Date(memo.created_at), 'PPP')}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCreateInvoice(memo)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Create Invoice
                    </Button>
                  </div>
                </Card>
              ))
            ) : (
              <div className="text-center text-muted-foreground">No memos found</div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

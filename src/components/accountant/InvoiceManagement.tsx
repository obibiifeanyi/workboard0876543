import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { FileText, Check, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

export const InvoiceManagement = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: invoices, isLoading } = useQuery({
    queryKey: ['invoices'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('accounts_invoices')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const markAsPaidMutation = useMutation({
    mutationFn: async ({ invoiceId, paymentReference }: { invoiceId: string, paymentReference: string }) => {
      // Update invoice status
      const { error: updateError } = await supabase
        .from('accounts_invoices')
        .update({
          payment_status: 'paid',
          paid_date: new Date().toISOString(),
          payment_reference: paymentReference
        })
        .eq('id', invoiceId);

      if (updateError) throw updateError;

      // Send notification
      const { error: notificationError } = await supabase.functions.invoke('payment-notification', {
        body: {
          invoiceId,
          type: 'processed',
          message: `Payment for invoice ${paymentReference} has been processed.`
        }
      });

      if (notificationError) throw notificationError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      toast({
        title: "Payment Processed",
        description: "The invoice has been marked as paid and notifications sent.",
      });
    },
    onError: (error) => {
      console.error('Error processing payment:', error);
      toast({
        title: "Error",
        description: "Failed to process payment. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleMarkAsPaid = async (invoiceId: string) => {
    const paymentReference = `PAY-${Date.now()}`;
    await markAsPaidMutation.mutateAsync({ invoiceId, paymentReference });
  };

  return (
    <Card className="bg-black/10 dark:bg-white/5 backdrop-blur-lg border-none">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg font-medium">
          <FileText className="h-5 w-5 text-primary" />
          Invoice Management
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center">Loading invoices...</div>
          ) : !invoices?.length ? (
            <div className="text-center text-muted-foreground">No invoices found</div>
          ) : (
            invoices.map((invoice) => (
              <Card key={invoice.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">{invoice.invoice_number}</h3>
                    <p className="text-sm text-muted-foreground">
                      {invoice.vendor_name} - {format(new Date(invoice.created_at), 'PPP')}
                    </p>
                    <p className="text-sm font-medium">
                      Amount: ₦{invoice.amount.toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {invoice.payment_status === 'pending' ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleMarkAsPaid(invoice.id)}
                        disabled={markAsPaidMutation.isPending}
                      >
                        <Check className="h-4 w-4 mr-2" />
                        Mark as Paid
                      </Button>
                    ) : (
                      <span className="flex items-center gap-1 text-sm text-green-500">
                        <Check className="h-4 w-4" />
                        Paid
                      </span>
                    )}
                  </div>
                </div>
                {invoice.payment_status === 'paid' && (
                  <div className="mt-2 text-sm text-muted-foreground">
                    Paid on {format(new Date(invoice.paid_date), 'PPP')}
                    {invoice.payment_reference && ` - Ref: ${invoice.payment_reference}`}
                  </div>
                )}
              </Card>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};
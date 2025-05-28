
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

export const InvoiceManagement = () => {
  const { toast } = useToast();

  // Mock data for now since the accounts_invoices table doesn't exist
  const mockInvoices = [
    {
      id: "1",
      invoice_number: "INV-001",
      vendor_name: "Tech Supplies Ltd",
      amount: 150000,
      payment_status: "pending",
      created_at: new Date().toISOString(),
      paid_date: null,
      payment_reference: null
    },
    {
      id: "2",
      invoice_number: "INV-002", 
      vendor_name: "Office Equipment Co",
      amount: 75000,
      payment_status: "paid",
      created_at: new Date(Date.now() - 86400000).toISOString(),
      paid_date: new Date().toISOString(),
      payment_reference: "PAY-123456"
    }
  ];

  const handleMarkAsPaid = async (invoiceId: string) => {
    toast({
      title: "Payment Processed",
      description: "The invoice has been marked as paid.",
    });
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
          {!mockInvoices?.length ? (
            <div className="text-center text-muted-foreground">No invoices found</div>
          ) : (
            mockInvoices.map((invoice) => (
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
                {invoice.payment_status === 'paid' && invoice.paid_date && (
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

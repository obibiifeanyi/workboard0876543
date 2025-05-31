
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Plus, DollarSign, Clock, CheckCircle } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

export const PaymentProcessing = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [newPayment, setNewPayment] = useState({
    invoice_id: "",
    transaction_type: "payment",
    amount: "",
    payment_method: "",
    transaction_reference: "",
    transaction_date: new Date().toISOString().split('T')[0],
    notes: ""
  });

  const { data: pendingInvoices } = useQuery({
    queryKey: ['pending_invoices'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('accounts_invoices')
        .select('*')
        .eq('payment_status', 'pending')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const { data: transactions, isLoading } = useQuery({
    queryKey: ['payment_transactions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('payment_transactions')
        .select(`
          *,
          invoice:accounts_invoices(invoice_number, vendor_name),
          processed_by:profiles!payment_transactions_processed_by_fkey(full_name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const processPaymentMutation = useMutation({
    mutationFn: async (paymentData: typeof newPayment) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('payment_transactions')
        .insert({
          ...paymentData,
          amount: parseFloat(paymentData.amount),
          processed_by: user.id,
          status: 'completed'
        });

      if (error) throw error;

      // Update invoice status if it's a payment
      if (paymentData.transaction_type === 'payment' && paymentData.invoice_id) {
        const { error: invoiceError } = await supabase
          .from('accounts_invoices')
          .update({ 
            payment_status: 'paid',
            paid_date: new Date().toISOString(),
            payment_reference: paymentData.transaction_reference
          })
          .eq('id', paymentData.invoice_id);

        if (invoiceError) throw invoiceError;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payment_transactions'] });
      queryClient.invalidateQueries({ queryKey: ['pending_invoices'] });
      queryClient.invalidateQueries({ queryKey: ['accounts_invoices'] });
      setNewPayment({
        invoice_id: "",
        transaction_type: "payment",
        amount: "",
        payment_method: "",
        transaction_reference: "",
        transaction_date: new Date().toISOString().split('T')[0],
        notes: ""
      });
      setShowPaymentForm(false);
      toast({
        title: "Success",
        description: "Payment processed successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to process payment",
        variant: "destructive",
      });
    },
  });

  const handleProcessPayment = () => {
    if (!newPayment.amount || !newPayment.payment_method || !newPayment.transaction_reference) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    processPaymentMutation.mutate(newPayment);
  };

  if (isLoading) {
    return (
      <Card className="bg-black/10 dark:bg-white/5 backdrop-blur-lg border-none">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-medium">
            <CreditCard className="h-5 w-5 text-primary" />
            Payment Processing
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">Loading payments...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-black/10 dark:bg-white/5 backdrop-blur-lg border-none">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg font-medium">
          <CreditCard className="h-5 w-5 text-primary" />
          Payment Processing
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="flex gap-4">
            <Button onClick={() => setShowPaymentForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Process Payment
            </Button>
          </div>

          {/* Payment Form */}
          {showPaymentForm && (
            <Card className="p-4 bg-white/5 border border-primary/20">
              <div className="space-y-4">
                <h3 className="font-medium">Process New Payment</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <Select value={newPayment.invoice_id} onValueChange={(value) => setNewPayment(prev => ({ ...prev, invoice_id: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Invoice (Optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      {pendingInvoices?.map((invoice) => (
                        <SelectItem key={invoice.id} value={invoice.id}>
                          {invoice.invoice_number} - {invoice.vendor_name} (₦{invoice.amount.toLocaleString()})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={newPayment.transaction_type} onValueChange={(value) => setNewPayment(prev => ({ ...prev, transaction_type: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Transaction Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="payment">Payment</SelectItem>
                      <SelectItem value="refund">Refund</SelectItem>
                      <SelectItem value="adjustment">Adjustment</SelectItem>
                    </SelectContent>
                  </Select>

                  <Input
                    type="number"
                    placeholder="Amount"
                    value={newPayment.amount}
                    onChange={(e) => setNewPayment(prev => ({ ...prev, amount: e.target.value }))}
                  />

                  <Select value={newPayment.payment_method} onValueChange={(value) => setNewPayment(prev => ({ ...prev, payment_method: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Payment Method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                      <SelectItem value="check">Check</SelectItem>
                      <SelectItem value="cash">Cash</SelectItem>
                      <SelectItem value="card">Card</SelectItem>
                    </SelectContent>
                  </Select>

                  <Input
                    placeholder="Transaction Reference"
                    value={newPayment.transaction_reference}
                    onChange={(e) => setNewPayment(prev => ({ ...prev, transaction_reference: e.target.value }))}
                  />

                  <Input
                    type="date"
                    value={newPayment.transaction_date}
                    onChange={(e) => setNewPayment(prev => ({ ...prev, transaction_date: e.target.value }))}
                  />
                </div>

                <Textarea
                  placeholder="Notes (optional)"
                  value={newPayment.notes}
                  onChange={(e) => setNewPayment(prev => ({ ...prev, notes: e.target.value }))}
                  rows={3}
                />

                <div className="flex gap-2">
                  <Button
                    onClick={handleProcessPayment}
                    disabled={processPaymentMutation.isPending}
                  >
                    {processPaymentMutation.isPending ? 'Processing...' : 'Process Payment'}
                  </Button>
                  <Button
                    onClick={() => setShowPaymentForm(false)}
                    variant="outline"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* Recent Transactions */}
          <div>
            <h3 className="font-medium mb-4 flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Recent Transactions
            </h3>
            {!transactions?.length ? (
              <div className="text-center text-muted-foreground py-8">
                No payment transactions found.
              </div>
            ) : (
              <div className="space-y-4">
                {transactions.map((transaction) => (
                  <Card key={transaction.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium capitalize">
                            {transaction.transaction_type} - ₦{transaction.amount.toLocaleString()}
                          </h4>
                          <Badge variant={transaction.status === 'completed' ? 'default' : 'secondary'}>
                            {transaction.status === 'completed' ? (
                              <CheckCircle className="h-3 w-3 mr-1" />
                            ) : (
                              <Clock className="h-3 w-3 mr-1" />
                            )}
                            {transaction.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {transaction.payment_method.replace('_', ' ')} • Ref: {transaction.transaction_reference}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {transaction.invoice ? `Invoice: ${transaction.invoice.invoice_number}` : 'No invoice linked'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Processed by {transaction.processed_by?.full_name} on {format(new Date(transaction.transaction_date), 'PP')}
                        </p>
                      </div>
                    </div>
                    {transaction.notes && (
                      <p className="text-sm mt-2 p-2 bg-white/5 rounded">{transaction.notes}</p>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

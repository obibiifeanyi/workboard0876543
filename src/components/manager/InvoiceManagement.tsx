import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileText, Plus, Receipt } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

export const InvoiceManagement = () => {
  const [selectedMemo, setSelectedMemo] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch memos
  const { data: memos } = useQuery({
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

  // Create invoice mutation
  const createInvoice = useMutation({
    mutationFn: async (formData: {
      memo_id: string;
      amount: number;
      client_name: string;
      items: any[];
    }) => {
      const { data, error } = await supabase
        .from('invoices')
        .insert({
          memo_id: formData.memo_id,
          amount: formData.amount,
          client_name: formData.client_name,
          items: formData.items,
          status: 'pending',
          invoice_number: `INV-${Date.now()}`,
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      toast({
        title: "Success",
        description: "Invoice created successfully",
      });
    },
    onError: (error) => {
      console.error('Invoice creation error:', error);
      toast({
        title: "Error",
        description: "Failed to create invoice",
        variant: "destructive",
      });
    },
  });

  const handleCreateInvoice = async (memo: any) => {
    try {
      await createInvoice.mutateAsync({
        memo_id: memo.id,
        amount: 0, // This should be calculated based on memo content
        client_name: memo.department || "Client",
        items: [{
          description: memo.title,
          amount: 0,
        }],
      });
    } catch (error) {
      console.error('Error creating invoice:', error);
    }
  };

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
            {memos?.map((memo) => (
              <Card key={memo.id} className="p-4 bg-white/5">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">{memo.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(memo.created_at), 'PPP')}
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
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
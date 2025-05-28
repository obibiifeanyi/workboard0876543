
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Plus, Receipt } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface MockMemo {
  id: string;
  title: string;
  department: string;
  created_at: string;
}

export const InvoiceManagement = () => {
  const { toast } = useToast();

  // Mock data since memos and accounts_invoices tables don't exist
  const [memos] = useState<MockMemo[]>([
    {
      id: "1",
      title: "Equipment Purchase Request",
      department: "IT",
      created_at: new Date().toISOString(),
    },
    {
      id: "2",
      title: "Monthly Maintenance Report",
      department: "Operations",
      created_at: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: "3",
      title: "Staff Training Budget",
      department: "HR",
      created_at: new Date(Date.now() - 172800000).toISOString(),
    }
  ]);

  const handleCreateInvoice = async (memo: MockMemo) => {
    try {
      // Mock invoice creation - in a real app this would save to database
      toast({
        title: "Success",
        description: `Invoice created for memo: ${memo.title} (mock data)`,
      });
    } catch (error) {
      console.error('Error creating invoice:', error);
      toast({
        title: "Error",
        description: "Failed to create invoice",
        variant: "destructive",
      });
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
            {memos.map((memo) => (
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
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

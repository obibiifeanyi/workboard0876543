import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard } from "lucide-react";

export const PaymentProcessing = () => {
  return (
    <Card className="bg-black/10 dark:bg-white/5 backdrop-blur-lg border-none">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg font-medium">
          <CreditCard className="h-5 w-5 text-primary" />
          Payment Processing
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div>Payment processing content will go here</div>
      </CardContent>
    </Card>
  );
};
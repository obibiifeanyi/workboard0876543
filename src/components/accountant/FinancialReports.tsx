import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart } from "lucide-react";

export const FinancialReports = () => {
  return (
    <Card className="bg-black/10 dark:bg-white/5 backdrop-blur-lg border-none">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg font-medium">
          <PieChart className="h-5 w-5 text-primary" />
          Financial Reports
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Implement financial reports UI here */}
        <div>Financial reports content will go here</div>
      </CardContent>
    </Card>
  );
};

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Calculator, DollarSign } from "lucide-react";

export const PayrollManagement = () => {
  return (
    <div className="space-y-6 p-4 md:p-6 max-w-7xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Payroll Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Calculator className="h-4 w-4" />
                  Monthly Payroll
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">$247,500</p>
                <p className="text-sm text-muted-foreground">This month</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <DollarSign className="h-4 w-4" />
                  Pending Payments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">$12,300</p>
                <p className="text-sm text-muted-foreground">5 employees</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Clock className="h-4 w-4" />
                  Overtime Hours
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">145</p>
                <p className="text-sm text-muted-foreground">This month</p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

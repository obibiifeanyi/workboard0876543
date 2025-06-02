
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, TrendingUp, TrendingDown } from "lucide-react";
import { useFleetOperations } from "@/hooks/useFleetOperations";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export const FleetExpenseTracking = () => {
  const { useVehicleMaintenance, useFuelTransactions } = useFleetOperations();
  const { data: maintenanceRecords = [], isLoading: isLoadingMaintenance } = useVehicleMaintenance();
  const { data: fuelTransactions = [], isLoading: isLoadingFuel } = useFuelTransactions();

  const totalMaintenanceCost = maintenanceRecords.reduce((total, record) => 
    total + Number(record.cost || 0), 0
  );

  const totalFuelCost = fuelTransactions.reduce((total, transaction) => 
    total + Number(transaction.total_cost || 0), 0
  );

  const totalExpenses = totalMaintenanceCost + totalFuelCost;

  const exportData = () => {
    const data = [
      ...maintenanceRecords.map(record => ({
        type: 'Maintenance',
        date: record.scheduled_date || record.created_at,
        description: record.maintenance_type,
        cost: record.cost,
        vehicle: record.vehicle?.vehicle_number,
      })),
      ...fuelTransactions.map(transaction => ({
        type: 'Fuel',
        date: transaction.transaction_date,
        description: `Fuel - ${transaction.fuel_amount}L`,
        cost: transaction.total_cost,
        vehicle: transaction.vehicle?.vehicle_number,
      }))
    ];

    const csv = [
      ['Type', 'Date', 'Description', 'Cost', 'Vehicle'],
      ...data.map(row => [row.type, row.date, row.description, row.cost, row.vehicle])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'fleet-expenses.csv';
    a.click();
  };

  if (isLoadingMaintenance || isLoadingFuel) {
    return <div>Loading expense data...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Fleet Expense Tracking</h2>
        <Button onClick={exportData}>
          <Download className="h-4 w-4 mr-2" />
          Export Data
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalExpenses.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              This month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Maintenance Costs</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalMaintenanceCost.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              {maintenanceRecords.length} records
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fuel Costs</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalFuelCost.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              {fuelTransactions.length} transactions
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Maintenance Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {maintenanceRecords.slice(0, 10).map((record) => (
                <div key={record.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{record.maintenance_type}</p>
                    <p className="text-sm text-muted-foreground">
                      {record.vehicle?.vehicle_number} - {record.scheduled_date ? format(new Date(record.scheduled_date), 'MMM dd, yyyy') : 'No date'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${Number(record.cost || 0).toFixed(2)}</p>
                    <Badge variant={record.status === 'completed' ? 'default' : 'secondary'}>
                      {record.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Fuel Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {fuelTransactions.slice(0, 10).map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{transaction.fuel_amount}L</p>
                    <p className="text-sm text-muted-foreground">
                      {transaction.vehicle?.vehicle_number} - {format(new Date(transaction.transaction_date), 'MMM dd, yyyy')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${Number(transaction.total_cost).toFixed(2)}</p>
                    <p className="text-sm text-muted-foreground">
                      ${Number(transaction.cost_per_unit).toFixed(2)}/L
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

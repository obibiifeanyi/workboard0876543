
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useFleetOperations } from "@/hooks/useFleetOperations";
import { Fuel, Wrench, DollarSign, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const FleetExpenseTracking = () => {
  const { maintenanceRecords, fuelTransactions, isLoadingMaintenance, isLoadingFuel } = useFleetOperations();

  if (isLoadingMaintenance || isLoadingFuel) {
    return <div>Loading expense data...</div>;
  }

  const totalMaintenanceCost = maintenanceRecords?.reduce((sum, record) => sum + record.cost, 0) || 0;
  const totalFuelCost = fuelTransactions?.reduce((sum, transaction) => sum + transaction.total_cost, 0) || 0;
  const totalFleetCost = totalMaintenanceCost + totalFuelCost;

  const recentExpenses = [
    ...(maintenanceRecords?.slice(0, 5).map(record => ({
      id: record.id,
      type: 'maintenance',
      description: record.maintenance_type,
      cost: record.cost,
      date: record.service_date,
      vehicle: record.fleet_vehicles?.vehicle_number || 'Unknown',
    })) || []),
    ...(fuelTransactions?.slice(0, 5).map(transaction => ({
      id: transaction.id,
      type: 'fuel',
      description: `Fuel - ${transaction.fuel_amount}L`,
      cost: transaction.total_cost,
      date: transaction.transaction_date,
      vehicle: transaction.fleet_vehicles?.vehicle_number || 'Unknown',
    })) || [])
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 10);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <DollarSign className="h-6 w-6 text-red-600" />
        <h1 className="text-2xl font-bold">Fleet Expense Tracking</h1>
      </div>

      {/* Expense Overview Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="rounded-3xl border-red-600/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Fleet Cost</CardTitle>
            <TrendingUp className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalFleetCost.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">All time expenses</p>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-red-600/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Maintenance Cost</CardTitle>
            <Wrench className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalMaintenanceCost.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Total maintenance</p>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-red-600/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fuel Cost</CardTitle>
            <Fuel className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalFuelCost.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Total fuel expenses</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Expenses */}
      <Card className="rounded-3xl border-red-600/20">
        <CardHeader>
          <CardTitle className="text-red-700">Recent Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentExpenses.map((expense) => (
              <div key={expense.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  {expense.type === 'maintenance' ? (
                    <Wrench className="h-5 w-5 text-yellow-600" />
                  ) : (
                    <Fuel className="h-5 w-5 text-blue-600" />
                  )}
                  <div>
                    <p className="font-medium">{expense.description}</p>
                    <p className="text-sm text-muted-foreground">
                      Vehicle: {expense.vehicle} • {new Date(expense.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={expense.type === 'maintenance' ? 'secondary' : 'default'}>
                    {expense.type}
                  </Badge>
                  <span className="font-medium">${expense.cost.toFixed(2)}</span>
                </div>
              </div>
            ))}
            {recentExpenses.length === 0 && (
              <div className="text-center py-8">
                <DollarSign className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No Expenses</h3>
                <p className="text-muted-foreground">No fleet expenses have been recorded yet.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

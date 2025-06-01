
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useFleetOperations } from "@/hooks/useFleetOperations";
import { Car, Wrench, Fuel, MapPin, Loader } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const FleetDashboard = () => {
  const { 
    vehicles, 
    maintenanceRecords, 
    fuelTransactions, 
    tripLogs,
    isLoadingVehicles,
    isLoadingMaintenance,
    isLoadingFuel,
    isLoadingTrips
  } = useFleetOperations();

  if (isLoadingVehicles || isLoadingMaintenance || isLoadingFuel || isLoadingTrips) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="h-8 w-8 animate-spin text-red-600" />
      </div>
    );
  }

  const activeVehicles = vehicles?.filter(v => v.status === 'active').length || 0;
  const maintenanceVehicles = vehicles?.filter(v => v.status === 'maintenance').length || 0;
  const totalMaintenanceCost = maintenanceRecords?.reduce((sum, record) => sum + record.cost, 0) || 0;
  const totalFuelCost = fuelTransactions?.reduce((sum, transaction) => sum + transaction.total_cost, 0) || 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Car className="h-6 w-6 text-red-600" />
        <h1 className="text-2xl font-bold">Fleet Management</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="rounded-3xl border-red-600/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Vehicles</CardTitle>
            <Car className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeVehicles}</div>
            <p className="text-xs text-muted-foreground">Total fleet vehicles</p>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-red-600/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Maintenance</CardTitle>
            <Wrench className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{maintenanceVehicles}</div>
            <p className="text-xs text-muted-foreground">Vehicles under service</p>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-red-600/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Maintenance Cost</CardTitle>
            <Wrench className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalMaintenanceCost.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Total this month</p>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-red-600/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fuel Cost</CardTitle>
            <Fuel className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalFuelCost.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Total this month</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Vehicles */}
      <Card className="rounded-3xl border-red-600/20">
        <CardHeader>
          <CardTitle className="text-red-700">Fleet Vehicles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {vehicles?.slice(0, 5).map((vehicle) => (
              <div key={vehicle.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Car className="h-5 w-5 text-gray-600" />
                  <div>
                    <p className="font-medium">{vehicle.vehicle_number}</p>
                    <p className="text-sm text-muted-foreground">
                      {vehicle.make} {vehicle.model} ({vehicle.year})
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge 
                    variant={
                      vehicle.status === 'active' ? 'default' : 
                      vehicle.status === 'maintenance' ? 'secondary' : 'outline'
                    }
                  >
                    {vehicle.status}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {vehicle.current_mileage.toLocaleString()} km
                  </span>
                </div>
              </div>
            ))}
            {vehicles?.length === 0 && (
              <div className="text-center py-8">
                <Car className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No Vehicles</h3>
                <p className="text-muted-foreground">No vehicles have been added to the fleet yet.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};


import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Car, Fuel, Wrench, Calendar } from "lucide-react";
import { useFleetOperations } from "@/hooks/useFleetOperations";
import { Badge } from "@/components/ui/badge";

export const FleetDashboard = () => {
  const { 
    useVehicles, 
    useVehicleMaintenance,
    useFuelTransactions,
    useTripLogs
  } = useFleetOperations();
  
  const { data: vehicles = [], isLoading: isLoadingVehicles } = useVehicles();
  const { data: maintenanceRecords = [], isLoading: isLoadingMaintenance } = useVehicleMaintenance();
  const { data: fuelTransactions = [], isLoading: isLoadingFuel } = useFuelTransactions();
  const { data: tripLogs = [], isLoading: isLoadingTrips } = useTripLogs();

  const activeVehicles = vehicles.filter(v => v.status === 'active');
  const maintenanceNeeded = vehicles.filter(v => v.status === 'maintenance');
  
  const totalFuelCost = fuelTransactions.reduce((total, transaction) => 
    total + Number(transaction.total_cost || 0), 0
  );

  const pendingMaintenance = maintenanceRecords.filter(m => m.status === 'scheduled').length;

  if (isLoadingVehicles) {
    return <div>Loading fleet data...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Vehicles</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{vehicles.length}</div>
            <p className="text-xs text-muted-foreground">
              {activeVehicles.length} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Maintenance Needed</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{maintenanceNeeded.length}</div>
            <p className="text-xs text-muted-foreground">
              {pendingMaintenance} scheduled
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fuel Cost (Month)</CardTitle>
            <Fuel className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalFuelCost.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              {fuelTransactions.length} transactions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Trips This Month</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tripLogs.length}</div>
            <p className="text-xs text-muted-foreground">
              Active trips
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Vehicle Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {vehicles.slice(0, 5).map((vehicle) => (
                <div key={vehicle.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{vehicle.vehicle_number}</p>
                    <p className="text-sm text-muted-foreground">
                      {vehicle.make} {vehicle.model}
                    </p>
                  </div>
                  <Badge 
                    variant={vehicle.status === 'active' ? 'default' : 'secondary'}
                  >
                    {vehicle.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Maintenance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {maintenanceRecords.slice(0, 5).map((maintenance) => (
                <div key={maintenance.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{maintenance.maintenance_type}</p>
                    <p className="text-sm text-muted-foreground">
                      {maintenance.vehicle?.vehicle_number}
                    </p>
                  </div>
                  <Badge 
                    variant={maintenance.status === 'completed' ? 'default' : 'secondary'}
                  >
                    {maintenance.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

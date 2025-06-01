
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useFleetOperations } from "@/hooks/useFleetOperations";
import { Plus, Car, Edit } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export const VehicleManagement = () => {
  const { vehicles, createVehicle, updateVehicle, isLoadingVehicles } = useFleetOperations();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newVehicle, setNewVehicle] = useState({
    vehicle_number: "",
    make: "",
    model: "",
    year: new Date().getFullYear(),
    license_plate: "",
    fuel_type: "gasoline",
    current_mileage: 0,
    status: "active",
  });

  const handleAddVehicle = async () => {
    await createVehicle.mutateAsync(newVehicle);
    setNewVehicle({
      vehicle_number: "",
      make: "",
      model: "",
      year: new Date().getFullYear(),
      license_plate: "",
      fuel_type: "gasoline",
      current_mileage: 0,
      status: "active",
    });
    setIsAddDialogOpen(false);
  };

  if (isLoadingVehicles) {
    return <div>Loading vehicles...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Car className="h-6 w-6 text-red-600" />
          <h1 className="text-2xl font-bold">Vehicle Management</h1>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-red-600 hover:bg-red-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Vehicle
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Vehicle</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="vehicle_number">Vehicle Number</Label>
                <Input
                  id="vehicle_number"
                  value={newVehicle.vehicle_number}
                  onChange={(e) => setNewVehicle({ ...newVehicle, vehicle_number: e.target.value })}
                  placeholder="V001"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="make">Make</Label>
                  <Input
                    id="make"
                    value={newVehicle.make}
                    onChange={(e) => setNewVehicle({ ...newVehicle, make: e.target.value })}
                    placeholder="Toyota"
                  />
                </div>
                <div>
                  <Label htmlFor="model">Model</Label>
                  <Input
                    id="model"
                    value={newVehicle.model}
                    onChange={(e) => setNewVehicle({ ...newVehicle, model: e.target.value })}
                    placeholder="Camry"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="year">Year</Label>
                  <Input
                    id="year"
                    type="number"
                    value={newVehicle.year}
                    onChange={(e) => setNewVehicle({ ...newVehicle, year: parseInt(e.target.value) })}
                  />
                </div>
                <div>
                  <Label htmlFor="license_plate">License Plate</Label>
                  <Input
                    id="license_plate"
                    value={newVehicle.license_plate}
                    onChange={(e) => setNewVehicle({ ...newVehicle, license_plate: e.target.value })}
                    placeholder="ABC-123"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="fuel_type">Fuel Type</Label>
                <Select value={newVehicle.fuel_type} onValueChange={(value) => setNewVehicle({ ...newVehicle, fuel_type: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gasoline">Gasoline</SelectItem>
                    <SelectItem value="diesel">Diesel</SelectItem>
                    <SelectItem value="electric">Electric</SelectItem>
                    <SelectItem value="hybrid">Hybrid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="current_mileage">Current Mileage</Label>
                <Input
                  id="current_mileage"
                  type="number"
                  value={newVehicle.current_mileage}
                  onChange={(e) => setNewVehicle({ ...newVehicle, current_mileage: parseInt(e.target.value) })}
                  placeholder="0"
                />
              </div>
              <Button onClick={handleAddVehicle} className="w-full bg-red-600 hover:bg-red-700">
                Add Vehicle
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {vehicles?.map((vehicle) => (
          <Card key={vehicle.id} className="rounded-3xl border-red-600/20">
            <CardHeader className="bg-gradient-to-r from-red-600/10 to-red-500/10 rounded-t-3xl">
              <CardTitle className="text-red-700 flex items-center justify-between">
                {vehicle.vehicle_number}
                <Badge variant={vehicle.status === 'active' ? 'default' : 'secondary'}>
                  {vehicle.status}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-3">
                <div>
                  <p className="font-medium text-lg">{vehicle.make} {vehicle.model}</p>
                  <p className="text-sm text-muted-foreground">Year: {vehicle.year}</p>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">License Plate:</span>
                    <span className="text-sm font-medium">{vehicle.license_plate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Fuel Type:</span>
                    <span className="text-sm font-medium">{vehicle.fuel_type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Mileage:</span>
                    <span className="text-sm font-medium">{vehicle.current_mileage.toLocaleString()} km</span>
                  </div>
                  {vehicle.assigned_driver && (
                    <div className="flex justify-between">
                      <span className="text-sm">Driver:</span>
                      <span className="text-sm font-medium">{vehicle.assigned_driver.full_name}</span>
                    </div>
                  )}
                  {vehicle.departments && (
                    <div className="flex justify-between">
                      <span className="text-sm">Department:</span>
                      <span className="text-sm font-medium">{vehicle.departments.name}</span>
                    </div>
                  )}
                </div>
                {vehicle.notes && (
                  <div className="pt-2 border-t">
                    <p className="text-sm text-muted-foreground">{vehicle.notes}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
        
        {vehicles?.length === 0 && (
          <div className="col-span-full text-center py-12">
            <Car className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No Vehicles</h3>
            <p className="text-muted-foreground">Start by adding your first vehicle to the fleet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

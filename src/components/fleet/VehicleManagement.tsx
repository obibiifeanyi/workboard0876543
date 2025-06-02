
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Car, Search } from "lucide-react";
import { useFleetOperations } from "@/hooks/useFleetOperations";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const VehicleManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { useVehicles, createVehicle } = useFleetOperations();
  const { data: vehicles = [], isLoading } = useVehicles();

  const filteredVehicles = vehicles.filter(vehicle =>
    vehicle.vehicle_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.model.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddVehicle = () => {
    // Sample vehicle for demonstration
    const newVehicle = {
      vehicle_number: `VH${Date.now()}`,
      make: "Toyota",
      model: "Camry",
      year: 2023,
      license_plate: `ABC${Math.floor(Math.random() * 1000)}`,
      fuel_type: "gasoline",
      current_mileage: 0,
      status: "active" as const,
      assigned_driver_id: null,
    };
    
    createVehicle.mutate(newVehicle);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      case 'retired': return 'bg-gray-100 text-gray-800';
      case 'sold': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return <div>Loading vehicles...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Car className="h-5 w-5" />
            Vehicle Management
          </CardTitle>
          <Button onClick={handleAddVehicle}>
            <Plus className="h-4 w-4 mr-2" />
            Add Vehicle
          </Button>
        </div>
        
        <div className="flex items-center gap-4 mt-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search vehicles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vehicle #</TableHead>
                <TableHead>Make & Model</TableHead>
                <TableHead>Year</TableHead>
                <TableHead>License Plate</TableHead>
                <TableHead>Mileage</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Assigned Driver</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVehicles.map((vehicle) => (
                <TableRow key={vehicle.id}>
                  <TableCell className="font-medium">
                    {vehicle.vehicle_number}
                  </TableCell>
                  <TableCell>
                    {vehicle.make} {vehicle.model}
                  </TableCell>
                  <TableCell>{vehicle.year}</TableCell>
                  <TableCell>{vehicle.license_plate}</TableCell>
                  <TableCell>
                    {vehicle.current_mileage?.toLocaleString()} mi
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(vehicle.status)}>
                      {vehicle.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {vehicle.assigned_driver?.full_name || 'Unassigned'}
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {filteredVehicles.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No vehicles found.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

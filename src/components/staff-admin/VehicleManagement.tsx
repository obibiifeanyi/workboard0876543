import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Car, Plus, Wrench, User } from "lucide-react";

interface Vehicle {
  id: string;
  type: string;
  plateNumber: string;
  model: string;
  status: "available" | "in-use" | "maintenance";
  assignedTo: string | null;
  lastMaintenance: string;
}

const mockVehicles: Vehicle[] = [
  {
    id: "1",
    type: "Pickup Truck",
    plateNumber: "ABC123",
    model: "Toyota Hilux 2023",
    status: "available",
    assignedTo: null,
    lastMaintenance: "2024-05-15",
  },
  {
    id: "2",
    type: "Van",
    plateNumber: "XYZ789",
    model: "Ford Transit 2022",
    status: "in-use",
    assignedTo: "John Doe",
    lastMaintenance: "2024-04-20",
  },
  {
    id: "3",
    type: "SUV",
    plateNumber: "DEF456",
    model: "Toyota Land Cruiser 2023",
    status: "maintenance",
    assignedTo: null,
    lastMaintenance: "2024-06-01",
  },
];

export const VehicleManagement = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-primary">Vehicle Management</h2>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Vehicle Fleet</CardTitle>
            <Button><Plus className="mr-2 h-4 w-4" /> Add Vehicle</Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Plate Number</TableHead>
                  <TableHead>Model</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Assigned To</TableHead>
                  <TableHead>Last Maintenance</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockVehicles.map((vehicle) => (
                  <TableRow key={vehicle.id}>
                    <TableCell>{vehicle.type}</TableCell>
                    <TableCell>{vehicle.plateNumber}</TableCell>
                    <TableCell>{vehicle.model}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        vehicle.status === 'available' ? 'bg-green-100 text-green-800' :
                        vehicle.status === 'in-use' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {vehicle.status.charAt(0).toUpperCase() + vehicle.status.slice(1)}
                      </span>
                    </TableCell>
                    <TableCell>{vehicle.assignedTo || '-'}</TableCell>
                    <TableCell>{vehicle.lastMaintenance}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button variant="ghost" size="sm">
                          <Wrench className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <User className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Vehicle Assignment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Select Vehicle</label>
                  <select className="w-full p-2 border rounded-md">
                    <option value="">Choose a vehicle...</option>
                    {mockVehicles
                      .filter(v => v.status === 'available')
                      .map(v => (
                        <option key={v.id} value={v.id}>
                          {v.type} - {v.plateNumber}
                        </option>
                      ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Assign To</label>
                  <select className="w-full p-2 border rounded-md">
                    <option value="">Select employee...</option>
                    <option value="1">John Doe</option>
                    <option value="2">Jane Smith</option>
                    <option value="3">Peter Jones</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Assignment Period</label>
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="date"
                      className="w-full p-2 border rounded-md"
                      placeholder="Start Date"
                    />
                    <input
                      type="date"
                      className="w-full p-2 border rounded-md"
                      placeholder="End Date"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Purpose</label>
                  <textarea
                    className="w-full p-2 border rounded-md"
                    rows={3}
                    placeholder="Enter purpose of vehicle assignment"
                  />
                </div>
              </div>
              <Button className="w-full">Assign Vehicle</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}; 
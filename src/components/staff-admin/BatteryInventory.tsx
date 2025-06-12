import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2 } from "lucide-react";

interface BatteryItem {
  id: string;
  model: string;
  capacity: string;
  quantity: number;
  status: string;
}

const mockBatteryInventory: BatteryItem[] = [
  {
    id: "1",
    model: "Lithium 12V 100Ah",
    capacity: "100Ah",
    quantity: 50,
    status: "In Stock",
  },
  {
    id: "2",
    model: "AGM 24V 200Ah",
    capacity: "200Ah",
    quantity: 15,
    status: "Low Stock",
  },
  {
    id: "3",
    model: "Gel 48V 50Ah",
    capacity: "50Ah",
    quantity: 5,
    status: "Out of Stock",
  },
];

export const BatteryInventory = () => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "In Stock":
        return "bg-green-100 text-green-800";
      case "Low Stock":
        return "bg-yellow-100 text-yellow-800";
      case "Out of Stock":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-primary">Battery Inventory Management</h2>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>All Batteries</CardTitle>
          <Button><Plus className="mr-2 h-4 w-4" /> Add Battery</Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Model</TableHead>
                <TableHead>Capacity</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockBatteryInventory.map((battery) => (
                <TableRow key={battery.id}>
                  <TableCell className="font-medium">{battery.model}</TableCell>
                  <TableCell>{battery.capacity}</TableCell>
                  <TableCell>{battery.quantity}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(battery.status)}>{battery.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" className="mr-2"><Edit className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="sm"><Trash2 className="h-4 w-4" /></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}; 
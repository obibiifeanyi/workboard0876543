
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Battery, Plus, Search } from "lucide-react";

interface BatteryItem {
  id: string;
  model_name: string;
  capacity: number;
  voltage: number;
  manufacturer: string;
  quantity: number;
  status: string;
  location: string;
}

export const BatteryInventory = () => {
  // Mock data since battery_inventory table doesn't exist
  const [batteries] = useState<BatteryItem[]>([
    {
      id: "1",
      model_name: "AGM Deep Cycle 12V",
      capacity: 100,
      voltage: 12,
      manufacturer: "Optima",
      quantity: 25,
      status: "In Stock",
      location: "Warehouse A"
    },
    {
      id: "2",
      model_name: "Lithium Ion 24V",
      capacity: 200,
      voltage: 24,
      manufacturer: "Tesla",
      quantity: 15,
      status: "Low Stock",
      location: "Warehouse B"
    },
    {
      id: "3",
      model_name: "Lead Acid 48V",
      capacity: 150,
      voltage: 48,
      manufacturer: "Interstate",
      quantity: 8,
      status: "Critical",
      location: "Warehouse A"
    }
  ]);

  const [searchTerm, setSearchTerm] = useState("");

  const filteredBatteries = batteries.filter(battery =>
    battery.model_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    battery.manufacturer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "In Stock":
        return "bg-green-500";
      case "Low Stock":
        return "bg-yellow-500";
      case "Critical":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Battery className="h-5 w-5" />
            Battery Inventory Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search batteries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Battery
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredBatteries.map((battery) => (
              <Card key={battery.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold text-lg">{battery.model_name}</h3>
                      <Badge className={getStatusColor(battery.status)}>
                        {battery.status}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Manufacturer:</span>
                        <span>{battery.manufacturer}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Capacity:</span>
                        <span>{battery.capacity} Ah</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Voltage:</span>
                        <span>{battery.voltage}V</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Quantity:</span>
                        <span className="font-medium">{battery.quantity}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Location:</span>
                        <span>{battery.location}</span>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        Move
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredBatteries.length === 0 && (
            <div className="text-center py-8">
              <Battery className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No batteries found matching your search.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

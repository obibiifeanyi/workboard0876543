import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Battery, Plus } from "lucide-react";

interface BatteryItem {
  id: string;
  model_name: string;
  capacity: string;
  voltage: string;
  manufacturer: string;
  purchase_date: string;
  purchase_price: number;
  status: string;
}

export const BatteryInventory = () => {
  const { toast } = useToast();
  const [isAddingBattery, setIsAddingBattery] = useState(false);

  const { data: batteries, refetch } = useQuery({
    queryKey: ['batteries'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('battery_inventory')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as BatteryItem[];
    },
  });

  const handleAddBattery = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    try {
      const { error } = await supabase
        .from('battery_inventory')
        .insert({
          model_name: formData.get('model_name')?.toString() || '',
          capacity: formData.get('capacity')?.toString() || '',
          voltage: formData.get('voltage')?.toString() || '',
          manufacturer: formData.get('manufacturer')?.toString() || '',
          purchase_price: parseFloat(formData.get('purchase_price')?.toString() || '0'),
        });

      if (error) throw error;

      toast({
        title: "Battery Added",
        description: "New battery has been added to inventory",
      });

      setIsAddingBattery(false);
      refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add battery to inventory",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Battery Inventory</h2>
        <Button onClick={() => setIsAddingBattery(!isAddingBattery)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Battery
        </Button>
      </div>

      {isAddingBattery && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Battery</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddBattery} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="model_name">Model Name</Label>
                  <Input id="model_name" name="model_name" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="manufacturer">Manufacturer</Label>
                  <Input id="manufacturer" name="manufacturer" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="capacity">Capacity</Label>
                  <Input id="capacity" name="capacity" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="voltage">Voltage</Label>
                  <Input id="voltage" name="voltage" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="purchase_price">Purchase Price</Label>
                  <Input 
                    id="purchase_price" 
                    name="purchase_price" 
                    type="number" 
                    step="0.01" 
                    required 
                  />
                </div>
              </div>
              <Button type="submit">Add Battery</Button>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {batteries?.map((battery) => (
          <Card key={battery.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                {battery.model_name}
              </CardTitle>
              <Battery className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">
                  Manufacturer: {battery.manufacturer}
                </div>
                <div className="text-sm text-muted-foreground">
                  Capacity: {battery.capacity}
                </div>
                <div className="text-sm text-muted-foreground">
                  Voltage: {battery.voltage}
                </div>
                <div className="text-sm font-semibold">
                  Price: ${battery.purchase_price}
                </div>
                <div className="text-sm text-muted-foreground">
                  Status: {battery.status}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
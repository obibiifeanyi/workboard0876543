
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Battery, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const BatterySalesSimple = () => {
  const [isAddingBattery, setIsAddingBattery] = useState(false);
  const { toast } = useToast();

  const { data: batteries, isLoading, refetch } = useQuery({
    queryKey: ['battery_inventory'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('battery_inventory')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const handleAddBattery = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    try {
      const { error } = await supabase
        .from('battery_inventory')
        .insert([{
          model_name: formData.get('model_name') as string,
          manufacturer: formData.get('manufacturer') as string,
          capacity_kwh: Number(formData.get('capacity_kwh')),
          voltage: Number(formData.get('voltage')),
          status: 'available',
          condition: 'good',
          location: formData.get('location') as string,
        }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Battery added to inventory successfully",
      });

      e.currentTarget.reset();
      setIsAddingBattery(false);
      refetch();
    } catch (error) {
      console.error('Error adding battery:', error);
      toast({
        title: "Error",
        description: "Failed to add battery to inventory",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <Card className="bg-black/10 dark:bg-white/5 backdrop-blur-lg border-none">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-medium">
            <Battery className="h-5 w-5 text-primary" />
            Battery Inventory
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">Loading batteries...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-black/10 dark:bg-white/5 backdrop-blur-lg border-none">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg font-medium">
          <Battery className="h-5 w-5 text-primary" />
          Battery Inventory
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              Total Batteries: {batteries?.length || 0}
            </p>
            <Button
              onClick={() => setIsAddingBattery(!isAddingBattery)}
              size="sm"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Battery
            </Button>
          </div>

          {isAddingBattery && (
            <Card className="p-4">
              <form onSubmit={handleAddBattery} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="model_name">Model Name</Label>
                    <Input
                      id="model_name"
                      name="model_name"
                      placeholder="Enter model name"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="manufacturer">Manufacturer</Label>
                    <Input
                      id="manufacturer"
                      name="manufacturer"
                      placeholder="Enter manufacturer"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="capacity_kwh">Capacity (kWh)</Label>
                    <Input
                      id="capacity_kwh"
                      name="capacity_kwh"
                      type="number"
                      step="0.1"
                      placeholder="Enter capacity"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="voltage">Voltage</Label>
                    <Input
                      id="voltage"
                      name="voltage"
                      type="number"
                      placeholder="Enter voltage"
                      required
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      name="location"
                      placeholder="Enter location"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button type="submit" size="sm">
                    Add Battery
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setIsAddingBattery(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </Card>
          )}

          <div className="grid gap-4 mt-4">
            {batteries && batteries.length > 0 ? (
              batteries.map((battery) => (
                <Card key={battery.id} className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{battery.model_name}</h3>
                      <p className="text-sm text-muted-foreground">{battery.manufacturer}</p>
                      <p className="text-sm text-muted-foreground">
                        {battery.capacity_kwh}kWh • {battery.voltage}V
                      </p>
                      {battery.location && (
                        <p className="text-sm text-muted-foreground">Location: {battery.location}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">Status: {battery.status}</p>
                      <p className="text-sm text-muted-foreground">
                        Condition: {battery.condition}
                      </p>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <div className="text-center text-muted-foreground">
                No batteries in inventory
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

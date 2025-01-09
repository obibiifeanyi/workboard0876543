import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ShoppingCart, DollarSign } from "lucide-react";

interface BatterySale {
  id: string;
  battery_id: string;
  client_id: string;
  sale_date: string;
  sale_price: number;
  battery: {
    model_name: string;
    manufacturer: string;
  };
}

export const BatterySales = () => {
  const { toast } = useToast();
  const [isAddingSale, setIsAddingSale] = useState(false);

  const { data: availableBatteries } = useQuery({
    queryKey: ['available-batteries'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('battery_inventory')
        .select('*')
        .eq('status', 'in_stock');

      if (error) throw error;
      return data;
    },
  });

  const { data: sales, refetch: refetchSales } = useQuery({
    queryKey: ['battery-sales'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('battery_sales')
        .select(`
          *,
          battery:battery_inventory(model_name, manufacturer)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as BatterySale[];
    },
  });

  const handleAddSale = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    try {
      const { error: saleError } = await supabase
        .from('battery_sales')
        .insert([{
          battery_id: formData.get('battery_id'),
          client_id: formData.get('client_id'),
          sale_price: formData.get('sale_price'),
        }]);

      if (saleError) throw saleError;

      const { error: updateError } = await supabase
        .from('battery_inventory')
        .update({ status: 'sold' })
        .eq('id', formData.get('battery_id'));

      if (updateError) throw updateError;

      toast({
        title: "Sale Recorded",
        description: "Battery sale has been recorded successfully",
      });

      setIsAddingSale(false);
      refetchSales();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to record battery sale",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Battery Sales</h2>
        <Button onClick={() => setIsAddingSale(!isAddingSale)}>
          <ShoppingCart className="h-4 w-4 mr-2" />
          Record Sale
        </Button>
      </div>

      {isAddingSale && (
        <Card>
          <CardHeader>
            <CardTitle>Record New Sale</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddSale} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="battery_id">Select Battery</Label>
                  <Select name="battery_id" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select battery" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableBatteries?.map((battery) => (
                        <SelectItem key={battery.id} value={battery.id}>
                          {battery.model_name} - {battery.manufacturer}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="client_id">Client ID</Label>
                  <Input id="client_id" name="client_id" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sale_price">Sale Price</Label>
                  <Input 
                    id="sale_price" 
                    name="sale_price" 
                    type="number" 
                    step="0.01" 
                    required 
                  />
                </div>
              </div>
              <Button type="submit">Record Sale</Button>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sales?.map((sale) => (
          <Card key={sale.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                {sale.battery?.model_name}
              </CardTitle>
              <DollarSign className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">
                  Manufacturer: {sale.battery?.manufacturer}
                </div>
                <div className="text-sm text-muted-foreground">
                  Client ID: {sale.client_id}
                </div>
                <div className="text-sm font-semibold">
                  Sale Price: ${sale.sale_price}
                </div>
                <div className="text-sm text-muted-foreground">
                  Sale Date: {new Date(sale.sale_date).toLocaleDateString()}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
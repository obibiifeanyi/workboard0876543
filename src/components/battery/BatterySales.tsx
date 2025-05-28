
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ShoppingCart, DollarSign } from "lucide-react";

export const BatterySales = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAddingSale, setIsAddingSale] = useState(false);

  const { data: availableBatteries } = useQuery({
    queryKey: ['battery_inventory'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('battery_inventory')
        .select('*')
        .eq('status', 'available');

      if (error) throw error;
      return data;
    },
  });

  const { data: sales } = useQuery({
    queryKey: ['battery_sales'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('battery_sales')
        .select(`
          *,
          battery_inventory (
            model_name,
            manufacturer
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const createSaleMutation = useMutation({
    mutationFn: async (saleData: any) => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('You must be logged in to record sales');
      }

      const { error } = await supabase
        .from('battery_sales')
        .insert([{
          ...saleData,
          created_by: user.id,
        }]);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['battery_sales'] });
      toast({
        title: "Sale Recorded",
        description: "Battery sale has been recorded successfully",
      });
      setIsAddingSale(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to record battery sale",
        variant: "destructive",
      });
    },
  });

  const handleAddSale = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const saleData = {
      battery_id: formData.get('battery_id')?.toString(),
      client_id: formData.get('client_id')?.toString(),
      sale_price: parseFloat(formData.get('sale_price')?.toString() || '0'),
      sale_date: new Date().toISOString(),
    };

    if (!saleData.battery_id || !saleData.client_id || !saleData.sale_price) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    createSaleMutation.mutate(saleData);
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
              <Button type="submit" disabled={createSaleMutation.isPending}>
                {createSaleMutation.isPending ? 'Recording...' : 'Record Sale'}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sales?.map((sale) => (
          <Card key={sale.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                {sale.battery_inventory?.model_name}
              </CardTitle>
              <DollarSign className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">
                  Manufacturer: {sale.battery_inventory?.manufacturer}
                </div>
                <div className="text-sm text-muted-foreground">
                  Client ID: {sale.client_id}
                </div>
                <div className="text-sm font-semibold">
                  Sale Price: ₦{sale.sale_price.toLocaleString()}
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

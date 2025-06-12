import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const InventoryManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: inventory, isLoading } = useQuery({
    queryKey: ['inventory'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('inventory')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const filteredInventory = inventory?.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (isLoading) {
    return (
      <Card className="bg-black/10 dark:bg-white/5 backdrop-blur-lg border-none">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-medium">
            <Package className="h-5 w-5 text-primary" />
            Inventory Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">Loading inventory...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-black/10 dark:bg-white/5 backdrop-blur-lg border-none">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg font-medium">
          <Package className="h-5 w-5 text-primary" />
          Inventory Management
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex gap-4 flex-col md:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search inventory..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </div>

          <div className="grid gap-4 mt-4">
            {filteredInventory.length > 0 ? (
              filteredInventory.map((item) => (
                <Card key={item.id} className="p-4">
                  <div className="flex justify-between items-start flex-col md:flex-row gap-4">
                    <div>
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-sm text-muted-foreground">{item.category}</p>
                      {item.location && (
                        <p className="text-sm text-muted-foreground">Location: {item.location}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">Quantity: {item.quantity}</p>
                      <p className="text-sm text-muted-foreground">
                        Unit: {item.unit}
                      </p>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <div className="text-center text-muted-foreground">
                {searchTerm ? 'No items match your search' : 'No inventory items found'}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}; 
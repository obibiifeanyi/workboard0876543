
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FleetDashboard } from "@/components/fleet/FleetDashboard";
import { VehicleManagement } from "@/components/fleet/VehicleManagement";
import { FleetExpenseTracking } from "@/components/fleet/FleetExpenseTracking";

export const FleetManagement = () => {
  return (
    <Tabs defaultValue="dashboard" className="space-y-6">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
        <TabsTrigger value="vehicles">Vehicles</TabsTrigger>
        <TabsTrigger value="expenses">Expenses</TabsTrigger>
      </TabsList>
      
      <TabsContent value="dashboard">
        <FleetDashboard />
      </TabsContent>
      
      <TabsContent value="vehicles">
        <VehicleManagement />
      </TabsContent>
      
      <TabsContent value="expenses">
        <FleetExpenseTracking />
      </TabsContent>
    </Tabs>
  );
};


import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { FleetVehicle, VehicleMaintenance, FuelTransaction, TripLog, DriverLicense } from "@/types/fleet";

export const useFleetOperations = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Get all vehicles
  const { data: vehicles, isLoading: isLoadingVehicles } = useQuery({
    queryKey: ["fleet-vehicles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("fleet_vehicles")
        .select(`
          *,
          departments(name),
          assigned_driver:profiles!assigned_driver_id(full_name, email)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as FleetVehicle[];
    },
  });

  // Get vehicle maintenance records
  const { data: maintenanceRecords, isLoading: isLoadingMaintenance } = useQuery({
    queryKey: ["vehicle-maintenance"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("vehicle_maintenance")
        .select(`
          *,
          fleet_vehicles(vehicle_number, make, model)
        `)
        .order("service_date", { ascending: false });

      if (error) throw error;
      return data as VehicleMaintenance[];
    },
  });

  // Get fuel transactions
  const { data: fuelTransactions, isLoading: isLoadingFuel } = useQuery({
    queryKey: ["fuel-transactions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("fuel_transactions")
        .select(`
          *,
          fleet_vehicles(vehicle_number, make, model),
          profiles!driver_id(full_name, email)
        `)
        .order("transaction_date", { ascending: false });

      if (error) throw error;
      return data as FuelTransaction[];
    },
  });

  // Get trip logs
  const { data: tripLogs, isLoading: isLoadingTrips } = useQuery({
    queryKey: ["trip-logs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("trip_logs")
        .select(`
          *,
          fleet_vehicles(vehicle_number, make, model),
          profiles!driver_id(full_name, email)
        `)
        .order("start_time", { ascending: false });

      if (error) throw error;
      return data as TripLog[];
    },
  });

  // Create vehicle mutation
  const createVehicle = useMutation({
    mutationFn: async (vehicleData: Partial<FleetVehicle>) => {
      const { error } = await supabase.from("fleet_vehicles").insert(vehicleData);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fleet-vehicles"] });
      toast({
        title: "Success",
        description: "Vehicle added successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add vehicle",
        variant: "destructive",
      });
    },
  });

  // Update vehicle mutation
  const updateVehicle = useMutation({
    mutationFn: async ({ id, ...vehicleData }: Partial<FleetVehicle> & { id: string }) => {
      const { error } = await supabase
        .from("fleet_vehicles")
        .update(vehicleData)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fleet-vehicles"] });
      toast({
        title: "Success",
        description: "Vehicle updated successfully",
      });
    },
  });

  // Create maintenance record mutation
  const createMaintenanceRecord = useMutation({
    mutationFn: async (maintenanceData: Partial<VehicleMaintenance>) => {
      const { data: { user } } = await supabase.auth.getUser();
      const { error } = await supabase.from("vehicle_maintenance").insert({
        ...maintenanceData,
        created_by: user?.id,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicle-maintenance"] });
      toast({
        title: "Success",
        description: "Maintenance record added successfully",
      });
    },
  });

  // Create fuel transaction mutation
  const createFuelTransaction = useMutation({
    mutationFn: async (fuelData: Partial<FuelTransaction>) => {
      const { data: { user } } = await supabase.auth.getUser();
      const { error } = await supabase.from("fuel_transactions").insert({
        ...fuelData,
        created_by: user?.id,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fuel-transactions"] });
      toast({
        title: "Success",
        description: "Fuel transaction recorded successfully",
      });
    },
  });

  return {
    vehicles,
    maintenanceRecords,
    fuelTransactions,
    tripLogs,
    isLoadingVehicles,
    isLoadingMaintenance,
    isLoadingFuel,
    isLoadingTrips,
    createVehicle,
    updateVehicle,
    createMaintenanceRecord,
    createFuelTransaction,
  };
};

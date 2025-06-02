
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Vehicle {
  id: string;
  vehicle_number: string;
  make: string;
  model: string;
  year: number;
  license_plate: string;
  fuel_type: string;
  current_mileage: number | null;
  status: string;
  assigned_driver_id: string | null;
  assigned_driver?: {
    full_name: string | null;
  };
  created_at: string;
  updated_at: string;
}

interface VehicleMaintenance {
  id: string;
  vehicle_id: string;
  maintenance_type: string;
  description: string | null;
  scheduled_date: string | null;
  completed_date: string | null;
  cost: number | null;
  technician: string | null;
  status: string;
  notes: string | null;
  vehicle?: Vehicle;
  created_at: string;
  updated_at: string;
}

interface FuelTransaction {
  id: string;
  vehicle_id: string;
  driver_id: string | null;
  fuel_amount: number;
  cost_per_unit: number;
  total_cost: number;
  transaction_date: string;
  fuel_station: string | null;
  mileage: number | null;
  vehicle?: Vehicle;
  created_at: string;
  updated_at: string;
}

export const useFleetOperations = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const useVehicles = () => {
    return useQuery({
      queryKey: ['vehicles'],
      queryFn: async () => {
        const { data, error } = await supabase
          .from('fleet_vehicles')
          .select(`
            *,
            assigned_driver:profiles!fleet_vehicles_assigned_driver_id_fkey(full_name)
          `)
          .order('created_at', { ascending: false });

        if (error) throw error;
        return data as Vehicle[];
      },
    });
  };

  const useVehicleMaintenance = () => {
    return useQuery({
      queryKey: ['vehicle-maintenance'],
      queryFn: async () => {
        const { data, error } = await supabase
          .from('vehicle_maintenance')
          .select(`
            id,
            vehicle_id,
            maintenance_type,
            description,
            scheduled_date,
            completed_date,
            cost,
            technician,
            status,
            notes,
            created_at,
            updated_at,
            vehicle:fleet_vehicles(*)
          `)
          .order('created_at', { ascending: false });

        if (error) {
          console.warn('Vehicle maintenance table not found, returning empty array');
          return [];
        }
        return data as VehicleMaintenance[];
      },
    });
  };

  const useFuelTransactions = () => {
    return useQuery({
      queryKey: ['fuel-transactions'],
      queryFn: async () => {
        const { data, error } = await supabase
          .from('fuel_transactions')
          .select(`
            *,
            vehicle:fleet_vehicles(*)
          `)
          .order('transaction_date', { ascending: false });

        if (error) throw error;
        return data as FuelTransaction[];
      },
    });
  };

  const useTripLogs = () => {
    return useQuery({
      queryKey: ['trip-logs'],
      queryFn: async () => {
        const { data, error } = await supabase
          .from('trip_logs')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.warn('Trip logs table not found, returning empty array');
          return [];
        }
        return data;
      },
    });
  };

  const createVehicle = useMutation({
    mutationFn: async (vehicle: Omit<Vehicle, 'id' | 'created_at' | 'updated_at' | 'assigned_driver'>) => {
      const { data, error } = await supabase
        .from('fleet_vehicles')
        .insert(vehicle)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      toast({
        title: "Vehicle Added",
        description: "New vehicle has been added to the fleet.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to Add Vehicle",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    useVehicles,
    useVehicleMaintenance,
    useFuelTransactions,
    useTripLogs,
    createVehicle,
  };
};


import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { FleetVehicle, VehicleMaintenance, FuelTransaction, TripLog } from '@/types/fleet';

export const useFleetOperations = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch all vehicles
  const useVehicles = () => {
    return useQuery({
      queryKey: ['fleet-vehicles'],
      queryFn: async () => {
        const { data, error } = await supabase
          .from('fleet_vehicles')
          .select(`
            *,
            assigned_driver:assigned_driver_id(full_name, email),
            department:department_id(name)
          `)
          .order('vehicle_number');
        
        if (error) throw error;
        return data as FleetVehicle[];
      },
    });
  };

  // Fetch vehicle maintenance records
  const useVehicleMaintenance = () => {
    return useQuery({
      queryKey: ['vehicle-maintenance'],
      queryFn: async () => {
        const { data, error } = await supabase
          .from('vehicle_maintenance')
          .select(`
            *,
            vehicle:vehicle_id(vehicle_number, make, model)
          `)
          .order('scheduled_date', { ascending: false });
        
        if (error) throw error;
        return data as VehicleMaintenance[];
      },
    });
  };

  // Fetch fuel transactions
  const useFuelTransactions = () => {
    return useQuery({
      queryKey: ['fuel-transactions'],
      queryFn: async () => {
        const { data, error } = await supabase
          .from('fuel_transactions')
          .select(`
            *,
            vehicle:vehicle_id(vehicle_number, make, model),
            driver:driver_id(full_name, email)
          `)
          .order('transaction_date', { ascending: false });
        
        if (error) throw error;
        return data as FuelTransaction[];
      },
    });
  };

  // Fetch trip logs
  const useTripLogs = () => {
    return useQuery({
      queryKey: ['trip-logs'],
      queryFn: async () => {
        const { data, error } = await supabase
          .from('trip_logs')
          .select(`
            *,
            vehicle:vehicle_id(vehicle_number, make, model),
            driver:driver_id(full_name, email)
          `)
          .order('start_time', { ascending: false });
        
        if (error) throw error;
        return data as TripLog[];
      },
    });
  };

  // Create vehicle
  const createVehicle = useMutation({
    mutationFn: async (vehicle: Partial<FleetVehicle>) => {
      const { data, error } = await supabase
        .from('fleet_vehicles')
        .insert(vehicle)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fleet-vehicles'] });
      toast({
        title: "Success",
        description: "Vehicle added successfully",
      });
    },
  });

  // Create fuel transaction
  const createFuelTransaction = useMutation({
    mutationFn: async (transaction: Partial<FuelTransaction>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('fuel_transactions')
        .insert({
          ...transaction,
          created_by: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fuel-transactions'] });
      toast({
        title: "Success",
        description: "Fuel transaction recorded successfully",
      });
    },
  });

  return {
    useVehicles,
    useVehicleMaintenance,
    useFuelTransactions,
    useTripLogs,
    createVehicle,
    createFuelTransaction,
  };
};

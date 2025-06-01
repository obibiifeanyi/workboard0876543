
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { FleetVehicle, VehicleMaintenance, FuelTransaction, TripLog, DriverLicense } from '@/types/fleet';
import { useToast } from '@/hooks/use-toast';

export const useFleetOperations = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch all vehicles
  const useVehicles = () => {
    return useQuery({
      queryKey: ['fleet_vehicles'],
      queryFn: async () => {
        const { data, error } = await supabase
          .from('fleet_vehicles')
          .select(`
            *,
            departments(name),
            assigned_driver:profiles!assigned_driver_id(full_name, email)
          `)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        return data as FleetVehicle[];
      },
    });
  };

  // Fetch vehicle maintenance records
  const useVehicleMaintenance = () => {
    return useQuery({
      queryKey: ['vehicle_maintenance'],
      queryFn: async () => {
        const { data, error } = await supabase
          .from('vehicle_maintenance')
          .select(`
            *,
            fleet_vehicles(vehicle_number, make, model)
          `)
          .order('service_date', { ascending: false });
        
        if (error) throw error;
        return data as VehicleMaintenance[];
      },
    });
  };

  // Fetch fuel transactions
  const useFuelTransactions = () => {
    return useQuery({
      queryKey: ['fuel_transactions'],
      queryFn: async () => {
        const { data, error } = await supabase
          .from('fuel_transactions')
          .select(`
            *,
            fleet_vehicles(vehicle_number, make, model),
            profiles(full_name, email)
          `)
          .order('transaction_date', { ascending: false });
        
        if (error) throw error;
        return data as FuelTransaction[];
      },
    });
  };

  // Create vehicle
  const createVehicle = useMutation({
    mutationFn: async (vehicle: Omit<FleetVehicle, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('fleet_vehicles')
        .insert(vehicle)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fleet_vehicles'] });
      toast({
        title: "Success",
        description: "Vehicle added successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to add vehicle: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Update vehicle
  const updateVehicle = useMutation({
    mutationFn: async ({ id, ...updates }: { id: string } & Partial<FleetVehicle>) => {
      const { data, error } = await supabase
        .from('fleet_vehicles')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fleet_vehicles'] });
      toast({
        title: "Success",
        description: "Vehicle updated successfully",
      });
    },
  });

  // Create maintenance record
  const createMaintenanceRecord = useMutation({
    mutationFn: async (maintenance: Omit<VehicleMaintenance, 'id' | 'created_at' | 'updated_at'>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('vehicle_maintenance')
        .insert({
          ...maintenance,
          created_by: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicle_maintenance'] });
      toast({
        title: "Success",
        description: "Maintenance record created successfully",
      });
    },
  });

  // Create fuel transaction
  const createFuelTransaction = useMutation({
    mutationFn: async (transaction: Omit<FuelTransaction, 'id' | 'created_at' | 'updated_at'>) => {
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
      queryClient.invalidateQueries({ queryKey: ['fuel_transactions'] });
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
    createVehicle,
    updateVehicle,
    createMaintenanceRecord,
    createFuelTransaction,
  };
};

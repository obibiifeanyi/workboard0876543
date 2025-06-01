
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
            assigned_driver:profiles!assigned_driver_id(full_name, email),
            department:departments!department_id(name)
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
            vehicle:fleet_vehicles!vehicle_id(vehicle_number, make, model)
          `)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        return data.map(item => ({
          ...item,
          scheduled_date: item.created_at, // Map if needed
        })) as VehicleMaintenance[];
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
            vehicle:fleet_vehicles!vehicle_id(vehicle_number, make, model),
            driver:profiles!driver_id(full_name, email)
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
            vehicle:fleet_vehicles!vehicle_id(vehicle_number, make, model),
            driver:profiles!driver_id(full_name, email)
          `)
          .order('start_time', { ascending: false });
        
        if (error) throw error;
        return data as TripLog[];
      },
    });
  };

  // Create vehicle
  const createVehicle = useMutation({
    mutationFn: async (vehicle: Omit<Partial<FleetVehicle>, 'id'>) => {
      const { data, error } = await supabase
        .from('fleet_vehicles')
        .insert({
          vehicle_number: vehicle.vehicle_number!,
          make: vehicle.make!,
          model: vehicle.model!,
          year: vehicle.year!,
          license_plate: vehicle.license_plate!,
          vin: vehicle.vin,
          color: vehicle.color,
          fuel_type: vehicle.fuel_type,
          status: vehicle.status || 'active',
          current_mileage: vehicle.current_mileage,
          purchase_date: vehicle.purchase_date,
          purchase_price: vehicle.purchase_price,
          assigned_driver_id: vehicle.assigned_driver_id,
          department_id: vehicle.department_id,
          insurance_provider: vehicle.insurance_provider,
          insurance_policy_number: vehicle.insurance_policy_number,
          insurance_expiry: vehicle.insurance_expiry,
          registration_expiry: vehicle.registration_expiry,
          notes: vehicle.notes,
        })
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
    mutationFn: async (transaction: Omit<Partial<FuelTransaction>, 'id'>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('fuel_transactions')
        .insert({
          vehicle_id: transaction.vehicle_id!,
          driver_id: transaction.driver_id,
          fuel_amount: transaction.fuel_amount!,
          cost_per_unit: transaction.cost_per_unit!,
          total_cost: transaction.total_cost!,
          fuel_station: transaction.fuel_station,
          transaction_date: transaction.transaction_date!,
          mileage: transaction.mileage,
          receipt_url: transaction.receipt_url,
          notes: transaction.notes,
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

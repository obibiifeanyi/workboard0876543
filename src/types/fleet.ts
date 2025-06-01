
export interface FleetVehicle {
  id: string;
  vehicle_number: string;
  make: string;
  model: string;
  year: number;
  license_plate: string;
  vin?: string;
  color?: string;
  fuel_type?: string;
  status: 'active' | 'maintenance' | 'inactive' | 'retired';
  current_mileage?: number;
  purchase_date?: string;
  purchase_price?: number;
  assigned_driver_id?: string;
  department_id?: string;
  insurance_provider?: string;
  insurance_policy_number?: string;
  insurance_expiry?: string;
  registration_expiry?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  assigned_driver?: {
    full_name: string;
    email: string;
  };
  department?: {
    name: string;
  };
}

export interface VehicleMaintenance {
  id: string;
  vehicle_id: string;
  maintenance_type: string;
  description?: string;
  scheduled_date: string;
  completed_date?: string;
  cost?: number;
  technician?: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  notes?: string;
  created_at: string;
  updated_at: string;
  vehicle?: {
    vehicle_number: string;
    make: string;
    model: string;
  };
}

export interface FuelTransaction {
  id: string;
  vehicle_id: string;
  driver_id?: string;
  fuel_amount: number;
  cost_per_unit: number;
  total_cost: number;
  fuel_station?: string;
  transaction_date: string;
  mileage?: number;
  receipt_url?: string;
  notes?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
  vehicle?: {
    vehicle_number: string;
    make: string;
    model: string;
  };
  driver?: {
    full_name: string;
    email: string;
  };
}

export interface TripLog {
  id: string;
  vehicle_id: string;
  driver_id: string;
  start_location: string;
  end_location: string;
  start_time: string;
  end_time?: string;
  start_mileage: number;
  end_mileage?: number;
  purpose: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  vehicle?: {
    vehicle_number: string;
    make: string;
    model: string;
  };
  driver?: {
    full_name: string;
    email: string;
  };
}

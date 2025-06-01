
export interface FleetVehicle {
  id: string;
  vehicle_number: string;
  make: string;
  model: string;
  year: number;
  vin?: string;
  license_plate: string;
  color?: string;
  fuel_type: string;
  purchase_date?: string;
  purchase_price?: number;
  current_mileage: number;
  status: 'active' | 'maintenance' | 'retired' | 'sold';
  insurance_provider?: string;
  insurance_policy_number?: string;
  insurance_expiry?: string;
  registration_expiry?: string;
  department_id?: string;
  assigned_driver_id?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  departments?: {
    name: string;
  };
  assigned_driver?: {
    full_name: string;
    email: string;
  };
}

export interface VehicleMaintenance {
  id: string;
  vehicle_id: string;
  maintenance_type: string;
  description?: string;
  service_provider?: string;
  cost: number;
  mileage_at_service?: number;
  service_date: string;
  next_service_date?: string;
  next_service_mileage?: number;
  receipt_url?: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  created_by?: string;
  created_at: string;
  updated_at: string;
  fleet_vehicles?: {
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
  mileage?: number;
  fuel_station?: string;
  transaction_date: string;
  receipt_url?: string;
  notes?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
  fleet_vehicles?: {
    vehicle_number: string;
    make: string;
    model: string;
  };
  profiles?: {
    full_name: string;
    email: string;
  };
}

export interface TripLog {
  id: string;
  vehicle_id: string;
  driver_id: string;
  project_id?: string;
  site_id?: string;
  start_location: string;
  end_location: string;
  start_mileage: number;
  end_mileage?: number;
  start_time: string;
  end_time?: string;
  purpose: string;
  notes?: string;
  status: 'in_progress' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
  fleet_vehicles?: {
    vehicle_number: string;
    make: string;
    model: string;
  };
  profiles?: {
    full_name: string;
    email: string;
  };
}

export interface DriverLicense {
  id: string;
  driver_id: string;
  license_number: string;
  license_class: string;
  issue_date: string;
  expiry_date: string;
  issuing_authority?: string;
  status: 'active' | 'suspended' | 'expired' | 'revoked';
  created_at: string;
  updated_at: string;
  profiles?: {
    full_name: string;
    email: string;
  };
}

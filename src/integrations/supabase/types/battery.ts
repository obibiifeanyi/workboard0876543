export interface BatteryInventoryRow {
  capacity: string;
  created_at: string | null;
  id: string;
  manufacturer: string;
  model_name: string;
  purchase_date: string | null;
  purchase_price: number;
  status: string | null;
  updated_at: string | null;
  voltage: string;
}

export interface BatterySalesRow {
  battery_id: string | null;
  client_id: string;
  created_at: string | null;
  created_by: string | null;
  id: string;
  sale_date: string | null;
  sale_price: number;
  updated_at: string | null;
}
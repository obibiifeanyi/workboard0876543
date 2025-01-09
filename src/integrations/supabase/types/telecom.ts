export interface TelecomSiteRow {
  address: string | null;
  client_list: string[] | null;
  created_at: string | null;
  id: string;
  location: string;
  manager_id: string | null;
  name: string;
  region: string | null;
  site_number: string | null;
  status: string | null;
  updated_at: string | null;
}

export interface CTPowerReportRow {
  battery_status: string | null;
  comments: string | null;
  created_at: string | null;
  created_by: string | null;
  diesel_level: number | null;
  generator_runtime: number | null;
  id: string;
  power_reading: number | null;
  report_datetime: string | null;
  report_number: string | null;
  site_id: string | null;
  status: string | null;
  updated_at: string | null;
}

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
  site_id: string | null; // Now properly UUID
  status: string | null;
  updated_at: string | null;
}

export interface SiteReportRow {
  id: string;
  site_id: string; // Now properly UUID with foreign key
  report_type: string;
  title: string;
  description: string | null;
  status: string | null;
  data: any;
  report_date: string;
  reported_by: string;
  reviewed_by: string | null;
  attachments: string[] | null;
  created_at: string | null;
  updated_at: string | null;
}

// Enhanced interface for joined data
export interface TelecomReportWithSite extends SiteReportRow {
  telecom_sites: {
    name: string;
    location: string;
    site_number: string | null;
  } | null;
}

export interface PowerReportWithSite extends CTPowerReportRow {
  telecom_sites: {
    name: string;
    location: string;
    site_number: string | null;
  } | null;
}

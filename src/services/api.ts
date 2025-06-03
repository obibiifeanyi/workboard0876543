
import { supabase } from "@/integrations/supabase/client";

export interface CTPowerReportData {
  site_id: string;
  report_datetime: string;
  diesel_level: number;
  generator_runtime: number;
  power_reading?: number;
  battery_status?: string;
  comments?: string;
  status: string;
  report_number?: string;
}

export class ApiService {
  static async createCTPowerReport(data: CTPowerReportData) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from('ct_power_reports')
        .insert({
          ...data,
          created_by: user.id,
        });

      if (error) throw error;

      return { success: true };
    } catch (error) {
      console.error('Error creating CT power report:', error);
      return { success: false, error: error.message };
    }
  }
}

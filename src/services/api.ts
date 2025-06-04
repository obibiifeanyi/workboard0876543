
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

type ApiResponse<T = any> = {
  success: boolean;
  data?: T;
  error?: string;
};

export class ApiService {
  static async createCTPowerReport(data: CTPowerReportData): Promise<ApiResponse> {
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
    } catch (error: any) {
      console.error('Error creating CT power report:', error);
      return { success: false, error: error.message };
    }
  }

  static async getDepartments(): Promise<ApiResponse> {
    try {
      const { data, error } = await supabase
        .from('departments')
        .select('*')
        .order('name');

      if (error) throw error;
      return { success: true, data };
    } catch (error: any) {
      console.error('Error fetching departments:', error);
      return { success: false, error: error.message };
    }
  }

  static async getProjects(): Promise<ApiResponse> {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { success: true, data };
    } catch (error: any) {
      console.error('Error fetching projects:', error);
      return { success: false, error: error.message };
    }
  }

  static async getSites(): Promise<ApiResponse> {
    try {
      const { data, error } = await supabase
        .from('telecom_sites')
        .select('*')
        .order('name');

      if (error) throw error;
      return { success: true, data };
    } catch (error: any) {
      console.error('Error fetching sites:', error);
      return { success: false, error: error.message };
    }
  }

  static async getWeeklyReports(userId?: string): Promise<ApiResponse> {
    try {
      let query = supabase
        .from('weekly_reports')
        .select('*')
        .order('created_at', { ascending: false });

      if (userId) {
        query = query.eq('created_by', userId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return { success: true, data };
    } catch (error: any) {
      console.error('Error fetching weekly reports:', error);
      return { success: false, error: error.message };
    }
  }

  static async getMemos(userId?: string): Promise<ApiResponse> {
    try {
      let query = supabase
        .from('memos')
        .select('*')
        .order('created_at', { ascending: false });

      if (userId) {
        query = query.eq('created_by', userId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return { success: true, data };
    } catch (error: any) {
      console.error('Error fetching memos:', error);
      return { success: false, error: error.message };
    }
  }

  static async getNotifications(userId: string): Promise<ApiResponse> {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { success: true, data };
    } catch (error: any) {
      console.error('Error fetching notifications:', error);
      return { success: false, error: error.message };
    }
  }

  static async markNotificationAsRead(notificationId: string): Promise<ApiResponse> {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId);

      if (error) throw error;
      return { success: true };
    } catch (error: any) {
      console.error('Error marking notification as read:', error);
      return { success: false, error: error.message };
    }
  }

  static async getDocuments(): Promise<ApiResponse> {
    try {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { success: true, data };
    } catch (error: any) {
      console.error('Error fetching documents:', error);
      return { success: false, error: error.message };
    }
  }

  static async uploadDocument(file: File, documentData: any): Promise<ApiResponse> {
    try {
      const { data, error } = await supabase
        .from('documents')
        .insert(documentData);

      if (error) throw error;
      return { success: true, data };
    } catch (error: any) {
      console.error('Error uploading document:', error);
      return { success: false, error: error.message };
    }
  }

  static async getBatteryReports(): Promise<ApiResponse> {
    try {
      const { data, error } = await supabase
        .from('battery_reports')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { success: true, data };
    } catch (error: any) {
      console.error('Error fetching battery reports:', error);
      return { success: false, error: error.message };
    }
  }

  static async getTelecomReports(): Promise<ApiResponse> {
    try {
      const { data, error } = await supabase
        .from('site_reports')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { success: true, data };
    } catch (error: any) {
      console.error('Error fetching telecom reports:', error);
      return { success: false, error: error.message };
    }
  }

  static async getLeaveRequests(userId?: string): Promise<ApiResponse> {
    try {
      let query = supabase
        .from('leave_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (userId) {
        query = query.eq('user_id', userId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return { success: true, data };
    } catch (error: any) {
      console.error('Error fetching leave requests:', error);
      return { success: false, error: error.message };
    }
  }
}

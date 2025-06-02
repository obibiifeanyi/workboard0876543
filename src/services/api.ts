import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Types for API responses
export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  success: boolean;
}

// Generic API service class
export class ApiService {
  // User management
  static async getCurrentUser() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;
      
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        return { success: true, data: { user, profile } };
      }
      
      return { success: false, error: 'No user found' };
    } catch (error: any) {
      console.error('Get current user error:', error);
      return { success: false, error: error.message };
    }
  }

  // Profile management
  static async updateProfile(userId: string, updates: any): Promise<ApiResponse> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;

      toast.success('Profile updated successfully');
      return { success: true, data };
    } catch (error: any) {
      console.error('Update profile error:', error);
      toast.error('Failed to update profile');
      return { success: false, error: error.message };
    }
  }

  // Department management
  static async getDepartments(): Promise<ApiResponse> {
    try {
      const { data, error } = await supabase
        .from('departments')
        .select(`
          *,
          manager:profiles!departments_manager_id_fkey(full_name)
        `)
        .order('name');

      if (error) throw error;
      return { success: true, data };
    } catch (error: any) {
      console.error('Get departments error:', error);
      return { success: false, error: error.message };
    }
  }

  static async createDepartment(department: any): Promise<ApiResponse> {
    try {
      const { data, error } = await supabase
        .from('departments')
        .insert(department)
        .select()
        .single();

      if (error) throw error;

      toast.success('Department created successfully');
      return { success: true, data };
    } catch (error: any) {
      console.error('Create department error:', error);
      toast.error('Failed to create department');
      return { success: false, error: error.message };
    }
  }

  static async updateDepartment(id: string, updates: any): Promise<ApiResponse> {
    try {
      const { data, error } = await supabase
        .from('departments')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      toast.success('Department updated successfully');
      return { success: true, data };
    } catch (error: any) {
      console.error('Update department error:', error);
      toast.error('Failed to update department');
      return { success: false, error: error.message };
    }
  }

  static async deleteDepartment(id: string): Promise<ApiResponse> {
    try {
      const { error } = await supabase
        .from('departments')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('Department deleted successfully');
      return { success: true };
    } catch (error: any) {
      console.error('Delete department error:', error);
      toast.error('Failed to delete department');
      return { success: false, error: error.message };
    }
  }

  // Project management
  static async getProjects(): Promise<ApiResponse> {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          manager:profiles!projects_manager_id_fkey(full_name),
          department:departments!projects_department_id_fkey(name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { success: true, data };
    } catch (error: any) {
      console.error('Get projects error:', error);
      return { success: false, error: error.message };
    }
  }

  static async createProject(project: any): Promise<ApiResponse> {
    try {
      const { data, error } = await supabase
        .from('projects')
        .insert(project)
        .select()
        .single();

      if (error) throw error;

      toast.success('Project created successfully');
      return { success: true, data };
    } catch (error: any) {
      console.error('Create project error:', error);
      toast.error('Failed to create project');
      return { success: false, error: error.message };
    }
  }

  static async updateProject(id: string, updates: any): Promise<ApiResponse> {
    try {
      const { data, error } = await supabase
        .from('projects')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      toast.success('Project updated successfully');
      return { success: true, data };
    } catch (error: any) {
      console.error('Update project error:', error);
      toast.error('Failed to update project');
      return { success: false, error: error.message };
    }
  }

  // Sites management
  static async getSites(): Promise<ApiResponse> {
    try {
      const { data, error } = await supabase
        .from('sites')
        .select('*')
        .order('name');

      if (error) throw error;
      return { success: true, data };
    } catch (error: any) {
      console.error('Get sites error:', error);
      return { success: false, error: error.message };
    }
  }

  static async createSite(site: any): Promise<ApiResponse> {
    try {
      const { data, error } = await supabase
        .from('sites')
        .insert(site)
        .select()
        .single();

      if (error) throw error;

      toast.success('Site created successfully');
      return { success: true, data };
    } catch (error: any) {
      console.error('Create site error:', error);
      toast.error('Failed to create site');
      return { success: false, error: error.message };
    }
  }

  // Weekly Reports
  static async getWeeklyReports(userId?: string): Promise<ApiResponse> {
    try {
      let query = supabase
        .from('weekly_reports')
        .select(`
          *,
          reviewer:profiles!weekly_reports_reviewed_by_fkey(full_name)
        `)
        .order('week_start_date', { ascending: false });

      if (userId) {
        query = query.eq('user_id', userId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return { success: true, data };
    } catch (error: any) {
      console.error('Get weekly reports error:', error);
      return { success: false, error: error.message };
    }
  }

  static async createWeeklyReport(report: any): Promise<ApiResponse> {
    try {
      const { data, error } = await supabase
        .from('weekly_reports')
        .insert(report)
        .select()
        .single();

      if (error) throw error;

      toast.success('Weekly report created successfully');
      return { success: true, data };
    } catch (error: any) {
      console.error('Create weekly report error:', error);
      toast.error('Failed to create weekly report');
      return { success: false, error: error.message };
    }
  }

  // Memos
  static async getMemos(userId?: string): Promise<ApiResponse> {
    try {
      let query = supabase
        .from('staff_memos')
        .select(`
          *,
          sender:profiles!staff_memos_sender_id_fkey(full_name),
          recipient:profiles!staff_memos_recipient_id_fkey(full_name)
        `)
        .order('created_at', { ascending: false });

      if (userId) {
        query = query.or(`sender_id.eq.${userId},recipient_id.eq.${userId}`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return { success: true, data };
    } catch (error: any) {
      console.error('Get memos error:', error);
      return { success: false, error: error.message };
    }
  }

  static async createMemo(memo: any): Promise<ApiResponse> {
    try {
      const { data, error } = await supabase
        .from('staff_memos')
        .insert(memo)
        .select()
        .single();

      if (error) throw error;

      // Create notification for recipient
      await this.createNotification({
        user_id: memo.recipient_id,
        title: 'New Memo Received',
        message: `You have received a new memo: ${memo.subject}`,
        type: 'memo',
        metadata: { memo_id: data.id }
      });

      toast.success('Memo sent successfully');
      return { success: true, data };
    } catch (error: any) {
      console.error('Create memo error:', error);
      toast.error('Failed to send memo');
      return { success: false, error: error.message };
    }
  }

  // Notifications
  static async getNotifications(userId: string): Promise<ApiResponse> {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      return { success: true, data };
    } catch (error: any) {
      console.error('Get notifications error:', error);
      return { success: false, error: error.message };
    }
  }

  static async createNotification(notification: any): Promise<ApiResponse> {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .insert(notification)
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error: any) {
      console.error('Create notification error:', error);
      return { success: false, error: error.message };
    }
  }

  static async markNotificationAsRead(id: string): Promise<ApiResponse> {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error: any) {
      console.error('Mark notification as read error:', error);
      return { success: false, error: error.message };
    }
  }

  // Documents
  static async getDocuments(): Promise<ApiResponse> {
    try {
      const { data, error } = await supabase
        .from('documents')
        .select(`
          *,
          uploader:profiles!documents_uploaded_by_fkey(full_name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { success: true, data };
    } catch (error: any) {
      console.error('Get documents error:', error);
      return { success: false, error: error.message };
    }
  }

  static async uploadDocument(file: File, metadata: any): Promise<ApiResponse> {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `documents/${fileName}`;

      // Upload file to storage
      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Create document record
      const { data, error } = await supabase
        .from('documents')
        .insert({
          ...metadata,
          file_name: file.name,
          file_path: filePath,
          file_type: file.type,
          file_size: file.size
        })
        .select()
        .single();

      if (error) throw error;

      toast.success('Document uploaded successfully');
      return { success: true, data };
    } catch (error: any) {
      console.error('Upload document error:', error);
      toast.error('Failed to upload document');
      return { success: false, error: error.message };
    }
  }

  // Battery Reports
  static async getBatteryReports(): Promise<ApiResponse> {
    try {
      const { data, error } = await supabase
        .from('battery_reports')
        .select(`
          *,
          reporter:profiles!battery_reports_reporter_id_fkey(full_name)
        `)
        .order('report_date', { ascending: false });

      if (error) throw error;
      return { success: true, data };
    } catch (error: any) {
      console.error('Get battery reports error:', error);
      return { success: false, error: error.message };
    }
  }

  static async createBatteryReport(report: any): Promise<ApiResponse> {
    try {
      const { data, error } = await supabase
        .from('battery_reports')
        .insert(report)
        .select()
        .single();

      if (error) throw error;

      toast.success('Battery report created successfully');
      return { success: true, data };
    } catch (error: any) {
      console.error('Create battery report error:', error);
      toast.error('Failed to create battery report');
      return { success: false, error: error.message };
    }
  }

  // Telecom Reports
  static async getTelecomReports(userId?: string): Promise<ApiResponse<any[]>> {
    try {
      let query = supabase
        .from('telecom_reports')
        .select(`
          *,
          site:site_id(name),
          reporter:reporter_id(full_name),
          assigned_user:assigned_to(full_name)
        `)
        .order('created_at', { ascending: false });

      if (userId) {
        query = query.or(`reporter_id.eq.${userId},assigned_to.eq.${userId}`);
      }

      const { data, error } = await query;
      if (error) throw error;

      return { success: true, data: data || [] };
    } catch (error: any) {
      console.error('Get telecom reports error:', error);
      return { success: false, error: error.message };
    }
  }

  static async createTelecomReport(reportData: {
    site_id?: string;
    report_category: string;
    signal_strength?: number;
    network_status: string;
    equipment_status: string;
    issues_reported?: string;
    maintenance_required: boolean;
    recommendations?: string;
    priority_level?: string;
    generator_runtime?: number;
    diesel_level?: number;
    power_status?: string;
    customer_complaint_details?: string;
    security_incident_type?: string;
    security_details?: string;
    uncategorized_type?: string;
    report_date: string;
  }): Promise<ApiResponse<any>> {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('telecom_reports')
        .insert({
          ...reportData,
          reporter_id: user.user.id
        })
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error: any) {
      console.error('Create telecom report error:', error);
      return { success: false, error: error.message };
    }
  }

  static async updateTelecomReport(id: string, reportData: Partial<{
    resolution_status: string;
    assigned_to: string;
    recommendations: string;
    issues_reported: string;
  }>): Promise<ApiResponse<any>> {
    try {
      const { data, error } = await supabase
        .from('telecom_reports')
        .update(reportData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error: any) {
      console.error('Update telecom report error:', error);
      return { success: false, error: error.message };
    }
  }

  // CT Power Reports
  static async getCTPowerReports(): Promise<ApiResponse<any[]>> {
    try {
      const { data, error } = await supabase
        .from('ct_power_reports')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { success: true, data: data || [] };
    } catch (error: any) {
      console.error('Get CT power reports error:', error);
      return { success: false, error: error.message };
    }
  }

  static async createCTPowerReport(reportData: {
    site_id: string;
    report_datetime: string;
    diesel_level: number;
    generator_runtime: number;
    power_reading?: number;
    battery_status?: string;
    comments?: string;
    status?: string;
    report_number?: string;
  }): Promise<ApiResponse<any>> {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('ct_power_reports')
        .insert({
          ...reportData,
          created_by: user.user.id
        })
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error: any) {
      console.error('Create CT power report error:', error);
      return { success: false, error: error.message };
    }
  }

  // Leave Requests
  static async getLeaveRequests(userId?: string): Promise<ApiResponse> {
    try {
      let query = supabase
        .from('leave_requests')
        .select(`
          *,
          user:profiles!leave_requests_user_id_fkey(full_name),
          approver:profiles!leave_requests_approved_by_fkey(full_name)
        `)
        .order('created_at', { ascending: false });

      if (userId) {
        query = query.eq('user_id', userId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return { success: true, data };
    } catch (error: any) {
      console.error('Get leave requests error:', error);
      return { success: false, error: error.message };
    }
  }

  static async createLeaveRequest(request: any): Promise<ApiResponse> {
    try {
      const { data, error } = await supabase
        .from('leave_requests')
        .insert(request)
        .select()
        .single();

      if (error) throw error;

      toast.success('Leave request submitted successfully');
      return { success: true, data };
    } catch (error: any) {
      console.error('Create leave request error:', error);
      toast.error('Failed to submit leave request');
      return { success: false, error: error.message };
    }
  }

  static async updateLeaveRequest(id: string, updates: any): Promise<ApiResponse> {
    try {
      const { data, error } = await supabase
        .from('leave_requests')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      toast.success('Leave request updated successfully');
      return { success: true, data };
    } catch (error: any) {
      console.error('Update leave request error:', error);
      toast.error('Failed to update leave request');
      return { success: false, error: error.message };
    }
  }
}

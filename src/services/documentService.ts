
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export class DocumentService {
  static async uploadFile(file: File, folder: string = 'documents'): Promise<{ success: boolean; url?: string; error?: string }> {
    try {
      const fileExt = file.name.split('.').pop()?.toLowerCase();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${folder}/${fileName}`;

      // Upload file
      const { data, error } = await supabase.storage
        .from('documents')
        .upload(filePath, file);

      if (error) throw error;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('documents')
        .getPublicUrl(filePath);

      return { success: true, url: publicUrl };
    } catch (error: any) {
      console.error('File upload error:', error);
      return { success: false, error: error.message };
    }
  }

  static async deleteFile(filePath: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase.storage
        .from('documents')
        .remove([filePath]);

      if (error) throw error;
      return { success: true };
    } catch (error: any) {
      console.error('File delete error:', error);
      return { success: false, error: error.message };
    }
  }

  static async analyzeDocument(file: File): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      // Upload file first
      const uploadResult = await this.uploadFile(file, 'analysis');
      if (!uploadResult.success) {
        throw new Error(uploadResult.error);
      }

      // Call AI analysis function
      const { data, error } = await supabase.functions.invoke('analyze-and-notify', {
        body: {
          file_url: uploadResult.url,
          file_name: file.name,
          file_type: file.type
        }
      });

      if (error) throw error;

      toast.success('Document analysis completed');
      return { success: true, data };
    } catch (error: any) {
      console.error('Document analysis error:', error);
      toast.error('Failed to analyze document');
      return { success: false, error: error.message };
    }
  }

  static getFileIcon(fileType: string): string {
    if (fileType.includes('pdf')) return '📄';
    if (fileType.includes('image')) return '🖼️';
    if (fileType.includes('video')) return '🎥';
    if (fileType.includes('audio')) return '🎵';
    if (fileType.includes('spreadsheet') || fileType.includes('excel')) return '📊';
    if (fileType.includes('presentation')) return '📽️';
    if (fileType.includes('word') || fileType.includes('document')) return '📝';
    return '📎';
  }

  static formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}

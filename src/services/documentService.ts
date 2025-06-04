
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { DocumentAnalysis, analyzeDocument as aiAnalyzeDocument } from "@/lib/ai/documentAI";
import { useAuth } from "@/hooks/useAuth";

export class DocumentService {
  /**
   * Validates a file before upload
   */
  static validateFile(file: File, options: { maxSizeMB?: number, allowedTypes?: string[] } = {}): { valid: boolean; error?: string } {
    const maxSize = (options.maxSizeMB || 25) * 1024 * 1024; // Default 25MB
    const allowedTypes = options.allowedTypes || [
      'application/pdf', 
      'text/plain', 
      'application/msword', 
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];
    
    // Validate file size
    if (file.size > maxSize) {
      return { 
        valid: false, 
        error: `File too large. Maximum size is ${options.maxSizeMB || 25}MB.` 
      };
    }
    
    // Validate file type
    if (!allowedTypes.includes(file.type)) {
      return { 
        valid: false, 
        error: "Invalid file type. Please select a supported document type." 
      };
    }
    
    return { valid: true };
  }
  
  /**
   * Uploads a file to storage
   */
  static async uploadFile(file: File, folder: string = 'documents'): Promise<{ success: boolean; url?: string; path?: string; error?: string }> {
    try {
      // Validate file
      const validation = this.validateFile(file);
      if (!validation.valid) {
        return { success: false, error: validation.error };
      }
      
      const fileExt = file.name.split('.').pop()?.toLowerCase();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${folder}/${fileName}`;

      // Upload file with progress tracking
      const { data, error } = await supabase.storage
        .from('documents')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('documents')
        .getPublicUrl(filePath);

      return { 
        success: true, 
        url: publicUrl,
        path: filePath
      };
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

  /**
   * Analyzes a document using AI
   */
  static async analyzeDocument(file: File, userId: string): Promise<{ success: boolean; data?: DocumentAnalysis; error?: string }> {
    let isSubmitting = true;
    let validationErrors: string[] = [];
    
    try {
      // Validate file
      const validation = this.validateFile(file);
      if (!validation.valid) {
        validationErrors.push(validation.error || 'Invalid file');
        return { success: false, error: validation.error };
      }
      
      // Show toast for analysis start
      toast.info('Starting document analysis...', {
        duration: 3000,
        id: `analysis-${file.name}`
      });
      
      // Use the AI document analyzer
      const analysisResult = await aiAnalyzeDocument(file, userId);
      
      // Show success toast
      toast.success('Document analysis completed', {
        id: `analysis-${file.name}`,
        duration: 5000
      });
      
      return { 
        success: true, 
        data: analysisResult 
      };
    } catch (error: any) {
      console.error('Document analysis error:', error);
      
      // Show error toast
      toast.error(`Analysis failed: ${error.message || 'Unknown error'}`, {
        id: `analysis-${file.name}`,
        duration: 5000
      });
      
      validationErrors.push(error.message || 'Analysis failed');
      return { 
        success: false, 
        error: error.message 
      };
    } finally {
      isSubmitting = false;
    }
  }
  
  /**
   * Gets document analyses for a user
   */
  static async getDocumentAnalyses(userId: string): Promise<{ success: boolean; data?: DocumentAnalysis[]; error?: string }> {
    try {
      // Check if document_analyses table exists
      const { count, error: checkError } = await supabase
        .from('document_analyses')
        .select('id', { count: 'exact', head: true });
      
      let data;
      
      if (!checkError && count !== null) {
        // Use dedicated document_analyses table
        const { data: analysesData, error } = await supabase
          .from('document_analyses')
          .select('*')
          .eq('created_by', userId)
          .order('created_at', { ascending: false });

        if (error) throw error;
        data = analysesData;
      } else {
        // Fall back to memos table
        const { data: memosData, error } = await supabase
          .from('memos')
          .select('*')
          .eq('created_by', userId)
          .like('title', 'Document Analysis:%')
          .order('created_at', { ascending: false });

        if (error) throw error;

        data = memosData.map(memo => {
          let analysisResult;
          try {
            analysisResult = JSON.parse(memo.content);
          } catch {
            analysisResult = { summary: memo.content };
          }
          
          return {
            id: memo.id,
            file_name: memo.title.replace('Document Analysis: ', ''),
            analysis_result: analysisResult,
            status: memo.status || 'completed',
            created_by: memo.created_by || userId,
            created_at: memo.created_at
          };
        });
      }
      
      return { success: true, data };
    } catch (error: any) {
      console.error('Error fetching document analyses:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Gets an icon for a file type
   */
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
  
  /**
   * Gets a document type label based on file type
   */
  static getDocumentTypeLabel(fileType: string): string {
    if (fileType.includes('pdf')) return 'PDF Document';
    if (fileType.includes('image')) return 'Image';
    if (fileType.includes('video')) return 'Video';
    if (fileType.includes('audio')) return 'Audio';
    if (fileType.includes('spreadsheet') || fileType.includes('excel')) return 'Spreadsheet';
    if (fileType.includes('presentation')) return 'Presentation';
    if (fileType.includes('word')) return 'Word Document';
    if (fileType.includes('text/plain')) return 'Text Document';
    if (fileType.includes('csv')) return 'CSV Data';
    return 'Document';
  }

  static formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}
